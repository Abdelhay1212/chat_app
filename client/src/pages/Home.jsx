import { socket } from '../api/socket'
import { useState, useEffect } from 'react'
import { MessagesProvider } from '../context/MessagesProvider'
import { RoomProvider } from '../context/RoomProvider'
import { OpenedChatProvider } from '../context/OpenedChatProvider'
import { IsFriendsProvider } from '../context/IsFriendsProvider'
import useAuth from '../hooks/useAuth'
import Loading from '../components/Loading'
import Contacts from '../containers/Contacts'
import Conversation from '../containers/Conversation'
import ContactSearchAndGrouping from '../containers/ContactSearchAndGrouping'
import useRefreshToken from '../hooks/useRefreshToken'


const Home = () => {
  const refresh = useRefreshToken()
  const { auth, setAuth } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const connectSocket = () => {
      socket.io.opts.extraHeaders = {
        Authorization: `Bearer ${auth?.accessToken}`
      }
      socket.connect()
    }

    const handleTokenExpiration = async () => {
      const refreshed = await refresh()
      if (socket.connected) {
        socket.disconnect()
      }
      if (!refreshed) {
        setAuth({})
      } else {
        socket.connect()
      }
    }

    socket.on('connect', () => {
      setIsLoading(false)
      console.log('Connected to server. Socket ID:', socket.id)
    })

    socket.on('disconnect', (reason) => {
      setIsLoading(true)
      console.log('Disconnected from server. Reason:', reason)
    })

    socket.on('error', async (error) => {
      console.log(error.error)
      if (error.error === 'Signature has expired') {
        await handleTokenExpiration()
      }
    })

    connectSocket()

    return () => {
      console.log('Cleaning up socket listeners...')
      socket.off('connect')
      socket.off('error')
      socket.off('disconnect')
      socket.disconnect()
    }
  }, [refresh, auth?.accessToken, setAuth])

  return (
    <div className='flex justify-start align-center h-screen'>
      {isLoading
        ? <Loading />
        : <>
          <MessagesProvider>
            <RoomProvider>
              <OpenedChatProvider>
                <IsFriendsProvider>
                  <Contacts />
                  <Conversation />
                </IsFriendsProvider>
                <ContactSearchAndGrouping />
              </OpenedChatProvider>
            </RoomProvider>
          </MessagesProvider>
        </>
      }
    </div>
  )
}

export default Home
