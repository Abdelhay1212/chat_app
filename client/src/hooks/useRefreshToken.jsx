import axios from '../api/axios'
import useAuth from './useAuth'

const useRefreshToken = () => {
  const { setAuth } = useAuth()

  const refresh = async () => {
    const response = await axios.get('/auth/token/refresh', {
      withCredentials: true
    })
    setAuth({
      accessToken: response?.data?.access_token,
      user: response?.data?.user
    })
    return response?.data?.access_token
  }

  return refresh
}

export default useRefreshToken
