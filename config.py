# config.py
from typing import Optional
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SMTP_HOST: str
    SMTP_PORT: int
    SMTP_USER: Optional[str] = None
    SMTP_TLS: Optional[bool] = False
    SMTP_PASSWORD: Optional[str] = None
    MAIL_FROM: Optional[str] = None

settings = Settings()