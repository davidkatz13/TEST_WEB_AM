import re
from pydantic import BaseModel, field_validator


class UserRequestSchema(BaseModel):
    pass


class UserRegistrationSchema(BaseModel):
    email: str
    phone_number: str
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, password: str):
        if len(password) < 8:
            raise ValueError("Passsword can not be shorter than 8 characters!")

        return password

    # here can be added special characters inclusion

    @field_validator("phone_number")
    @classmethod
    def validate_phone_number(cls, phone_number):
        pattern = re.compile(r"^\+\d{1,3}\d{4,14}$")
        if not pattern.match(phone_number):
            raise ValueError(
                "Please insert number in the accepted format, country code and phone number!"
            )

        return phone_number
