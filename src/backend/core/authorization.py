from datetime import timedelta, datetime, timezone
from typing import Annotated

import jwt
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from queries.user_queries import UserQueries
from database.tables import UsersDB
from config import SECRET_KEY, ALGORITHM
from schemas.response.user_response_schema import TokenData
from schemas.request.user_request_schema import UserRegistrationSchema

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class AuthorizationService:
    def __init__(self, db_session: Session):
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.db_session = db_session

    def create_access_token(
        self, user_data: dict, expires_delta: timedelta | None = None
    ):
        to_encode = user_data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=15)

        to_encode.update({"exp": expire})

        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

        return encoded_jwt

    def verify_password(self, plain_password: str, hashed_password: str):
        return self.pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str):
        return self.pwd_context.hash(password)

    def authenticate_user(self, email: str, password: str):
        # instantiate user queries class
        user_queries = UserQueries(db_session=self.db_session)

        # get user by email
        user = user_queries.get_user_by_email(email=email)

        if not user:
            return False

        # check password
        hashed_password = self.get_password_hash(password=password)
        if not self.verify_password(
            plain_password=password, hashed_password=hashed_password
        ):
            return False

        return user

    async def get_current_user(self, token: Annotated[str, Depends(oauth2_scheme)]):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithm=[ALGORITHM])
            email: str = payload.get("sub")

            if email is None:
                raise credentials_exception

            token_data = TokenData(email=email)
        except InvalidTokenError:
            raise credentials_exception

        # get user
        # instantiate user queries class
        user_queries = UserQueries(db_session=self.db_session)

        # get user by email
        user = user_queries.get_user_by_email(email=email)
        if user is None:
            raise credentials_exception

        return user

    def create_user(self, user_registration_sheme: UserRegistrationSchema):
        try:
            # check if the user exists
            user_query = UserQueries(db_session=self.db_session)
            user_exists = user_query.get_user_by_email(
                email=user_registration_sheme.email
            )
            if user_exists:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User can not be created, as it already exists!",
                )
            # hash password
            hashed_password = self.get_password_hash(
                password=user_registration_sheme.password
            )
            new_user = UsersDB(
                email=user_registration_sheme.email,
                username=user_registration_sheme.email,
                password=hashed_password,
            )
            self.db_session.add(new_user)
            self.db_session.commit()

            return new_user

        except Exception as e:
            self.db_session.rollback()
            raise e
