from flask_pymongo import PyMongo
from flask_socketio import SocketIO
from flask_jwt_extended import JWTManager


mongo = PyMongo()
jwt = JWTManager()
socket = SocketIO(logger=True, cors_allowed_origins="http://localhost:5173")
