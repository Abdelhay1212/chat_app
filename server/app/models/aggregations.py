def get_chat_messages(chat_id):
    return [
        {
            "$match": {
                "chatId": chat_id
            }
        },
        {
            "$sort": {
                "timestamp": 1
            }
        },
        {
            "$project": {
            "_id": {"$toString": "$_id"},
            "content": "$content",
            "timestamp": {"$toString": "$timestamp"},
            "senderId": {"$toString": "$senderId"},
            "chatId": {"$toString": "$chatId"}
            }
        }
    ]


def get_chats(user_id):
    return [
            # Match chats where the user is a member
            {
                "$match": {
                    "members": user_id
                }
            },
            # Lookup to get user details for all members
            {
                "$lookup": {
                    "from": "users",
                    "localField": "members",
                    "foreignField": "_id",
                    "as": "memberDetails"
                }
            },
            # Lookup to get the last message in each chat
            {
                "$lookup": {
                    "from": "messages",
                    "let": {"chatId": "$_id"},
                    "pipeline": [
                        {"$match": {"$expr": {"$eq": ["$chatId", "$$chatId"]}}},
                        {"$sort": {"timestamp": -1}},
                        {"$limit": 1}
                    ],
                    "as": "lastMessage"
                }
            },
            # Unwind the last message array to get the object
            {
                "$unwind": {
                    "path": "$lastMessage",
                    "preserveNullAndEmptyArrays": True
                }
            },
            # Project to shape our output
            {
                "$project": {
                    "_id": {"$toString": "$_id"},
                    "name": 1,
                    "type": 1,
                    "createdAt": {"$toString": "$createdAt"},
                    "updatedAt": {"$toString": "$updatedAt"},
                    "members": {
                        "$map": {
                            "input": "$memberDetails",
                            "as": "member",
                            "in": {
                                "_id": {"$toString": "$$member._id"},
                                "username": "$$member.username",
                                "fullName": "$$member.fullName",
                                "profilePicture": "$$member.profilePicture"
                            }
                        }
                    },
                    "lastMessage": {
                        "content": "$lastMessage.content",
                        "timestamp": {"$toString": "$lastMessage.timestamp"}
                    }
                }
            }
        ]
