from sqlalchemy import create_engine, URL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from config import USERNAME, PASSWORD, PORT, DATABASE_NAME, DB_INSTANCE, DB_HOST


class DataBaseHandler:
    def __init__(self) -> None:
        self.username = USERNAME
        self.password = PASSWORD
        self.port = PORT
        self.database_name = DATABASE_NAME
        self.db_instance = DB_INSTANCE
        self.db_host = DB_HOST

        self.DATABASE_URL = URL.create(
            drivername=self.db_instance,
            username="postgres",
            password=self.password,
            host=self.db_host,
            port=self.port,
            database=self.database_name,
        )

        self.engine = create_engine(self.DATABASE_URL)
        self.session_local = sessionmaker(
            autocommit=False, autoflush=False, bind=self.engine
        )

        self.base = declarative_base()

    def get_session(self):
        db = self.session_local()

        try:
            yield db
        finally:
            db.close()


database_handler = DataBaseHandler()
