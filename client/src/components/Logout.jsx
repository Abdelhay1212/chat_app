import { useState } from "react"
import { socket } from "../api/socket"
import useAuth from "../hooks/useAuth"
import Loading from "./Loading"
import axios from "../api/axios"


const Logout = () => {
  const { auth, setAuth } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const logout = async () => {
    setIsLoading(true)
    try {
      await axios.post('/auth/logout')
      socket.emit('leave_rooms', { user_id: auth.user._id })
      socket.disconnect()
      setAuth({})
    } catch (err) {
      console.error('Logout Failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={logout}
        disabled={isLoading}
        className="w-full py-2 rounded-none bg-white border-none outline-none hover:bg-[#ddd]"
      >logout</button>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
          <Loading />
        </div>
      )}
    </div>
  )
}

export default Logout
