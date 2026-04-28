import csv
import json
import os
from datetime import datetime, timezone

from arq.connections import RedisSettings

from config import settings
from logging_utils import get_logger
from mail.rate_limiter import TokenBucket
from mail.smtp import send_email_with_template

logger = get_logger("morgans.worker")

_JOB_TTL = 7 * 24 * 3600


async def bulk_send_job(ctx, csv_path: str, template: str, subject: str, job_id: str):
    redis = ctx["redis"]
    bucket: TokenBucket = ctx["token_bucket"]

    full_path = os.path.join(settings.BULK_CSV_DIR, csv_path) if not os.path.isabs(csv_path) else csv_path

    try:
        with open(full_path, newline="", encoding="utf-8") as f:
            rows = list(csv.DictReader(f))
    except Exception as e:
        await redis.hset(f"job:{job_id}", mapping={"status": "failed", "detail": str(e), "total": 0, "sent": 0, "failed": 0, "errors": "[]"})
        await redis.expire(f"job:{job_id}", _JOB_TTL)
        logger.error("bulk_job_csv_error", extra={"event": "bulk_job_csv_error", "recipient": "-", "subject": subject[:80], "template": template, "status": "failed", "detail": str(e)})
        return

    total = len(rows)
    await redis.hset(f"job:{job_id}", mapping={
        "status": "running",
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

    for row in rows:
        email = row.pop("email", None)
        if not email:
            failed += 1
            errors.append({"email": None, "error": "missing email column"})
            await _update_progress(redis, job_id, sent, failed, errors)
            continue

        await bucket.acquire()

        try:
            await send_email_with_template(to=email, subject=subject, template_name=template, variables=row)
            sent += 1
        except Exception as e:
            failed += 1
            errors.append({"email": email, "error": str(e)})
            logger.exception("bulk_send_item_failed", extra={"event": "bulk_send_item_failed", "recipient": email, "subject": subject[:80], "template": template, "status": "failed", "detail": type(e).__name__})

        await _update_progress(redis, job_id, sent, failed, errors)

    final_status = "completed" if failed == 0 else "partial_failure"
    await redis.hset(f"job:{job_id}", mapping={
        "status": final_status,
        "completed_at": datetime.now(timezone.utc).isoformat(),
    })

    logger.info("bulk_job_completed", extra={"event": "bulk_job_completed", "recipient": "-", "subject": subject[:80], "template": template, "status": final_status, "detail": f"job_id={job_id} sent={sent} failed={failed}"})


async def _update_progress(redis, job_id: str, sent: int, failed: int, errors: list):
    await redis.hset(f"job:{job_id}", mapping={
        "sent": sent,
        "failed": failed,
        "errors": json.dumps(errors[-100:]),
    })


async def on_startup(ctx):
    ctx["token_bucket"] = TokenBucket(
        rate_per_hour=settings.SMTP_RATE_PER_HOUR,
        burst=settings.SMTP_CONCURRENCY,
    )
    logger.info("worker_started", extra={"event": "worker_started", "recipient": "-", "subject": "-", "template": "-", "status": "started", "detail": f"rate={settings.SMTP_RATE_PER_HOUR}/h burst={settings.SMTP_CONCURRENCY}"})


class WorkerSettings:
    functions = [bulk_send_job]
    on_startup = on_startup
    redis_settings = RedisSettings.from_dsn(settings.REDIS_URL)
