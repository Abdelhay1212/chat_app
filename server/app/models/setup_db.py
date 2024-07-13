from app.extensions import mongo


def init_db():
    db = mongo.db

    # users collection schema
    user_schema = {
        'bsonType': 'object',
        'required': ['username', 'email', 'fullName', 'password', 'createdAt', 'updatedAt'],
        'properties': {
            'username': {
                'bsonType': 'string',
                'description': 'must be a string and is required'
            },
            'email': {
                'bsonType': 'string',
                'pattern': '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
                'description': 'must be a string and match the email pattern and is required'
            },
            'fullName': {
                'bsonType': 'string',
                'description': 'must be a string'
            },
            'password': {
                'bsonType': 'string',
                'minLength': 12,
                'description': 'must be a string and at least 12 characters long including upper and lower characters and numbers'
            },
            'profilePicture': {
                'bsonType': 'string',
                'description': 'must be a string'
            },
            'createdAt': {
                'bsonType': 'date',
                'description': 'must be time and is required'
            },
            'updatedAt': {
                'bsonType': 'date',
                'description': 'must be time and is required'
            }
        }
    }

    # messages collection schema
    message_schema = {
        'bsonType': 'object',
        'required': ['content', 'senderId', 'chatId', 'timestamp'],
        'properties': {
            'senderId': {
                'bsonType': 'objectId',
                'description': 'must be an ObjectId and is required'
            },
            'chatId': {
                'bsonType': 'objectId',
                'description': 'must be an ObjectId and is required'
            },
            'content': {
                'bsonType': 'string',
                'description': 'must be a string and is required'
            },
            'timestamp': {
                'bsonType': 'date',
                'description': 'must be a date and is required'
            }
        }
    }

    # chats collection schema
    chat_schema = {
        'bsonType': 'object',
        'required': ['type', 'members', 'createdAt', 'updatedAt'],
        'properties': {
            'type': {
                'bsonType': 'string',
                'description': 'must be a string and is required'
            },
            'name': {
                'bsonType': 'string',
                'description': 'must be a string'
            },
            'members': {
                'bsonType': 'array',
                'items': {
                    'bsonType': 'objectId',
                    'description': 'must be an objectId and is required'
                },
                'description': 'must be a string and is required'
            },
            'createdAt': {
                'bsonType': 'date',
                'description': 'must be time and is required'
            },
            'updatedAt': {
                'bsonType': 'date',
                'description': 'must be time and is required'
            }
        }
    }

    collections = db.list_collection_names()

    if 'users' not in collections:
        db.create_collection('users', validator={'$jsonSchema': user_schema})
        db.users.create_index({'username': 1, 'email': 1})

    if 'messages' not in collections:
        db.create_collection(
            'messages',
            validator={'$jsonSchema': message_schema}
        )
        db.messages.create_index('')

    if 'chats' not in collections:
        db.create_collection('chats', validator={'$jsonSchema': chat_schema})

    print("Collections created with JSON schema validation")
