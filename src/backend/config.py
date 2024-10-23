import os

from dotenv import load_dotenv

env_path = os.path.join(os.getcwd(), ".env")
load_dotenv(env_path)


# DATABASE
USERNAME = os.getenv("USER")
PASSWORD = os.getenv("PASSWORD")
PORT = os.getenv("PORT")
DATABASE_NAME = os.getenv("DATABASE_NAME")
DB_INSTANCE = os.getenv("DB_INSTANCE")
DB_HOST = os.getenv("DB_HOST")


# SECURITY
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRES_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRES_MINUTES")
