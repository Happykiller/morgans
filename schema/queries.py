# schema/queries.py
import strawberry
from config import settings

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
