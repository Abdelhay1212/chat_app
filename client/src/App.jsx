import './App.css'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import RequireAuth from './components/RequireAuth'
import PersistentLogin from './components/PersistentLogin'
import { Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' >
          {/* Public Routes */}
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />

          {/* Protected Routes */}
          <Route element={<PersistentLogin />}>
            <Route element={<RequireAuth />}>
              <Route path='/' element={<Home />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
