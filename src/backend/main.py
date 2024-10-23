from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import user_router
from routers import asset_management_router


app = FastAPI()

origins = ["http://localhost:3000", "*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router.router)
app.include_router(asset_management_router.router)


@app.get("/")
def say_hello():
    return "hello"
