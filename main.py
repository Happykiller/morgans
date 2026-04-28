# main.py
import strawberry
from arq import create_pool
from arq.connections import RedisSettings
from fastapi import FastAPI, Request
from strawberry.fastapi import GraphQLRouter

from config import settings
from logging_utils import configure_logging
from schema.mutations import Mutation
from schema.queries import Query


configure_logging(settings.LOG_LEVEL)

app = FastAPI()


@app.on_event("startup")
async def startup():
    app.state.arq_pool = await create_pool(RedisSettings.from_dsn(settings.REDIS_URL))


@app.on_event("shutdown")
async def shutdown():
    await app.state.arq_pool.aclose()


async def get_context(request: Request):
    return {"arq_pool": request.app.state.arq_pool}


schema = strawberry.Schema(query=Query, mutation=Mutation)
app.include_router(GraphQLRouter(schema, context_getter=get_context), prefix="/graphql")
