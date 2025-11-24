import axios from 'axios'

const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const weatherAPI = {
  getAll: () => api.get('/weather/logs'),
  getById: (id: string) => api.get(`/weather/${id}`),
  getByLocation: (location: string) => api.get(`/weather/location/${location}`),
  create: (data: any) => api.post('/weather/logs', data),
  update: (id: string, data: any) => api.put(`/weather/${id}`, data),
  delete: (id: string) => api.delete(`/weather/${id}`),
  collect: () => api.post('/weather/collect', {}),
  collectByCity: (city: string, latitude: number, longitude: number) => 
    api.post('/weather/collect-city', { city, latitude, longitude }),
}

export const authAPI = {
  signIn: (email: string, password: string) =>
    api.post('/api/auth/signin', { email, password }),
  signUp: (data: any) => api.post('/api/auth/signup', data),
}

export const usersAPI = {
  getAll: () => api.get('/api/users'),
  getById: (id: string) => api.get(`/api/users/${id}`),
  update: (id: string, data: any) => api.put(`/api/users/${id}`, data),
  delete: (id: string) => api.delete(`/api/users/${id}`),
}

export default api
