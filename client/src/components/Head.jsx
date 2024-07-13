import { socket } from "../api/socket"
import { useEffect, useState } from "react"
import useOpenedChat from "../hooks/useOpenedChat"
import defaultImage from "../assets/default.jpg"

const Head = () => {
  const { openedChat } = useOpenedChat()
  const [status, setStatus] = useState(false)

  useEffect(() => {
    const checkConnection = () => {
      socket.emit('check_connection', { friend_id: openedChat.friend_id })
    }
    checkConnection()

    let interval
    if (openedChat.type === 'private') {
      interval = setInterval(() => {
        checkConnection()
      }, 30000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [openedChat])

  useEffect(() => {
    socket.on('check_connection', (data) => {
      setStatus(data.status)
    })

    return () => {
      socket.off('check_connection')
    }
  }, [])

  return (
    <div className="p-4 border-b-2 border-primary-light">
      <div className="flex justify-start items-center gap-x-4">
        <div className="rounded-full w-14 h-14 overflow-hidden flex justify-center items-center bg-gray-200">
          <img
            className="w-full h-full object-cover"
            src={openedChat?.image}
            alt="Person"
          />
        </div>
        <div className="flex justify-start items-center gap-x-4">
          <h2 className="text-grey text-lg font-bold">{openedChat?.title}</h2>
          {openedChat?.type === 'private'
            ? <p className={`w-3 h-3 rounded-full ${status ? 'bg-[#2dc937]' : 'bg-[#ccc]'}`}></p>
            : ''
          }
        </div>
      </div>
    </div>
  )
}

export default Head
