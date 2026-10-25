import { useState } from 'react'
import { CalendarDays } from 'lucide-react'
import Modal from '../common/Modal'
import LoadingSpinner from '../common/LoadingSpinner'
import DoctorSlotCalendar, { todayLocal } from './DoctorSlotCalendar'
import { appointmentService } from '../../services/appointmentService'

const apiError = error => error.response?.data?.message || error.response?.data?.error || 'Could not update this appointment. Please try another time.'
export default function RescheduleModal({ appointment, onClose, onSaved, onError }) {
  const [date,setDate]=useState(appointment.appointmentDate?.slice(0,10)||todayLocal()),[selected,setSelected]=useState(''),[saving,setSaving]=useState(false),[error,setError]=useState('')
  async function submit(e){e.preventDefault();if(!selected)return;setSaving(true);setError('');try{await appointmentService.reschedule(appointment.id,selected);await onSaved();onClose()}catch(e){const message=apiError(e);setError(message);if(e.response?.status===409)onError?.(message)}finally{setSaving(false)}}
  return <Modal title="Reschedule appointment" onClose={onClose}><form className="form-stack" onSubmit={submit}><p className="muted">Choose a new time with {appointment.doctor?.name||'your doctor'}.</p><DoctorSlotCalendar doctorId={appointment.doctor?.id??appointment.doctorId} patientId={appointment.patient?.id??appointment.patientId} date={date} onDateChange={setDate} value={selected} onChange={setSelected}/>{error&&<div className="notice error-notice" role="alert">{error}</div>}<div className="form-actions"><button type="button" className="button secondary" onClick={onClose}>Cancel</button><button className="button primary" disabled={!selected||saving}>{saving?<LoadingSpinner label="Saving"/>:<><CalendarDays size={16}/> Confirm new time</>}</button></div></form></Modal>
}
