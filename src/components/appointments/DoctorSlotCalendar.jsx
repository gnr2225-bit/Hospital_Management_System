import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Clock3 } from 'lucide-react'
import { appointmentService } from '../../services/appointmentService'
import LoadingSpinner from '../common/LoadingSpinner'

const localDate = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
export const todayLocal = () => localDate(new Date())
export default function DoctorSlotCalendar({ doctorId, patientId, date, onDateChange, value, onChange }) {
  const [slots,setSlots]=useState([]),[busy,setBusy]=useState(false),[error,setError]=useState('')
  const days=useMemo(()=>Array.from({length:5},(_,i)=>{const d=new Date();d.setDate(d.getDate()+i);return {date:localDate(d),label:i===0?'Today':i===1?'Tomorrow':d.toLocaleDateString(undefined,{weekday:'short'}),day:d.getDate()}}),[])
  useEffect(()=>{let active=true;if(!doctorId||!date){setSlots([]);return()=>{active=false}}setBusy(true);setError('');appointmentService.availability(doctorId,date,patientId).then(r=>{if(active)setSlots(r.data||[])}).catch(e=>{if(active){setSlots([]);setError(e.response?.data?.message||'Could not load slot availability.')}}).finally(()=>active&&setBusy(false));return()=>{active=false}},[doctorId,date,patientId])
  return <div className="doctor-calendar"><div className="date-pills" aria-label="Choose a date">{days.map(d=><button type="button" className={`date-pill ${date===d.date?'active':''}`} key={d.date} onClick={()=>{onDateChange(d.date);onChange('')}}><small>{d.label}</small><b>{d.day}</b></button>)}</div><label className="form-label calendar-date"><CalendarDays size={15}/> Choose another date<input type="date" min={todayLocal()} value={date} onChange={e=>{onDateChange(e.target.value);onChange('')}}/></label><div className="label-block"><label><Clock3 size={15}/> Available times</label>{busy?<LoadingSpinner label="Checking availability"/>:error?<div className="notice error-notice">{error}</div>:!doctorId?<p className="muted">Choose a doctor to see available times.</p>:<div className="slot-grid">{slots.map(s=>{const time=String(s.dateTime).slice(11,16);return <button type="button" key={s.dateTime} disabled={!s.available} className={`slot ${value===s.dateTime?'selected':''} ${!s.available?'booked':''}`} onClick={()=>onChange(s.dateTime)}>{new Date(`${date}T${time}`).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}{!s.available&&<small>Booked</small>}</button>})}</div>}</div></div>
}
