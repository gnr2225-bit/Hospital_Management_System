import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { appointmentService } from '../services/appointmentService'
import { doctorService } from '../services/doctorService'
import { useLoad } from './useLoad'
import Modal from '../components/common/Modal'
import AppointmentList from '../components/appointments/AppointmentList'
import RescheduleModal from '../components/appointments/RescheduleModal'

export default function PatientAppointmentsPage(){
  const {user}=useAuth(),toast=useToast(),{data:all,reload,loading,error}=useLoad(()=>appointmentService.list(),[])
  const [review,setReview]=useState(null),[reschedule,setReschedule]=useState(null),[rating,setRating]=useState(5),[comment,setComment]=useState('')
  const records=all.filter(a=>String(a.patient?.id??a.patientId)===String(user.patientId))
  async function send(e){e.preventDefault();try{await doctorService.addReview({doctorId:review.doctor?.id??review.doctorId,patientId:user.patientId,patientName:user.name,rating:Number(rating),comment});toast('Thank you for sharing feedback about your care.');setReview(null);setComment('')}catch(err){toast(err.response?.data?.error||'Review could not be submitted.','error')}}
  async function saved(){await reload();toast('Your appointment was rescheduled successfully.');const clinic=reschedule?.doctor?.hospital,address=[clinic?.address,clinic?.city].filter(Boolean).join(', ');window.dispatchEvent(new CustomEvent('arogyacare:notification',{detail:{title:'Appointment rescheduled',body:`Your updated appointment with ${reschedule?.doctor?.name||'your doctor'} is confirmed.${clinic?` Go to ${clinic.name}${address?`, ${address}`:''}.`:''}`}}))}
  return <div className="page-stack"><div className="page-title-row"><div><span className="eyebrow">YOUR CARE TIMELINE</span><h1>My appointments</h1><p>Review upcoming visits and your completed consultations.</p></div><Link className="button primary" to="/patient/discover">Book an appointment <ArrowRight size={16}/></Link></div>
    {!user.patientId&&<div className="notice">Your sign-in is not linked to a patient record yet. Contact your hospital to connect your profile.</div>}{error&&<div className="notice error-notice">{error}</div>}
    <section className="panel"><AppointmentList appointments={records} onReview={setReview} onReschedule={setReschedule}/>{loading&&<div className="loading-inline">Loading appointments…</div>}</section>
    {review&&<Modal title="Review your doctor" onClose={()=>setReview(null)}><form className="form-stack" onSubmit={send}><p className="muted">Share feedback about {review.doctor?.name||'your doctor'}.</p><label>Rating<select value={rating} onChange={e=>setRating(e.target.value)}>{[5,4,3,2,1].map(n=><option value={n} key={n}>{n} star{n>1?'s':''}</option>)}</select></label><label>Your comments<textarea required minLength="4" rows="4" value={comment} onChange={e=>setComment(e.target.value)}/></label><button className="button primary">Submit review</button></form></Modal>}
    {reschedule&&<RescheduleModal appointment={reschedule} onClose={()=>setReschedule(null)} onSaved={saved} onError={message=>toast(message,'error')}/>}
  </div>
}
