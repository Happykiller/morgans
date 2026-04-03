import os
from email.message import EmailMessage

import aiosmtplib
from jinja2 import Environment, FileSystemLoader, select_autoescape

from config import settings
from logging_utils import get_logger


COMPILED_TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), "templates/compiled/")

template_env = Environment(
    loader=FileSystemLoader(COMPILED_TEMPLATES_DIR),
    autoescape=select_autoescape(["html", "xml"]),
)

logger = get_logger("morgans.smtp")


def resolve_template_name(template_name: str) -> str:
    """Return template name when the file exists in compiled templates."""
    if os.path.exists(os.path.join(COMPILED_TEMPLATES_DIR, template_name)):
        return template_name

    raise FileNotFoundError(f"Template '{template_name}' not found.")


async def send_email_with_template(
    to: str,
    subject: str,
    template_name: str,
    variables: dict,
):
    """Render and send an email from an HTML template."""
    resolved_template_name = resolve_template_name(template_name)
    template = template_env.get_template(resolved_template_name)
    rendered_body = template.render(**variables)

    await send_email(
        to=to,
        subject=subject,
        body=rendered_body,
        html=True,
        template_name=resolved_template_name,
    )


async def send_email(
    to: str,
    subject: str,
    body: str,
    html: bool = False,
    template_name: str | None = None,
):
    """Send an email through SMTP and emit activity logs for observability."""
    if not settings.MAIL_FROM:
        raise ValueError("MAIL_FROM must be set in the environment.")

    msg = EmailMessage()
    msg["From"] = settings.MAIL_FROM
    msg["To"] = to
    msg["Subject"] = subject

    if html:
        msg.add_alternative(body, subtype="html")
    else:
        msg.set_content(body)

    send_args = {
        "hostname": settings.SMTP_HOST,
        "port": settings.SMTP_PORT,
        "use_tls": settings.SMTP_TLS,
    }

    if settings.SMTP_USER:
        send_args["username"] = settings.SMTP_USER
    if settings.SMTP_PASSWORD:
        send_args["password"] = settings.SMTP_PASSWORD

    subject_prefix = subject[:80]

    logger.info(
        "smtp_send_started",
        extra={
            "event": "smtp_send_started",
            "recipient": to,
            "subject": subject_prefix,
            "template": template_name or "raw",
            "status": "started",
            "detail": f"html={html}",
        },
    )

    try:
        await aiosmtplib.send(msg, **send_args)
    except Exception as error:
        logger.exception(
            "smtp_send_failed",
            extra={
                "event": "smtp_send_failed",
                "recipient": to,
                "subject": subject_prefix,
                "template": template_name or "raw",
                "status": "failed",
                "detail": type(error).__name__,
            },
        )
        raise

    logger.info(
        "smtp_send_succeeded",
        extra={
            "event": "smtp_send_succeeded",
            "recipient": to,
            "subject": subject_prefix,
            "template": template_name or "raw",
            "status": "succeeded",
            "detail": "delivered_to_smtp",
        },
    )
