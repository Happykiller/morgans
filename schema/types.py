# schema/types.py
import strawberry
from strawberry.scalars import JSON 

@strawberry.input
class MailInput:
    to: str
    subject: str
    body: str
    html: bool = False

@strawberry.type
class MailResponse:
    success: bool
    message: str

@strawberry.input
class MailTemplateInput:
    to: str
    subject: str
    template: str
    variables: JSON
    locale: str = "fr"
