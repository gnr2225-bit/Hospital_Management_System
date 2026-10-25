import { api } from './api'
export const appointmentService = {
  list: () => api.get('/appointments'),
  create: body => api.post('/appointments',body),
  updateStatus: (id,status) => api.put(`/appointments/${id}/status`,{status}),
  availability: (doctorId,date,patientId) => api.get('/appointments/availability',{params:{doctorId,date,patientId}}),
  reschedule: (id,newAppointmentDate) => api.put(`/appointments/${id}/reschedule`,{newAppointmentDate})
}
