import { api } from './api'
export const appointmentService = { list: () => api.get('/appointments'), create: body => api.post('/appointments',body), updateStatus: (id,status) => api.put(`/appointments/${id}/status`,{status}) }
