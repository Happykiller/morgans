# mail/smtp.py
import os
import aiosmtplib
from jinja2 import Environment, FileSystemLoader, select_autoescape

from config import settings
from email.message import EmailMessage

template_env = Environment(
    loader=FileSystemLoader(os.path.join(os.path.dirname(__file__), "templates/compiled/")),
    autoescape=select_autoescape(["html", "xml"])
)

async def send_email_with_template(to: str, subject: str, template_name: str, variables: dict):
    template = template_env.get_template(template_name)
    rendered_body = template.render(**variables)
    await send_email(to=to, subject=subject, body=rendered_body, html=True)

async def send_email(to: str, subject: str, body: str, html: bool = False):
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

    await aiosmtplib.send(msg, **send_args)
