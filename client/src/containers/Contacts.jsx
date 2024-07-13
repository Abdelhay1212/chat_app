import { socket } from '../api/socket'
import { useEffect, useState } from 'react'
import useIsFriends from '../hooks/useIsFriends'

import Search from '../components/Search'
import Friends from '../components/Friends'
import UserInfo from '../components/UserInfo'
import Logout from '../components/Logout'


const Contacts = () => {
  const [chats, setChats] = useState([])
  const { isFriends, setIsFriends } = useIsFriends()

  useEffect(() => {
    socket.emit('get_chats', { type: isFriends ? 'private' : 'group' })
  }, [isFriends])

  useEffect(() => {
    socket.on('chats_response', (data) => {
      if (data?.conversations) {
        setChats(data.conversations)
      }
    })

    return () => {
      socket.off('chats_response')
    }
  }, [])

  return (
    <div className='w-[550px] h-full bg-background flex flex-col'>
      <UserInfo />
      <Search
        chats={chats}
        setChats={setChats}
      />
      <Friends
        chats={chats}
        isFriends={isFriends}
        setIsFriends={setIsFriends}
      />
      <div className='flex-grow'></div>
      <Logout />
    </div>
  )
}

export default Contacts
