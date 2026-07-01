import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    }
    return Promise.reject(error)
  },
)

export const authAPI = {
  login: (email, password) => api.post('/auth/login/', { email, password }),
  register: (data) => api.post('/auth/register/', data),
  me: () => api.get('/auth/me/'),
  updateProfile: (data) => api.patch('/auth/me/', data),
}

export const jobsAPI = {
  list: (params) => api.get('/jobs/', { params }),
  get: (id) => api.get(`/jobs/${id}/`),
  create: (data) => api.post('/jobs/', data),
  update: (id, data) => api.patch(`/jobs/${id}/`, data),
  delete: (id) => api.delete(`/jobs/${id}/`),
}

export const departmentsAPI = {
  list: () => api.get('/departments/'),
  create: (data) => api.post('/departments/', data),
  update: (id, data) => api.patch(`/departments/${id}/`, data),
  delete: (id) => api.delete(`/departments/${id}/`),
}

export const applicationsAPI = {
  list: (params) => api.get('/applications/', { params }),
  get: (id) => api.get(`/applications/${id}/`),
  create: (formData) => api.post('/applications/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateStatus: (id, data) => api.patch(`/applications/${id}/status/`, data),
  exportCsv: (jobOfferId) => api.get('/applications/export-csv/', {
    params: { job_offer: jobOfferId },
    responseType: 'blob',
  }),
}

export const notificationsAPI = {
  list: (params) => api.get('/notifications/', { params }),
}

export const reportsAPI = {
  summary: (params) => api.get('/reports/summary/', { params }),
}

export default api
