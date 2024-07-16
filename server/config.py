import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    DEBUG = os.environ.get('DEBUG', True)
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev')

    # Database configurations
    MONGO_URI = os.environ.get(
        'MONGO_URI', 'mongodb://localhost:27017/chat_db'
    )

    # JWT cofigurations
    JWT_TOKEN_LOCATION =  ['headers', 'cookies']
    JWT_REFRESH_COOKIE_PATH = 'api/v1/auth/token/refresh'
    JWT_COOKIE_CSRF_PROTECT = True
    JWT_COOKIE_SAMESITE = 'Lax'
    JWT_COOKIE_HTTPONLY = True
    JWT_COOKIE_DOMAIN = None
    JWT_COOKIE_SECURE = os.environ.get('JWT_COOKIE_SECURE', False)
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'super-secret')
