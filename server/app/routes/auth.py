import re
import secrets
from app.extensions import mongo
from bson.objectid import ObjectId
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    jwt_required, create_access_token,
    create_refresh_token, get_jwt_identity,
    set_refresh_cookies, unset_jwt_cookies
)


auth = Blueprint('auth', __name__, url_prefix='/api/v1/auth')

@auth.route('/register', methods=['POST'])
def register_user():
    email = request.json.get('email', None)
    fullName = request.json.get('fullName', None)
    password = request.json.get('password', None)

    if not email or not fullName or not password:
        resp = jsonify({'register': False, 'error': 'all fields are required'})
        return resp, 400

    email_regex = re.compile(r"^[a-zA-Z0-9._%+-]{2,20}@[a-zA-Z0-9.-]+.[a-zA-Z]{2,5}$")
    fullName_regex = re.compile(r"^[a-zA-Z'’-]{2,20} [a-zA-Z'’-]{2,20}$")
    password_regex = re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{12,64}$")

    if not email_regex.match(email):
        return jsonify({'register': False, 'error': 'Email format not valid'}), 400
    if not fullName_regex.match(fullName):
        return jsonify({'register': False, 'error': 'Full Name format not valid'}), 400
    if not password_regex.match(password):
        return jsonify({'register': False, 'error': 'Password format not valid'}), 400

    try:
        db = mongo.db

        user = db.users.find_one({'email': email})
        if user is not None:
            return jsonify({'register': False, 'error': 'This email is already taken'}), 409

        while True:
            username = f'{fullName.split()[0]}{secrets.token_hex(4)}'
            user = db.users.find_one({'username': username})
            if user is None:
                break

        db.users.insert_one({
            'email': email,
            'username': username,
            'fullName': fullName,
            'password': generate_password_hash(password, method='pbkdf2:sha256', salt_length=16),
            'createdAt': datetime.now(),
            'updatedAt': datetime.now()
        })
    except Exception as e:
        return jsonify({'register': False, 'error': e}), 500
    return jsonify({'register': True, 'msg': 'User registered successfully'}), 201


@auth.route('/login', methods=['POST'])
def login():
    login_identifier = request.json.get('loginIdentifier', None)
    password = request.json.get('passwd', None)
    remember = request.json.get('remember', False)

    if login_identifier is None or password is None:
        return jsonify({'login': False, 'error': 'All fields are required'}), 400

    try :
        db = mongo.db

        email_regexex = re.compile(r"^[a-zA-Z0-9._%+-]{2,20}@[a-zA-Z0-9.-]+.[a-zA-Z]{2,5}$")
        if email_regexex.match(login_identifier):
            email = login_identifier
            user = db.users.find_one({'email': email})
        else:
            username = login_identifier
            user = db.users.find_one({'username': username})

        if user is None:
            return jsonify({'login': False, 'error': 'Invalid credentials'}), 401

        hashed_passwd = user['password']
        if not check_password_hash(hashed_passwd, password):
            return jsonify({'login': False, 'error': 'Invalid credentials'}), 401

        access_expires = timedelta(minutes=60)
        refresh_expires = timedelta(days=1) if not remember else timedelta(days=30)
        access_token = create_access_token(identity=str(user['_id']), expires_delta=access_expires)
        refresh_token = create_refresh_token(identity=str(user['_id']), expires_delta=refresh_expires)

        del user['password']
        user['_id'] = str(user['_id'])
        resp = jsonify({'login': True, 'access_token': access_token, 'user': user})
        set_refresh_cookies(resp, refresh_token)

        return resp, 200
    except Exception as e:
        print(str(e))
        return jsonify({'login': True, 'error': 'Login Failed, due to server error, please try again later!'}), 500


@auth.route('/token/refresh')
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    access_expires = timedelta(minutes=60)
    access_token = create_access_token(identity=current_user, expires_delta=access_expires)

    user_id = ObjectId(current_user)
    user = mongo.db.users.find_one({'_id': user_id})

    del user['password']
    user['_id'] = str(user['_id'])
    resp = jsonify({'refresh': True, 'access_token': access_token, 'user': user})
    return resp, 200


@auth.route('/logout', methods=['POST'])
def logout():
    resp = jsonify({'logout': True})
    unset_jwt_cookies(resp)
    return resp, 200
