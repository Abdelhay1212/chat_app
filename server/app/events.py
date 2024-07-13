from flask import request
from datetime import datetime
from bson.objectid import ObjectId
from .extensions import mongo, socket
from .models.aggregations import get_chat_messages, get_chats
from flask_socketio import emit, disconnect, join_room, leave_room
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request


rooms = {}
connected_users = {}


@socket.on('connect')
def connected():
    try:
        verify_jwt_in_request()
        current_user = get_jwt_identity()
        connected_users[request.sid] = current_user
        print(f"User authenticated: {current_user}")
        print(f'client has connected: {request.sid}')
    except Exception as e:
        disconnect()
        print(f"Authentication failed: {str(e)}")


@socket.on('disconnect')
def handle_disconnect():
    if request.sid in connected_users:
        user_id = connected_users[request.sid]
        for r in list(rooms):
            room = rooms[r]
            for u in list(room['users']):
                if room['users'][u] == user_id:
                    del room['users'][u]
                    room['members'] -= 1
                    leave_room(r)
                    if room['members'] == 0:
                        del rooms[r]
        del connected_users[request.sid]
        print(f'Client disconnected: {request.sid}')
    else:
        print(f'Attempted to disconnect a non-existent client: {request.sid}')


@socket.on('get_chats')
def get_conversations(data):
    chat_type = data.get('type')
    try:
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        pipeline = get_chats(ObjectId(user_id))
        user_chats = list(mongo.db.chats.aggregate(pipeline))
        chats = []
        for chat in user_chats:
            if chat['type'] == chat_type:
                chats.append(chat)
        emit('chats_response', {'conversations': chats})
    except Exception as e:
        print(f"Error in get_chats: {str(e)}")
        emit('error', {'error': str(e)})


@socket.on('open_chat')
def open_chat(data):
    user = data.get('user')
    room = data.get('chat_id', None)
    other_user = data.get('otherUserId', None)

    try:
        verify_jwt_in_request()
        current_user = ObjectId(user['_id'])
        other_user_id = ObjectId(other_user)

        if not room:
            new_chat = True
        else:
            new_chat = False

        if other_user_id:
            chat = mongo.db.chats.find_one({
                'members': {'$all': [current_user, other_user_id]},
                '$expr': {'$eq': [{'$size': "$members"}, 2]}
            })
            if chat:
                new_chat = True
            else:
                new_chat = False

        if new_chat:
            timestamp = datetime.now()
            chat_id = mongo.db.chats.insert_one({
                'type': 'private',
                'createdAt': timestamp,
                'updatedAt': timestamp,
                'members': [current_user, other_user_id]
            }).inserted_id
            room = str(chat_id)

        for r in list(rooms):
            curr_room = rooms[r]
            if user['username'] in curr_room['users']:
                if curr_room['members'] > 1:
                    del curr_room['users'][user['username']]
                    curr_room['members'] -= 1
                else:
                    del rooms[r]
                leave_room(r)
                print(f"User {user['username']} has left the room {r}")
                break

        if room in rooms:
            rooms[room]['users'][user['username']] = user['_id']
            rooms[room]['members'] += 1
            join_room(room)
        else:
            rooms[room] = {
                'users': {user['username']: user['_id']},
                'members': 1
            }
            join_room(room)

        if new_chat:
            emit('set_chat', {'messages': [], 'room': room}, to=room)
            return
        chat_id = ObjectId(room)
        pipeline = get_chat_messages(chat_id)
        messages = list(mongo.db.messages.aggregate(pipeline))
        emit('set_chat', {'messages': messages, 'room': room}, to=room)
    except Exception as e:
        print(f"Error in open_chat: {str(e)}")
        emit('error', {'error': str(e)})


@socket.on('message')
def get_message(data):
    try:
        verify_jwt_in_request()
        room = data.get('room')
        message = data.get('message')
        user = data.get('user')

        timestamp = datetime.now()
        message_id = mongo.db.messages.insert_one({
            'content': message,
            'senderId': ObjectId(user['_id']),
            'chatId': ObjectId(room),
            'timestamp': timestamp
        }).inserted_id

        resp = {
            '_id': str(message_id),
            'content': message,
            'timestamp': str(datetime.now()),
            'senderId': user['_id']
        }
        emit('message', resp, to=room)
    except Exception as e:
        print(f"Error in message: {str(e)}")
        emit('error', {'error': str(e)})


@socket.on('check_connection')
def check_connection(data):
    try:
        verify_jwt_in_request()
        friend_id = data.get('friend_id')
        status = False
        for user in connected_users:
            if connected_users[user] == friend_id:
                status = True
        emit('check_connection', {'status': status})
    except Exception as e:
        print(f"Error in check_connection: {str(e)}")
        emit('error', {'error': str(e)})
