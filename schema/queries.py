# schema/queries.py
import json
from typing import Optional

import strawberry

from config import settings
from schema.bulk_types import BulkJobError, BulkJobStatus

_BULK_JOBS_SET = "bulk:jobs"
_BULK_ACTIVE_JOBS_SET = "bulk:jobs:active"


def require_arq_pool(arq_pool) -> None:
    if arq_pool is None:
        raise RuntimeError("Bulk jobs are unavailable: Redis is not configured or unreachable.")


def get_version():
    try:
        with open("VERSION", "r") as f:
            return f.read().strip()
    except FileNotFoundError:
        return "unknown"


async def is_redis_available(arq_pool) -> bool:
    if arq_pool is None:
        return False

    try:
        await arq_pool.ping()
    except Exception:
        return False

    return True


def decode_redis_hash(data: dict) -> dict[str, str]:
    decoded: dict[str, str] = {}
    for key, value in data.items():
        decoded_key = key.decode("utf-8") if isinstance(key, bytes) else str(key)
        decoded_value = value.decode("utf-8") if isinstance(value, bytes) else str(value)
        decoded[decoded_key] = decoded_value
    return decoded


def build_bulk_job_status(job_id: str, data: dict) -> BulkJobStatus:
    decoded_data = decode_redis_hash(data)
    errors_raw = json.loads(decoded_data.get("errors", "[]"))
    return BulkJobStatus(
        id=job_id,
        status=decoded_data.get("status", "unknown"),
        csv_file=decoded_data.get("csv_file"),
        template=decoded_data.get("template"),
        subject=decoded_data.get("subject"),
        total=int(decoded_data.get("total", 0)),
        sent=int(decoded_data.get("sent", 0)),
        failed=int(decoded_data.get("failed", 0)),
        errors=[BulkJobError(email=e.get("email"), error=e["error"]) for e in errors_raw],
        queued_at=decoded_data.get("queued_at"),
        started_at=decoded_data.get("started_at"),
        completed_at=decoded_data.get("completed_at"),
    )


async def load_bulk_jobs(redis, statuses: set[str] | None = None) -> list[BulkJobStatus]:
    source_key = _BULK_ACTIVE_JOBS_SET if statuses is not None else _BULK_JOBS_SET
    job_ids = await redis.smembers(source_key)
    jobs: list[BulkJobStatus] = []

    for job_id in job_ids:
        decoded_job_id = job_id.decode("utf-8") if isinstance(job_id, bytes) else job_id
        data = await redis.hgetall(f"job:{decoded_job_id}")
        if not data:
            continue

        decoded_data = decode_redis_hash(data)
        status = decoded_data.get("status", "unknown")
        if statuses is not None and status not in statuses:
            continue

        jobs.append(build_bulk_job_status(decoded_job_id, decoded_data))

    jobs.sort(
        key=lambda job: job.queued_at or job.started_at or job.completed_at or "",
        reverse=True,
    )
    return jobs


@strawberry.type
class SystemInfo:
    version: str
    smtp_host: str
    smtp_port: int
    smtp_user: str | None
    mail_from: str | None
    smtp_tls: bool
    redis_url: str
    redis_available: bool

@strawberry.type
class Query:
    @strawberry.field
    def ping(self) -> str:
        return "pong"

    @strawberry.field
    async def system(self, info: strawberry.types.Info) -> SystemInfo:
        arq_pool = info.context["arq_pool"]
        return SystemInfo(
            version=get_version(),
            smtp_host=settings.SMTP_HOST,
            smtp_port=settings.SMTP_PORT,
            smtp_user=settings.SMTP_USER,
            mail_from=settings.MAIL_FROM,
            smtp_tls=settings.SMTP_TLS,
            redis_url=settings.REDIS_URL,
            redis_available=await is_redis_available(arq_pool),
        )

    @strawberry.field
    async def bulk_job(self, info: strawberry.types.Info, id: str) -> Optional[BulkJobStatus]:
        redis = info.context["arq_pool"]
        require_arq_pool(redis)
        data = await redis.hgetall(f"job:{id}")
        if not data:
            return None
        return build_bulk_job_status(id, data)

    @strawberry.field
    async def bulk_jobs_in_progress(
        self,
        info: strawberry.types.Info,
        limit: int = 50,
    ) -> list[BulkJobStatus]:
        redis = info.context["arq_pool"]
        require_arq_pool(redis)
        jobs = await load_bulk_jobs(redis, {"queued", "running"})
        return jobs[:limit]

    @strawberry.field
    async def bulk_jobs(
        self,
        info: strawberry.types.Info,
        limit: int = 50,
    ) -> list[BulkJobStatus]:
        redis = info.context["arq_pool"]
        require_arq_pool(redis)
        jobs = await load_bulk_jobs(redis)
        return jobs[:limit]
