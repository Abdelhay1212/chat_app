import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import useRefreshToken from "../hooks/useRefreshToken"
import useAuth from "../hooks/useAuth"
import Loading from "./Loading"

const PersistentLogin = () => {
  const [isLoading, setIsLoading] = useState(true)
  const refresh = useRefreshToken()
  const { auth } = useAuth()

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh()
      } catch (err) {
        console.log((err))
      } finally {
        setIsLoading(false)
      }
    }

    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false)
  }, [auth, refresh])

  return (
    <>
      {isLoading
        ? <Loading />
        : <Outlet />
      }
    </>
  )
}

export default PersistentLogin
