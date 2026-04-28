# schema/queries.py
import json
from typing import Optional

import strawberry

from config import settings
from schema.bulk_types import BulkJobError, BulkJobStatus

def get_version():
    try:
        with open("VERSION", "r") as f:
            return f.read().strip()
    except FileNotFoundError:
        return "unknown"

@strawberry.type
class SystemInfo:
    smtp_host: str
    smtp_port: int
    smtp_user: str | None
    mail_from: str | None
    smtp_tls: bool

    @strawberry.field
    def version(self) -> str:
        return get_version()

@strawberry.type
class Query:
    @strawberry.field
    def ping(self) -> str:
        return "pong"

    @strawberry.field
    def system(self) -> SystemInfo:
        return SystemInfo(
            smtp_host=settings.SMTP_HOST,
            smtp_port=settings.SMTP_PORT,
            smtp_user=settings.SMTP_USER,
            mail_from=settings.MAIL_FROM,
            smtp_tls=settings.SMTP_TLS
        )

    @strawberry.field
    async def bulk_job(self, info: strawberry.types.Info, id: str) -> Optional[BulkJobStatus]:
        redis = info.context["arq_pool"]
        data = await redis.hgetall(f"job:{id}")
        if not data:
            return None
        errors_raw = json.loads(data.get("errors", "[]"))
        return BulkJobStatus(
            id=id,
            status=data.get("status", "unknown"),
            total=int(data.get("total", 0)),
            sent=int(data.get("sent", 0)),
            failed=int(data.get("failed", 0)),
            errors=[BulkJobError(email=e.get("email"), error=e["error"]) for e in errors_raw],
            started_at=data.get("started_at"),
            completed_at=data.get("completed_at"),
        )
