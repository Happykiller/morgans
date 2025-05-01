# schema/mutations.py
import strawberry

from schema.types import MailTemplateInput
from schema.types import MailInput, MailResponse
from mail.smtp import send_email, send_email_with_template

@strawberry.type
class Mutation:
    @strawberry.mutation
    async def send_mail(self, input: MailInput) -> MailResponse:
        try:
            await send_email(
                to=input.to,
                subject=input.subject,
                body=input.body,
                html=input.html
            )
            return MailResponse(success=True, message="Email sent")
        except Exception as e:
            return MailResponse(success=False, message=str(e))
        
    @strawberry.mutation
    async def send_mail_with_template(self, input: MailTemplateInput) -> MailResponse:
        try:
            await send_email_with_template(
                to=input.to,
                subject=input.subject,
                template_name=input.template,
                variables=input.variables
            )
            return MailResponse(success=True, message="Email sent with template")
        except Exception as e:
            return MailResponse(success=False, message=str(e))