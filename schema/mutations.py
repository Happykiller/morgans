# schema/mutations.py
import strawberry

from logging_utils import get_logger, utc_timestamp
from mail.smtp import send_email
from mail.smtp import send_email_with_template
from schema.types import MailInput
from schema.types import MailResponse
from schema.types import MailTemplateInput


logger = get_logger("morgans.graphql.mutations")


@strawberry.type
class Mutation:
    @strawberry.mutation
    async def send_mail(self, input: MailInput) -> MailResponse:
        """Send a raw email and log the end-to-end processing status."""
        subject_prefix = input.subject[:80]
        request_ts = utc_timestamp()

        logger.info(
            "mail_request_received",
            extra={
                "event": "mail_request_received",
                "recipient": input.to,
                "subject": subject_prefix,
                "template": "raw",
                "status": "received",
                "detail": f"request_ts={request_ts}",
            },
        )

        try:
            await send_email(
                to=input.to,
                subject=input.subject,
                body=input.body,
                html=input.html,
            )
        except Exception as error:
            logger.exception(
                "mail_processing_failed",
                extra={
                    "event": "mail_processing_failed",
                    "recipient": input.to,
                    "subject": subject_prefix,
                    "template": "raw",
                    "status": "failed",
                    "detail": type(error).__name__,
                },
            )
            return MailResponse(success=False, message=str(error))

        logger.info(
            "mail_processing_succeeded",
            extra={
                "event": "mail_processing_succeeded",
                "recipient": input.to,
                "subject": subject_prefix,
                "template": "raw",
                "status": "succeeded",
                "detail": f"request_ts={request_ts}",
            },
        )
        return MailResponse(success=True, message="Email sent")

    @strawberry.mutation
    async def send_mail_with_template(self, input: MailTemplateInput) -> MailResponse:
        """Send a template-based email and log the processing status."""
        subject_prefix = input.subject[:80]
        request_ts = utc_timestamp()

        logger.info(
            "mail_template_request_received",
            extra={
                "event": "mail_template_request_received",
                "recipient": input.to,
                "subject": subject_prefix,
                "template": input.template,
                "status": "received",
                "detail": f"request_ts={request_ts}",
            },
        )

        try:
            await send_email_with_template(
                to=input.to,
                subject=input.subject,
                template_name=input.template,
                variables=input.variables,
            )
        except Exception as error:
            logger.exception(
                "mail_template_processing_failed",
                extra={
                    "event": "mail_template_processing_failed",
                    "recipient": input.to,
                    "subject": subject_prefix,
                    "template": input.template,
                    "status": "failed",
                    "detail": type(error).__name__,
                },
            )
            return MailResponse(success=False, message=str(error))

        logger.info(
            "mail_template_processing_succeeded",
            extra={
                "event": "mail_template_processing_succeeded",
                "recipient": input.to,
                "subject": subject_prefix,
                "template": input.template,
                "status": "succeeded",
                "detail": f"request_ts={request_ts}",
            },
        )
        return MailResponse(success=True, message="Email sent with template")
