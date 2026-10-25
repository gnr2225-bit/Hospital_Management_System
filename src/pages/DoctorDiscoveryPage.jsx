import { useMemo, useState } from 'react'
import { ArrowRight, MapPin, Search, Star, Stethoscope } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { doctorService } from '../services/doctorService'
import { useLoad } from './useLoad'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Modal from '../components/common/Modal'

const addressOf=clinic=>clinic?[clinic.address,clinic.city].filter(Boolean).join(', '):''
export default function DoctorDiscoveryPage(){
  const [params]=useSearchParams(),[filter,setFilter]=useState(params.get('specialization')||''),[query,setQuery]=useState(''),[doctor,setDoctor]=useState(null),[reviews,setReviews]=useState([])
  const {data,loading,error}=useLoad(()=>doctorService.list(filter?{specialization:filter}:{}),[filter])
  const specs=useMemo(()=>[...new Set(data.map(d=>d.specialization).filter(Boolean))],[data])
  async function openReviews(d){setDoctor(d);try{setReviews((await doctorService.reviews(d.id)).data||[])}catch{setReviews([])}}
  const visible=data.filter(d=>`${d.name} ${d.specialization} ${d.hospital?.name||''}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="page-stack"><div className="page-title-row"><div><span className="eyebrow">CARE TEAM</span><h1>Find your doctor</h1><p>Compare clinician experience, consultation fees, and clinic locations before booking.</p></div></div>
    <div className="filter-bar"><div className="search-control"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search doctor, specialty, or clinic"/></div><select value={filter} onChange={e=>setFilter(e.target.value)}><option value="">All specialties</option>{specs.map(s=><option key={s}>{s}</option>)}</select></div>
    {error&&<div className="notice error-notice">{error}</div>}{loading?<LoadingSpinner/>:<div className="doctor-grid">{visible.map(d=><article className="doctor-card" key={d.id}><div className="doctor-card-top"><div className="doctor-avatar"><Stethoscope/></div><span className="online-dot"/></div><span className="specialty-pill">{d.specialization}</span><h2>{d.name}</h2><p>{d.bio||'Experienced clinician providing patient-focused care.'}</p><div className="doctor-profile-facts"><span><b>Consultation</b>{d.consultationFee!=null?`₹${Number(d.consultationFee).toLocaleString('en-IN')}`:'Fee not listed'}</span><span><b>Experience</b>{d.experienceYears!=null?`${d.experienceYears} years`:'Not listed'}</span>{d.qualifications&&<span className="profile-qualification"><b>Qualifications</b>{d.qualifications}</span>}</div><div className="doctor-clinic-address"><MapPin size={16}/><span><b>{d.hospital?.name||'Clinic not assigned'}</b><small>{addressOf(d.hospital)||'Contact the hospital for clinic address.'}</small></span></div><div className="doctor-buttons"><button className="button secondary" onClick={()=>openReviews(d)}><Star size={15}/> Reviews</button><a className="button primary" href={`/patient/book?doctor=${d.id}`}>Book appointment <ArrowRight size={15}/></a></div></article>)}</div>}
    {!loading&&!visible.length&&<div className="empty-state">No doctor profiles match your search.</div>}
    {doctor&&<Modal title={`${doctor.name} · Reviews`} onClose={()=>setDoctor(null)}>{reviews.length?reviews.map((r,i)=><div className="review-row" key={r.id||i}><b>{r.patientName}</b><span>{'★'.repeat(r.rating||0)}</span><p>{r.comment}</p></div>):<p className="muted">No approved reviews are available yet.</p>}</Modal>}
  </div>
}
