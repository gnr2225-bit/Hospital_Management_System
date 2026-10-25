import { LockKeyhole, Star } from 'lucide-react'
import StatusBadge from '../common/StatusBadge'

export default function AppointmentList({ appointments, onReview, onReschedule }) {
  return <div className="table-wrap"><table><thead><tr><th>Clinician</th><th>Appointment</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead><tbody>
    {appointments.map(a=>{
      const hours=(new Date(a.appointmentDate)-Date.now())/3600000
      const clinic=a.doctor?.hospital, clinicAddress=[clinic?.address,clinic?.city].filter(Boolean).join(', ')
      return <tr key={a.id}><td><b>{a.doctor?.name||`Doctor #${a.doctorId}`}</b><small>{a.doctor?.specialization||'Care team'}</small>{clinic&&<small className="appointment-location">{clinic.name}{clinicAddress?` · ${clinicAddress}`:''}</small>}</td><td>{a.appointmentDate?new Date(a.appointmentDate).toLocaleString():'—'}</td><td>{a.reason||'Consultation'}</td><td><StatusBadge status={a.status}/></td><td className="appointment-actions">
        {a.status==='SCHEDULED'&&hours>=1&&<button className="text-button" onClick={()=>onReschedule(a)}>✏️ Reschedule Slot</button>}
        {a.status==='SCHEDULED'&&hours<1&&<span className="locked-badge" title="Changes are locked during the final hour before the scheduled appointment."><LockKeyhole size={13}/> Locked (&lt;1h)</span>}
        {a.status==='COMPLETED'&&<button className="text-button" onClick={()=>onReview(a)}><Star size={15}/> Review doctor</button>}
      </td></tr>
    })}
    {!appointments.length&&<tr><td colSpan="5" className="empty-cell">No appointments linked to this patient profile.</td></tr>}
  </tbody></table></div>
}
