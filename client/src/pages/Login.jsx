import axios from '../api/axios'
import useAuth from '../hooks/useAuth'
import Loading from '../components/Loading'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {

  const navigate = useNavigate()
  const { setAuth } = useAuth()

  const [loginIdentifier, setLoginIdentifier] = useState('')
  const [passwd, setPasswd] = useState('')
  const [remember, setRemember] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    setErrMsg('')
  }, [loginIdentifier, passwd])

  const loginReq = async (event) => {
    event.preventDefault()
    setShowLoading(true)

    const url = '/auth/login'
    const headers = { 'Content-Type': 'application/json' }
    const requestOptions = {
      headers: headers,
      withCredentials: true
    }

    try {
      const response = await axios.post(
        url,
        JSON.stringify({ loginIdentifier, passwd, remember }),
        requestOptions
      )
      setShowLoading(false)
      if (response.status === 200) {
        setAuth({
          accessToken: response?.data?.access_token,
          user: response?.data?.user
        })
        setLoginIdentifier('')
        setPasswd('')
        setRemember(false)
        navigate('/')
        console.log('Logged in successfully')
        return
      }
    } catch (err) {
      setShowLoading(false)

      if (err?.response) {
        console.error(err?.message)
        setErrMsg(err?.response?.data?.error || 'An error occurred.')
      } else if (err?.request) {
        console.error('Error request:', err?.request)
        setErrMsg('No response received from the server. Please try again later!')
      } else {
        console.error('Error message:', err?.message)
        setErrMsg('Something went wrong. Please try again later!')
      }
    }
  }

  return (
    <div className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-primary md:text-2xl">
              Sign in to your account
            </h1>
            <form onSubmit={loginReq} className="space-y-4 md:space-y-6">
              {errMsg &&
                <p className="text-[#dc3545] bg-[#f9e1e3] font-medium text-sm p-2 rounded">{errMsg}</p>
              }
              <div>
                <label htmlFor="login_identifier" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                <input
                  type="text"
                  id="login_identifier"
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  value={loginIdentifier}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Email or Username"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                <input
                  type="password"
                  id="password"
                  onChange={(e) => setPasswd(e.target.value)}
                  value={passwd}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      type="checkbox"
                      onChange={(e) => setRemember(!e.target.value)}
                      value={remember}
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500">Remember me</label>
                  </div>
                </div>
                <a href="#" className="text-sm font-medium text-primary hover:underline">Forgot password?</a>
              </div>
              <button type="submit" className="w-full text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Sign in</button>
              <p className="text-sm font-light text-gray-500">
                Don’t have an account yet? <Link to="/register" className="font-medium text-primary hover:underline">Sign up</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      {showLoading && <Loading />}
    </div>
  )
}

export default Login
