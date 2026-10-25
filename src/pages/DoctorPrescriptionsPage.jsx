import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { appointmentService } from '../services/appointmentService'
import { patientService } from '../services/patientService'
import { useLoad } from './useLoad'
import LoadingSpinner from '../components/common/LoadingSpinner'
import PrescriptionView from '../components/prescriptions/PrescriptionView'

export default function DoctorPrescriptionsPage(){
  const {user}=useAuth(),{data:appointments,loading,error}=useLoad(()=>appointmentService.list(),[]),[records,setRecords]=useState([]),[busy,setBusy]=useState(false),[loadError,setLoadError]=useState('')
  useEffect(()=>{let live=true;const own=appointments.filter(a=>String(a.doctor?.id??a.doctorId)===String(user.doctorId)&&a.status==='COMPLETED');if(!own.length){setRecords([]);return()=>{live=false}}setBusy(true);Promise.all([...new Set(own.map(a=>String(a.patient?.id??a.patientId)))].map(id=>patientService.prescriptions(id))).then(responses=>{if(!live)return;const all=responses.flatMap(r=>Array.isArray(r.data)?r.data:[]).filter(p=>String(p.doctorId)===String(user.doctorId));setRecords([...new Map(all.map(p=>[p.id,p])).values()]);setLoadError('')}).catch(()=>live&&setLoadError('Issued prescriptions could not be loaded from the hospital API.')).finally(()=>live&&setBusy(false));return()=>{live=false}},[appointments,user.doctorId])
  return <div className="page-stack"><div className="page-title-row"><div><span className="eyebrow">CLINICAL RECORDS</span><h1>Issued prescriptions</h1><p>Review and print prescriptions issued from your completed consultations.</p></div></div>{error&&<div className="notice error-notice">{error}</div>}{loadError&&<div className="notice error-notice">{loadError}</div>}{loading||busy?<LoadingSpinner/>:records.length?<div className="prescription-grid">{records.map(p=>{const visit=appointments.find(a=>String(a.patient?.id??a.patientId)===String(p.patientId));return <PrescriptionView key={p.id} prescription={p} patient={visit?.patient} doctor={user}/>})}</div>:<div className="empty-state">No issued prescriptions are linked to your completed consultations.</div>}</div>
}
