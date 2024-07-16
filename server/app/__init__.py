from flask import Flask
from config import Config
from flask_cors import CORS
from .models.setup_db import init_db
from .extensions import mongo, jwt, socket
from flask.helpers import send_from_directory


def create_app(test_config=None):
    app = Flask(__name__)
    CORS(app, supports_credentials=True, origins="http://localhost:5173")

    if test_config is None:
        app.config.from_object(Config)
    else:
        app.config.from_mapping(test_config)

    jwt.init_app(app)
    mongo.init_app(app)
    socket.init_app(app)

    init_db()

    from .routes.auth import auth
    from .routes.home import home

    app.register_blueprint(auth)
    app.register_blueprint(home)

    from . import events

    return app
