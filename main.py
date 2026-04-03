# main.py
import strawberry
from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter

from config import settings
from logging_utils import configure_logging
from schema.mutations import Mutation
from schema.queries import Query


configure_logging(settings.LOG_LEVEL)

schema = strawberry.Schema(query=Query, mutation=Mutation)
app = FastAPI()
app.include_router(GraphQLRouter(schema), prefix="/graphql")
