import { useMemo, useState } from 'react'
import { MapPin, Search, Trash2, Users } from 'lucide-react'
import { patientService } from '../services/patientService'
import { appointmentService } from '../services/appointmentService'
import { doctorService } from '../services/doctorService'
import { api } from '../services/api'
import { useToast } from '../context/ToastContext'
import { useLoad } from './useLoad'
import LoadingSpinner from '../components/common/LoadingSpinner'
import StatusBadge from '../components/common/StatusBadge'
import ConfirmDialog from '../components/common/ConfirmDialog'

const idOf=(nested,id)=>nested?.id??id
const addressOf=clinic=>[clinic?.address,clinic?.city].filter(Boolean).join(', ')
export default function AdminPatientsPage(){
  const toast=useToast(),[query,setQuery]=useState(''),[clinicId,setClinicId]=useState(''),[remove,setRemove]=useState(null)
  const patients=useLoad(()=>patientService.list({size:1000}),[]),appointments=useLoad(()=>appointmentService.list(),[]),doctors=useLoad(()=>doctorService.list(),[]),clinics=useLoad(()=>api.get('/hospitals'),[])
  const busy=patients.loading||appointments.loading||doctors.loading||clinics.loading
  const error=patients.error||appointments.error||doctors.error||clinics.error
  const doctorById=useMemo(()=>new Map(doctors.data.map(d=>[String(d.id),d])),[doctors.data])
  const clinicVisits=useMemo(()=>{
    const byPatient=new Map()
    for(const appt of appointments.data){
      const status=String(appt.status||'').toUpperCase()
      if(!['SCHEDULED','COMPLETED'].includes(status))continue
      const doctorId=idOf(appt.doctor,appt.doctorId),listedDoctor=doctorById.get(String(doctorId))
      const doctor=appt.doctor?{...listedDoctor,...appt.doctor,hospital:appt.doctor.hospital??listedDoctor?.hospital}:listedDoctor
      const assignedClinic=doctor?.hospital
      if(clinicId&&String(assignedClinic?.id)!==String(clinicId))continue
      const patientId=idOf(appt.patient,appt.patientId)
      if(patientId==null)continue
      const patient=appt.patient||patients.data.find(p=>String(p.id)===String(patientId))
      if(!patient)continue
      const visits=byPatient.get(String(patientId))||{patient,appointments:[]}
      visits.appointments.push({appointment:appt,doctor,clinic:assignedClinic})
      byPatient.set(String(patientId),visits)
    }
    return byPatient
  },[appointments.data,patients.data,doctorById,clinicId])
  const rows=useMemo(()=>{
    const source=clinicId?[...clinicVisits.values()].map(x=>x.patient):patients.data
    const unique=new Map(source.map(p=>[String(p.id),p]))
    return [...unique.values()].map(patient=>{
      const record=clinicVisits.get(String(patient.id)),visits=(record?.appointments||[]).sort((a,b)=>String(b.appointment.appointmentDate||'').localeCompare(String(a.appointment.appointmentDate||'')))
      return {patient,visits,lastVisit:visits[0]}
    }).filter(row=>`${row.patient.name||''} ${row.patient.email||''} ${row.patient.contactNumber||''}`.toLowerCase().includes(query.trim().toLowerCase()))
  },[clinicId,clinicVisits,patients.data,query])
  async function confirmRemove(){try{await patientService.remove(remove.id);toast('Patient record removed.');setRemove(null);patients.reload();appointments.reload()}catch(e){toast(e.response?.status===409?'This patient has linked clinical history and cannot be removed.':'Unable to remove the patient record.','error');setRemove(null)}}
  return <div className="page-stack"><div className="page-title-row"><div><span className="eyebrow">PATIENT DIRECTORY</span><h1>Patient management</h1><p>View basic patient contact details and filter by the clinic they visited or have a scheduled appointment at.</p></div></div>
    <section className="panel"><div className="patient-directory-filters"><div className="search-control"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search patient name, email, or phone"/></div><label className="clinic-filter"><MapPin size={16}/><select value={clinicId} onChange={e=>setClinicId(e.target.value)}><option value="">All clinics · all patients</option>{clinics.data.map(c=><option key={c.id} value={c.id}>{c.name}{addressOf(c)?` · ${addressOf(c)}`:''}</option>)}</select></label></div>
      {error&&<div className="notice error-notice">{error}</div>}{clinicId&&<div className="clinic-filter-summary"><Users size={15}/><span>Showing patients with a scheduled or completed appointment with a doctor assigned to <b>{clinics.data.find(c=>String(c.id)===String(clinicId))?.name||'this clinic'}</b>.</span></div>}
      {busy?<LoadingSpinner label="Loading patient and clinic records"/>:<div className="table-wrap"><table><thead><tr><th>Patient</th><th>Email address</th><th>Contact number</th><th>{clinicId?'Clinic visit':'Recent clinic visit'}</th><th>Record</th><th></th></tr></thead><tbody>{rows.map(({patient,visits,lastVisit})=><tr key={patient.id}><td><b>{patient.name||'Name unavailable'}</b><small>Patient #{patient.id}</small></td><td>{patient.email||'Not provided'}</td><td>{patient.contactNumber||'Not provided'}</td><td>{lastVisit?<><b>{lastVisit.doctor?.name||'Doctor'}</b><small>{lastVisit.clinic?.name||'Clinic not assigned'}{addressOf(lastVisit.clinic)?` · ${addressOf(lastVisit.clinic)}`:''}</small><small>{lastVisit.appointment.appointmentDate?new Date(lastVisit.appointment.appointmentDate).toLocaleString():''} · <StatusBadge status={lastVisit.appointment.status}/>{visits.length>1?` · ${visits.length} visits`:''}</small></>:<span className="muted">No appointment recorded</span>}</td><td>#{patient.id}</td><td><button className="icon-button danger-text" title={`Remove ${patient.name||'patient'} record`} onClick={()=>setRemove(patient)}><Trash2 size={17}/></button></td></tr>)}{!rows.length&&<tr><td colSpan="6" className="empty-cell">{clinicId?'No patients have scheduled or completed visits with doctors at this clinic.':'No patient records match your search.'}</td></tr>}</tbody></table></div>}
    </section>{remove&&<ConfirmDialog title="Remove patient record?" message={`Remove ${remove.name} from the patient directory? Linked visit history may prevent deletion.`} onClose={()=>setRemove(null)} onConfirm={confirmRemove}/>}
  </div>
}
