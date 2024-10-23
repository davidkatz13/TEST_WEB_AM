from uuid import UUID
from sqlalchemy.orm import Session

from database.tables import UsersDB
from schemas.request.user_request_schema import UserRegistrationSchema


class UserQueries:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def get_all_users(self):
        users = self.db_session.query(UsersDB).all()

        return users

    def get_user_by_id(self, user_id: UUID):
        user = self.db_session.query(UsersDB).filter(UsersDB.id == user_id).first()

        return user

    def get_user_by_email(self, email: str):
        user = self.db_session.query(UsersDB).filter(UsersDB.email == email).first()

        return user

    def update_user_by_id(self, user_id: UUID):
        pass

    def delete_user_by_id(self, user_id: UUID):
        pass
