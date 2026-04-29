import csv
import json
from datetime import datetime, timezone
from pathlib import Path

from arq.connections import RedisSettings

from config import settings
from logging_utils import configure_logging
from logging_utils import get_logger
from mail.rate_limiter import SmoothedWindowLimiter
from mail.smtp import send_email_with_template

configure_logging(settings.LOG_LEVEL)
logger = get_logger("morgans.worker")

_JOB_TTL = 7 * 24 * 3600
_BULK_ROOT = Path(settings.BULK_CSV_DIR).resolve()
_BULK_JOBS_SET = "bulk:jobs"
_BULK_ACTIVE_JOBS_SET = "bulk:jobs:active"
_PROGRESS_LOG_INTERVAL = 5


def resolve_bulk_csv_path(csv_path: str) -> Path:
    """Resolve a CSV path strictly within BULK_CSV_DIR."""
    candidate = Path(csv_path)
    if candidate.is_absolute():
        raise ValueError("absolute CSV paths are not allowed")

    resolved = (_BULK_ROOT / candidate).resolve()

    try:
        resolved.relative_to(_BULK_ROOT)
    except ValueError as error:
        raise ValueError("CSV path must stay within BULK_CSV_DIR") from error

    return resolved


async def bulk_send_job(ctx, csv_path: str, template: str, subject: str, job_id: str):
    redis = ctx["redis"]
    limiter: SmoothedWindowLimiter = ctx["rate_limiter"]

    try:
        full_path = resolve_bulk_csv_path(csv_path)
        with full_path.open(newline="", encoding="utf-8") as f:
            rows = list(csv.DictReader(f))
    except Exception as e:
        await redis.hset(f"job:{job_id}", mapping={"status": "failed", "detail": str(e), "total": 0, "sent": 0, "failed": 0, "errors": "[]"})
        await redis.expire(f"job:{job_id}", _JOB_TTL)
        await redis.sadd(_BULK_JOBS_SET, job_id)
        await redis.srem(_BULK_ACTIVE_JOBS_SET, job_id)
        logger.error("bulk_job_csv_error", extra={"event": "bulk_job_csv_error", "recipient": "-", "subject": subject[:80], "template": template, "status": "failed", "detail": str(e)})
        return

    total = len(rows)
    await redis.hset(f"job:{job_id}", mapping={
        "status": "running",
        "csv_file": csv_path,
        "template": template,
        "subject": subject,
        "total": total,
        "sent": 0,
        "failed": 0,
        "errors": json.dumps([]),
        "started_at": datetime.now(timezone.utc).isoformat(),
    })
    await redis.expire(f"job:{job_id}", _JOB_TTL)

    sent = 0
    failed = 0
    errors = []

    logger.info(
        "bulk_job_started",
        extra={
            "event": "bulk_job_started",
            "recipient": "-",
            "subject": "-",
            "template": template,
            "status": "running",
            "detail": (
                f"job_id={job_id} total={total} csv={csv_path} "
                f"distribution=smoothed_window slot_preview={limiter.preview_slots()}"
            ),
        },
    )

    for index, row in enumerate(rows, start=1):
        email = row.pop("email", None)
        if not email:
            failed += 1
            errors.append({"email": None, "error": "missing email column"})
            await _update_progress(redis, job_id, sent, failed, errors)
            logger.warning(
                "bulk_job_progress",
                extra={
                    "event": "bulk_job_progress",
                    "recipient": "-",
                    "subject": "-",
                    "template": template,
                    "status": "running",
                    "detail": f"job_id={job_id} index={index}/{total} sent={sent} failed={failed} skipped=missing_email",
                },
            )
            continue

        throttle = await limiter.acquire()

        try:
            await send_email_with_template(to=email, subject=subject, template_name=template, variables=row)
            sent += 1
            item_status = "sent"
        except Exception as e:
            failed += 1
            errors.append({"email": email, "error": str(e)})
            item_status = "failed"
            logger.exception("bulk_send_item_failed", extra={"event": "bulk_send_item_failed", "recipient": email, "subject": "-", "template": template, "status": "failed", "detail": type(e).__name__})

        await _update_progress(redis, job_id, sent, failed, errors)
        should_log_progress = (
            index == 1
            or index == total
            or index % _PROGRESS_LOG_INTERVAL == 0
            or item_status == "failed"
        )
        if should_log_progress:
            logger.debug(
                "bulk_job_progress",
                extra={
                    "event": "bulk_job_progress",
                    "recipient": "-",
                    "subject": "-",
                    "template": template,
                    "status": item_status,
                    "detail": (
                        f"job_id={job_id} index={index}/{total} "
                        f"sent={sent} failed={failed} "
                        f"last_waited={float(throttle['waited_seconds']):.3f}s "
                        f"slot={int(throttle['slot_index']) + 1}"
                    ),
                },
            )

    final_status = "completed" if failed == 0 else "partial_failure"
    await redis.hset(f"job:{job_id}", mapping={
        "status": final_status,
        "completed_at": datetime.now(timezone.utc).isoformat(),
    })
    await redis.sadd(_BULK_JOBS_SET, job_id)
    await redis.srem(_BULK_ACTIVE_JOBS_SET, job_id)
    await redis.expire(_BULK_JOBS_SET, _JOB_TTL)
    await redis.expire(_BULK_ACTIVE_JOBS_SET, _JOB_TTL)

    logger.info("bulk_job_completed", extra={"event": "bulk_job_completed", "recipient": "-", "subject": "-", "template": template, "status": final_status, "detail": f"job_id={job_id} sent={sent} failed={failed}"})


async def _update_progress(redis, job_id: str, sent: int, failed: int, errors: list):
    await redis.hset(f"job:{job_id}", mapping={
        "sent": sent,
        "failed": failed,
        "errors": json.dumps(errors[-100:]),
    })


def resolve_rate_limit() -> tuple[int, int, str]:
    return (
        settings.SMTP_THROTTLE_MAX_ITERATIONS,
        settings.SMTP_THROTTLE_WINDOW_MINUTES * 60,
        f"{settings.SMTP_THROTTLE_WINDOW_MINUTES}min",
    )


async def on_startup(ctx):
    rate, period_seconds, period_label = resolve_rate_limit()

    logger.info(
        "runtime_config_loaded",
        extra={
            "event": "runtime_config_loaded",
            "recipient": "-",
            "subject": "-",
            "template": "-",
            "status": "starting",
            "detail": " ".join(f"{key}={value}" for key, value in settings.debug_summary().items()),
        },
    )
    ctx["rate_limiter"] = SmoothedWindowLimiter(
        max_iterations=rate,
        window_seconds=period_seconds,
    )
    logger.info(
        "worker_started",
        extra={
            "event": "worker_started",
            "recipient": "-",
            "subject": "-",
            "template": "-",
            "status": "started",
            "detail": (
                f"rate={rate}/{period_label} distribution=smoothed_window"
            ),
        },
    )


class WorkerSettings:
    functions = [bulk_send_job]
    on_startup = on_startup
    redis_settings = RedisSettings.from_dsn(settings.REDIS_URL)
