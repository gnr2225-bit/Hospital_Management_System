import { ClipboardList, Printer } from 'lucide-react'
import { Link } from 'react-router-dom'

function medicineRow(value){
  if(typeof value!=='string')return {name:value?.name||'Medicine',dosage:value?.dosage||'—',frequency:value?.frequency||'—',duration:value?.duration||'—',instructions:value?.instructions||'—'}
  const bits=value.split(/[·|]/).map(s=>s.trim()).filter(Boolean)
  return {name:bits[0]||value,dosage:bits[1]||'—',frequency:bits[2]||'—',duration:bits.length>=5?bits[3]:'—',instructions:bits.length>=5?(bits[4]||'—'):(bits[3]||'—')}
}
export default function PrescriptionView({prescription:p,patient,doctor}){
  const medicines=(p.medicines||[]).map(medicineRow)
  return <article className="panel prescription prescription-print-card">
    <div className="prescription-head"><span className="role-icon"><ClipboardList/></span><span className="badge completed">ISSUED {p.issuedAt?new Date(p.issuedAt).toLocaleDateString():'—'}</span></div>
    <h2>{p.diagnosis||'Clinical prescription'}</h2><p>Prescribed by {p.doctorName||'Care team'}</p>
    <div className="notes-block"><b>Clinical notes</b><p>{p.clinicalNotes||'No additional notes.'}</p></div>
    <b>Medicines</b><ul className="medicine-list">{medicines.map((m,i)=><li key={i}>✓ {m.name} — {m.dosage} · {m.frequency}{m.instructions!=='—'?` · ${m.instructions}`:''}</li>)}</ul>
    <div className="prescription-actions"><button className="button secondary" onClick={()=>window.print()}><Printer size={16}/> Print / Download Official Rx</button>{patient?.role==='patient'&&<Link className="button primary" to="/patient/pharmacy" onClick={()=>localStorage.setItem('arogyacare.cartSeed',JSON.stringify(medicines.map(m=>m.name)))}>💊 Order All Prescribed Medicines</Link>}</div>
    <section className="print-prescription" aria-label="Official ArogyaCare prescription">
      <div className="rx-watermark">AROGYACARE</div>
      <header className="rx-header"><div><b className="rx-brand">ArogyaCare</b><p>Hospital & Clinical Services</p></div><div className="rx-document">OFFICIAL PRESCRIPTION<br/><small>Prescription #{p.id}</small></div></header>
      <h1>{p.diagnosis||'Clinical prescription'}</h1>
      <div className="rx-details"><div><b>Doctor</b><span>{p.doctorName||doctor?.name||'Not recorded'}</span><span>{doctor?.specialization||'Specialization not recorded'}</span><span>Registration: Not recorded</span></div><div><b>Patient</b><span>{patient?.name||'Patient record'}</span><span>Age: Not recorded</span><span>Contact: {patient?.contactNumber||'Not recorded'}</span></div><div><b>Visit date</b><span>{p.issuedAt?new Date(p.issuedAt).toLocaleString():'Not recorded'}</span></div></div>
      <div className="rx-notes"><b>Clinical notes</b><p>{p.clinicalNotes||'No additional notes recorded.'}</p></div>
      <table className="rx-table"><thead><tr><th>Medicine name</th><th>Dosage</th><th>Frequency</th><th>Duration</th><th>Special instructions</th></tr></thead><tbody>{medicines.length?medicines.map((m,i)=><tr key={i}><td>{m.name}</td><td>{m.dosage}</td><td>{m.frequency}</td><td>{m.duration}</td><td>{m.instructions}</td></tr>):<tr><td colSpan="5">No medicines recorded for this prescription.</td></tr>}</tbody></table>
      <div className="rx-footer"><div className="rx-signature"><span></span><b>{p.doctorName||'Doctor'}</b><small>Doctor signature</small></div><div className="rx-validation"><div className="qr-placeholder">{String(p.id||'RX').padStart(4,'0')}</div><small>Validation code · RX-{p.id}</small></div></div>
      <small className="rx-disclaimer">This record reflects the data stored in ArogyaCare. Missing clinician credentials or patient demographics are not present in the hospital record.</small>
    </section>
  </article>
}
