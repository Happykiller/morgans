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

settings = Settings()
