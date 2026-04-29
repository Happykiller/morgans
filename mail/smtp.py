import os
from email.message import EmailMessage

import aiosmtplib
from jinja2 import Environment, FileSystemLoader, select_autoescape

from config import settings
from logging_utils import get_logger


COMPILED_TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), "templates/compiled/")

_DEFAULT_LOCALE = "en"
_CLASSIC_TAG = ".classic."

template_env = Environment(
    loader=FileSystemLoader(COMPILED_TEMPLATES_DIR),
    autoescape=select_autoescape(["html", "xml"]),
)

logger = get_logger("morgans.smtp")


def normalize_template_name(template_name: str) -> str:
    """Normalize legacy template aliases to a deterministic locale fallback.

    Business rule: if locale is unknown and a `classic` alias is provided,
    default to English (`.en.`) rather than keeping `.classic.`.
    """
    if _CLASSIC_TAG in template_name:
        return template_name.replace(_CLASSIC_TAG, f".{_DEFAULT_LOCALE}.")

    return template_name


def resolve_template_name(template_name: str) -> str:
    """Return an existing compiled template name.

    It first checks the exact requested name, then checks the normalized
    fallback alias (for legacy `.classic.` requests).
    """
    direct_path = os.path.join(COMPILED_TEMPLATES_DIR, template_name)
    if os.path.exists(direct_path):
        return template_name

    normalized_name = normalize_template_name(template_name)
    normalized_path = os.path.join(COMPILED_TEMPLATES_DIR, normalized_name)
    if os.path.exists(normalized_path):
        return normalized_name

    raise FileNotFoundError(f"Template '{template_name}' not found.")


def render_subject(subject_template: str, variables: dict) -> str:
    """Render a subject string with the same variable context as the body."""
    return template_env.from_string(subject_template).render(**variables)


async def send_email_with_template(
    to: str,
    subject: str,
    template_name: str,
    variables: dict,
):
    """Render and send an email from an HTML template."""
    resolved_template_name = resolve_template_name(template_name)
    rendered_subject = render_subject(subject, variables)

    if resolved_template_name != template_name:
        logger.debug(
            "template_alias_normalized",
            extra={
                "event": "template_alias_normalized",
                "recipient": to,
                "subject": "-",
                "template": resolved_template_name,
                "status": "normalized",
                "detail": f"requested={template_name}",
            },
        )

    template = template_env.get_template(resolved_template_name)
    rendered_body = template.render(**variables)

    await send_email(
        to=to,
        subject=rendered_subject,
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

    try:
        await aiosmtplib.send(msg, **send_args)
    except Exception as error:
        logger.exception(
            "smtp_send_failed",
            extra={
                "event": "smtp_send_failed",
                "recipient": to,
                "subject": "-",
                "template": template_name or "raw",
                "status": "failed",
                "detail": type(error).__name__,
            },
        )
        raise

    logger.debug(
        "smtp_send_succeeded",
        extra={
            "event": "smtp_send_succeeded",
            "recipient": to,
            "subject": "-",
            "template": template_name or "raw",
            "status": "succeeded",
            "detail": "delivered_to_smtp",
        },
    )
