import axios from 'axios'
export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1', timeout: 12000, headers: { 'Content-Type':'application/json' } })
api.interceptors.request.use(config => { const token = localStorage.getItem('arogyacare.token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config })
api.interceptors.response.use(r => r, error => { if (error.response?.status === 401) { localStorage.removeItem('arogyacare.session'); localStorage.removeItem('arogyacare.token'); window.dispatchEvent(new Event('arogyacare:unauthorized')) } return Promise.reject(error) })
export const soapClient = axios.create({ baseURL: import.meta.env.VITE_SOAP_URL || 'http://localhost:8080/ws', timeout: 12000, headers: { 'Content-Type':'text/xml;charset=UTF-8', Accept:'text/xml' } })
