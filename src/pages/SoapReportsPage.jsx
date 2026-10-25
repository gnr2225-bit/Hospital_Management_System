import { useState } from 'react'
import { Activity, CalendarDays, UserRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { reportService, parsePatientReport } from '../services/reportService'
import StatusBadge from '../components/common/StatusBadge'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function SoapReportsPage(){
  const {user}=useAuth(),toast=useToast(),[report,setReport]=useState(null),[error,setError]=useState(''),[busy,setBusy]=useState(false)
  async function fetchReport(){
    if(!user.patientId){toast('Your portal is not linked to a patient record.','error');return}
    setBusy(true);setError('')
    try{const response=await reportService.patient(user.patientId);const parsed=parsePatientReport(response.data);setReport(parsed);toast('Clinical report received.')}
    catch(e){const message=e.message||e.response?.data?.message||e.response?.data?.error||'SOAP report could not be fetched. Check the SOAP endpoint and CORS configuration.';setError(message);toast(message,'error')}
    finally{setBusy(false)}
  }
  return <div className="page-stack"><div className="page-title-row"><div><span className="eyebrow">CONTRACT FIRST SOAP</span><h1>Health reports</h1><p>Request your encounter history from the clinical reporting service.</p></div><button className="button primary" onClick={fetchReport} disabled={busy||!user.patientId}>{busy?<LoadingSpinner label="Fetching"/>:<><Activity size={17}/> Fetch patient report</>}</button></div>
    {!user.patientId&&<div className="notice">Your account needs a linked patient record before a SOAP report can be fetched.</div>}
    {error&&<div className="notice error-notice" role="alert">{error}</div>}
    {report&&<section className="panel report-result"><div className="panel-heading"><div><span className="eyebrow">PATIENT ENCOUNTER REPORT</span><h2>{report.patientName||user.name}</h2></div><span className="badge completed">SOAP response</span></div><div className="soap-patient-meta"><span><UserRound size={16}/> Patient #{report.patientId||user.patientId}</span><span><CalendarDays size={16}/> {report.appointments.length} encounter{report.appointments.length===1?'':'s'}</span></div>
      {report.appointments.length?<div className="table-wrap"><table className="soap-table"><thead><tr><th>Visit</th><th>Date & time</th><th>Clinician & department</th><th>Reason</th><th>Status</th></tr></thead><tbody>{report.appointments.map((visit,index)=><tr key={visit.appointmentId||index}><td>#{visit.appointmentId||'—'}</td><td>{visit.date?new Date(visit.date).toLocaleString():'—'}</td><td><b>{visit.doctorName||'Care team'}</b><small>{visit.specialization||'Department not recorded'}</small></td><td className="soap-reason">{visit.reason||'—'}</td><td><StatusBadge status={visit.status||'SCHEDULED'}/></td></tr>)}</tbody></table></div>:<div className="empty-state">No appointment encounters were found in this report.</div>}
    </section>}
  </div>
}
