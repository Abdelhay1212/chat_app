import axios from 'axios'

const url = import.meta.env.VITE_API_URL
const BASE_URL = url ? url : 'http://localhost:5000/api/v1'

export default axios.create({
  baseURL: BASE_URL,
})

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})
