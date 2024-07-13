import useAuth from "../hooks/useAuth"
import { useLocation, Navigate, Outlet } from "react-router-dom"

const RequireAuth = () => {
  const { auth } = useAuth()
  const location = useLocation()

  return (
    auth?.accessToken
      ? <Outlet />
      : <Navigate to='/login' state={{ from: location }} replace />
  )
}

export default RequireAuth
