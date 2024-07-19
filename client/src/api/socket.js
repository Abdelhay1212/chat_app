import { io } from 'socket.io-client'

const url = import.meta.env.VITE_API_URL
const URL = url ? url : 'http://localhost:5000/api/v1'

export const socket = io(URL, {
  autoConnect: false,
})
