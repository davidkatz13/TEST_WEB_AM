from typing import Annotated
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from database.database_connection import database_handler
from schemas.request.user_request_schema import UserRegistrationSchema
from queries.user_queries import UserQueries
from core.authorization import AuthorizationService
from schemas.response.user_response_schema import Token, UserResponseSchema


router = APIRouter(
    prefix="/users",
    tags=["users"],
)


@router.get("/")
def get_users(session: Session = Depends(database_handler.get_session)):
    user_queries = UserQueries(db_session=session)


@router.post("/", response_model=UserResponseSchema)
def create_user(
    user_data: UserRegistrationSchema,
    session: Session = Depends(database_handler.get_session),
):
    try:
        auth_service = AuthorizationService(db_session=session)
        user = auth_service.create_user(user_registration_sheme=user_data)

        return user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVE_ERROR, detail=str(e)
        )


@router.patch("/{user_id}")
def update_user(session: Session = Depends(database_handler.get_session)):
    user_queries = UserQueries(db_session=session)


@router.delete("/{user_id}")
def delete_user(session: Session = Depends(database_handler.get_session)):
    user_queries = UserQueries(db_session=session)


@router.post("/login", response_model=Token)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: Session = Depends(database_handler.get_session),
):
    auth_service = AuthorizationService(db_session=session)
    user = auth_service.authenticate_user(
        email=form_data.username, password=form_data.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=30)
    access_token = auth_service.create_access_token(
        user_data={"sub": user.email}, expires_delta=access_token_expires
    )

    return Token(access_token=access_token, token_type="bearer", email=user.email)
