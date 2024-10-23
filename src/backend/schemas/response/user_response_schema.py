from uuid import UUID
from typing import Optional

from pydantic import BaseModel, Field


class UserResponseSchema(BaseModel):
    id: UUID
    email: Optional[str] = None
    username: Optional[str] = None


class Token(BaseModel):
    access_token: str = Field(serialization_alias="accessToken")
    token_type: str = Field(serialization_alias="tokenType")
    email: str


class TokenData(BaseModel):
    email: str | None = None
