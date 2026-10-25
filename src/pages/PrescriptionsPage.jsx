import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { patientService } from '../services/patientService'
import { useLoad } from './useLoad'
import LoadingSpinner from '../components/common/LoadingSpinner'
import PrescriptionView from '../components/prescriptions/PrescriptionView'

export default function PrescriptionsPage(){
  const {user}=useAuth(),{data,loading,error}=useLoad(()=>user.patientId?patientService.prescriptions(user.patientId):Promise.resolve({data:[]}),[user.patientId])
  return <div className="page-stack"><div className="page-title-row"><div><span className="eyebrow">YOUR MEDICATIONS</span><h1>Digital prescriptions</h1><p>Diagnoses, instructions and official print copies from your consultations.</p></div>{data.length>0&&<Link className="button secondary" to="/patient/pharmacy">Open pharmacy <ArrowRight size={15}/></Link>}</div>
    {!user.patientId&&<div className="notice">Your sign-in is not linked to a patient record. Contact your hospital to connect your profile.</div>}{error&&<div className="notice error-notice">{error}</div>}
    {loading?<LoadingSpinner/>:data.length?<div className="prescription-grid">{data.map(p=><PrescriptionView key={p.id} prescription={p} patient={user}/>)}</div>:!error&&<div className="empty-state">No digital prescriptions are linked to your patient record.</div>}
  </div>
}
