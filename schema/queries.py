# schema/queries.py
import strawberry

def get_version():
    try:
        with open("VERSION", "r") as f:
            return f.read().strip()
    except FileNotFoundError:
        return "unknown"

@strawberry.type
class SystemInfo:
    version: str

    @strawberry.field
    def version(self) -> str:
        return get_version()

@strawberry.type
class Query:
    @strawberry.field
    def ping(self) -> str:
        return "pong"

    @strawberry.field
    def system(self) -> SystemInfo:
        return SystemInfo()
