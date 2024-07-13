import { socket } from "../api/socket"
import { useRef, useEffect } from "react"

import useAuth from "../hooks/useAuth"
import useMessages from "../hooks/useMessages"
import useOpenedChat from "../hooks/useOpenedChat"
import useIsFriends from '../hooks/useIsFriends'


const Messages = () => {
  const { auth } = useAuth()
  const { openedChat } = useOpenedChat()
  const { messages, setMessages } = useMessages()
  const { isFriends } = useIsFriends()
  const messagesEndRef = useRef(null)

  useEffect(() => {
    socket.on('message', (data) => {
      setMessages((prev) => [...prev, data])
      socket.emit('get_chats', { type: isFriends ? 'private' : 'group' })
    })

    return () => socket.off('message')
  }, [setMessages, isFriends])

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'instant' })
    }
    scrollToBottom()
  }, [messages])

  return (
    <div className="p-4 border-b-2 border-primary-light h-3/4">
      <div className="w-full h-full overflow-y-scroll p-4">
        {openedChat.type === 'group' &&
          <div className="flex justify-center items-center">
            <p className="mb-10 p-2 rounded-full text-xs font-small text-[#F59E0B] bg-[#FEF3C7]">Share this id with firends to join the group: {openedChat._id}</p>
          </div>
        }
        {messages.length > 0 ?
          messages.map((msg) => {
            let alignment = 'justify-start'
            let bgColor = 'bg-background'
            let textColor = 'text-grey'
            if (msg.senderId === auth.user._id) {
              alignment = 'justify-end'
              bgColor = 'bg-primary'
              textColor = 'text-white'
            }
            return (
              <div key={msg._id} className={`flex ${alignment} mb-2`}>
                <span className={`block px-4 py-2 rounded text-sm ${bgColor} ${textColor}`}>{msg.content}</span>
              </div>
            )
          })
          : <p className='flex justify-center'>No messages available</p>
        }
        <div ref={messagesEndRef} ></div>
      </div>
    </div>
  )
}

export default Messages
