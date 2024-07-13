import os
import secrets
from PIL import Image
from datetime import datetime
from app.extensions import mongo
from bson.objectid import ObjectId
from flask import Blueprint, jsonify, current_app, request
from flask_jwt_extended import jwt_required, get_jwt_identity

home = Blueprint('home', __name__, url_prefix='/api/v1/home')


def save_picture(form_picture):
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(form_picture.filename)
    picture_fn = random_hex + f_ext
    picture_path = os.path.join(current_app.root_path, 'static/images/', picture_fn)
    
    output_size = (125, 125)
    i = Image.open(form_picture)
    i.thumbnail(output_size)
    i.save(picture_path)

    return picture_fn


def delete_picture(picture_name):
    picture_path = os.path.join(current_app.root_path, 'static/images/', picture_name)
    if os.path.exists(picture_path):
        os.remove(picture_path)


@home.route('/update_profile_image', methods=['PUT'])
@jwt_required()
def update_profile_image():
    current_user = get_jwt_identity()
    profileImage = request.files.get('profileImage')

    if not profileImage:
        return jsonify({'error': 'please select an image'}), 400

    try:
        user = mongo.db.users.find_one({'_id': ObjectId(current_user)})
        old_image = user.get('profilePicture', '')
        image_fn = save_picture(profileImage)
        result = mongo.db.users.update_one(
            {'_id': ObjectId(current_user)},
            {'$set': {'profilePicture': image_fn}}
        )

        if result.modified_count > 0:
            delete_picture(old_image)
            return jsonify({'msg': 'updated successfully'}), 204
        else:
            return jsonify({'error': 'failed to update'})
    except Exception as e:
        print(e)
        return jsonify({'error': 'server error, try again later!'}), 500


@home.route('/people')
@jwt_required()
def search_people():
    searchQuery = request.args.get('search')
    if not searchQuery:
        return jsonify({'results': []}), 200
    
    users = list(mongo.db.users.find())
    results = []
    for user in users:
        if searchQuery in user['fullName']:
            del user['password']
            del user['createdAt']
            del user['updatedAt']
            user['_id'] = str(user['_id'])
            results.append(user)
    
    return jsonify({'results': results}), 200


@home.route('/group/create', methods=['POST'])
@jwt_required()
def create_group():
    name = request.json.get('name')
    current_user = get_jwt_identity()

    if not name:
        return jsonify({'error': 'group name is required'}), 400
    
    try:
        timestamp = datetime.now()
        chat_data = {
            'name': name,
            'type': 'group',
            'createdAt': timestamp,
            'updatedAt': timestamp,
            'members': [ObjectId(current_user)],
        }
        chat_id = mongo.db.chats.insert_one(chat_data).inserted_id
        chat_data['_id'] = str(chat_id)
        del chat_data['createdAt']
        del chat_data['updatedAt']
        del chat_data['members']

        return jsonify({'created': True, 'group_data': chat_data}), 201
    except Exception as e:
        return (jsonify({'created': False, 'error': str(e)})), 500


@home.route('/group/join', methods=['PUT'])
@jwt_required()
def join_group():
    chat_id = request.json.get('id')
    current_user = get_jwt_identity()

    if not chat_id:
        return jsonify({'join': False, 'error': 'group id is required'}), 400

    try:
        result = mongo.db.chats.update_one(
            {'_id': ObjectId(chat_id)},
            {'$addToSet': {'members': ObjectId(current_user)}}
        )

        if result.matched_count == 0:
            return jsonify({'join': False, 'error': 'Chat not found'}), 404

        updated_chat = mongo.db.chats.find_one({'_id': ObjectId(chat_id)})
        updated_chat['_id'] = str(updated_chat['_id'])

        for i, m in enumerate(updated_chat['members']):
            updated_chat['members'][i] = str(m)
        return jsonify({'join': True, 'group_data': updated_chat}), 200
    except Exception as e:
        return (jsonify({'join': False, 'error': str(e)})), 500
