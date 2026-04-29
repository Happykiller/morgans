# config.py
from typing import Optional

from pydantic_settings import BaseSettings
from pydantic_settings import SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", ".env.dev"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    SMTP_HOST: str
    SMTP_PORT: int
    SMTP_USER: Optional[str] = None
    SMTP_TLS: Optional[bool] = False
    SMTP_PASSWORD: Optional[str] = None
    MAIL_FROM: Optional[str] = None
    LOG_LEVEL: str = "INFO"

    REDIS_URL: str = "redis://localhost:6379"
    SMTP_THROTTLE_MAX_ITERATIONS: int = 200
    SMTP_THROTTLE_WINDOW_MINUTES: int = 60
    BULK_CSV_DIR: str = "/app/bulk"

    def debug_summary(self) -> dict[str, str]:
        return {
            "SMTP_HOST": self.SMTP_HOST,
            "SMTP_PORT": str(self.SMTP_PORT),
            "SMTP_USER": self.SMTP_USER or "-",
            "SMTP_TLS": str(bool(self.SMTP_TLS)).lower(),
            "MAIL_FROM": self.MAIL_FROM or "-",
            "LOG_LEVEL": self.LOG_LEVEL,
            "REDIS_URL": self.REDIS_URL,
            "SMTP_THROTTLE_MAX_ITERATIONS": str(self.SMTP_THROTTLE_MAX_ITERATIONS),
            "SMTP_THROTTLE_WINDOW_MINUTES": str(self.SMTP_THROTTLE_WINDOW_MINUTES),
            "BULK_CSV_DIR": self.BULK_CSV_DIR,
        }


settings = Settings()
