# schema/queries.py
import strawberry

@strawberry.type
class Query:
    @strawberry.field
    def ping(self) -> str:
        return "pong"