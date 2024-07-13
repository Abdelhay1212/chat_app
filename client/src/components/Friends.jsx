import PropTypes from 'prop-types'
import useAuth from '../hooks/useAuth'
import { socket } from '../api/socket'
import { useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import useOpenedChat from '../hooks/useOpenedChat'
import useMessages from '../hooks/useMessages'
import useRoom from '../hooks/useRoom'
import defaultImage from '../assets/default.jpg'


const Friends = ({ chats, isFriends, setIsFriends }) => {
  const { auth } = useAuth()
  const { setRoom } = useRoom()
  const { setMessages } = useMessages()
  const { setOpenedChat } = useOpenedChat()

  const findOtherMember = (chat) => {
    return chat.members.find(m => m.username !== auth.user.username)
  }

  const getChatName = (chat) => {
    if (chat.type === 'private') {
      const otherMember = findOtherMember(chat)
      return otherMember ? otherMember.fullName : 'Unknown'
    }
    return chat.name
  }

  const getChatImage = (chat) => {
    if (chat.type === 'private') {
      const otherMember = findOtherMember(chat)
      if (otherMember?.profilePicture) {
        return `http://localhost:5000/static/images/${otherMember.profilePicture}`
      } else {
        return defaultImage
      }
    }
    if (chat?.profilePicture) {
      return `http://localhost:5000/static/images/${chat.profilePicture}`
    } else {
      return defaultImage
    }
  }

  const formatMessageTimestamp = (timestamp) => {
    if (!timestamp) return ''
    const date = parseISO(timestamp)
    return format(date, 'yyyy-MM-dd HH:mm')
  }

  const openChat = (chat) => {
    socket.emit('open_chat', { chat_id: chat._id, user: auth.user })
    const title = getChatName(chat)
    const image = getChatImage(chat)
    const friend_id = findOtherMember(chat)._id
    setOpenedChat({ _id: chat._id, type: chat.type, friend_id, title, image })
  }

  useEffect(() => {
    socket.on('set_chat', (data) => {
      setMessages(data?.messages)
      setRoom(data?.room)
    }, [])

    return () => socket.off('set_chat')
  })

  const handleFriendsOrGroups = (selection) => {
    setIsFriends(selection === 'friends')
  }

  return (
    <>
      <div className='flex justify-evenly items-center mt-3'>
        <button
          onClick={() => handleFriendsOrGroups('friends')}
          className={`px-10 py-1 ${isFriends ? 'bg-primary text-white' : 'bg-white text-primary'} focus:outline-none rounded-full`}
        >Friends</button>
        <button
          onClick={() => handleFriendsOrGroups('groups')}
          className={`px-10 py-1 ${isFriends ? 'bg-white text-primary' : 'bg-primary text-white'} focus:outline-none rounded-full`}
        >Groups</button>
      </div>
      {chats.length > 0
        ? <div className="p-4 w-full h-full overflow-y-scroll p-4">
          {
            chats.map(chat => {
              return (
                <div key={chat._id} onClick={() => openChat(chat)} className="flex justify-between items-center gap-x-4 mb-5 cursor-pointer">
                  <div className="rounded-full w-10 h-10 overflow-hidden flex justify-center items-center bg-gray-200">
                    <img
                      className="w-full h-full object-cover"
                      src={getChatImage(chat)}
                      alt="Person"
                    />
                  </div>

                  <div className="flex flex-col flex-grow justify-start items-start">
                    <div className="w-full flex justify-between items-center">
                      <h2 className="text-primary text-md font-semibold">
                        {getChatName(chat)}
                      </h2>
                      <span className="text-grey-light text-xs">
                        {formatMessageTimestamp(chat?.lastMessage?.timestamp)}
                      </span>
                    </div>

                    <div className="w-full flex justify-between items-center">
                      <p className="text-grey-light text-xs">
                        {chat?.lastMessage?.content}
                      </p>
                      {/* <span className="flex place-content-center bg-primary text-white text-xs rounded-full w-4 h-4">1</span> */}
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
        : <div className="flex justify-center items-center mt-5 text-gray-500">No chats available</div>
      }
    </>
  )
}

Friends.propTypes = {
  chats: PropTypes.array.isRequired,
  isFriends: PropTypes.bool.isRequired,
  setIsFriends: PropTypes.func.isRequired
}

export default Friends
