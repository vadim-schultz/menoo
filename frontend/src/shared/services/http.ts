import axios, { AxiosError } from 'axios'
import type { AxiosInstance } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

export const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
httpClient.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
httpClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    // Handle errors globally if needed
    return Promise.reject(error)
  }
)

export default httpClient

