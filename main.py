# main.py
import strawberry
from arq import create_pool
from arq.connections import RedisSettings
from fastapi import FastAPI, Request
from strawberry.fastapi import GraphQLRouter

from config import settings
from logging_utils import configure_logging
from logging_utils import get_logger
from schema.mutations import Mutation
from schema.queries import Query


configure_logging(settings.LOG_LEVEL)
logger = get_logger("morgans.app")

app = FastAPI()


def _runtime_config_detail() -> str:
    return " ".join(f"{key}={value}" for key, value in settings.debug_summary().items())


@app.on_event("startup")
async def startup():
    logger.info(
        "runtime_config_loaded",
        extra={
            "event": "runtime_config_loaded",
            "recipient": "-",
            "subject": "-",
            "template": "-",
            "status": "starting",
            "detail": _runtime_config_detail(),
        },
    )
    app.state.arq_pool = None
    try:
        app.state.arq_pool = await create_pool(RedisSettings.from_dsn(settings.REDIS_URL))
    except Exception as error:
        logger.warning(
            "redis_pool_unavailable",
            extra={
                "event": "redis_pool_unavailable",
                "recipient": "-",
                "subject": "-",
                "template": "-",
                "status": "degraded",
                "detail": type(error).__name__,
            },
        )
    else:
        logger.info(
            "redis_pool_ready",
            extra={
                "event": "redis_pool_ready",
                "recipient": "-",
                "subject": "-",
                "template": "-",
                "status": "ready",
                "detail": f"REDIS_URL={settings.REDIS_URL}",
            },
        )


@app.on_event("shutdown")
async def shutdown():
    if app.state.arq_pool is not None:
        await app.state.arq_pool.aclose()


async def get_context(request: Request):
    return {"arq_pool": request.app.state.arq_pool}


schema = strawberry.Schema(query=Query, mutation=Mutation)
app.include_router(GraphQLRouter(schema, context_getter=get_context), prefix="/graphql")
