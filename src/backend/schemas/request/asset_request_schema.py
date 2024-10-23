from typing import Optional

from pydantic import BaseModel, model_validator, field_validator


class CreateAssetRequestSchema(BaseModel):
    name: str
    category: str
    price: float

    @field_validator("price")
    @classmethod
    def validate_non_negative_price(cls, price: float):
        if price < 0:
            raise ValueError("The asset price can not be lower than 0.")

        return price


class UpdateAssetRequestSchema(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None

    @field_validator("price")
    @classmethod
    def validate_non_negative_price(cls, price: float):
        if price < 0:
            raise ValueError("The asset price can not be lower than 0.")

        return price
