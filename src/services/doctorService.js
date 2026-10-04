import { api } from './api'
export const doctorService = { list: params => api.get('/doctors',{params}), create: body => api.post('/doctors',body), reviews: id => api.get(`/doctors/${id}/reviews`), addReview: body => api.post('/reviews',body) }
