# main.py
import strawberry
from fastapi import FastAPI
from schema.queries import Query
from strawberry.fastapi import GraphQLRouter
from schema.mutations import Mutation

schema = strawberry.Schema(query=Query, mutation=Mutation)
app = FastAPI()
app.include_router(GraphQLRouter(schema), prefix="/graphql")