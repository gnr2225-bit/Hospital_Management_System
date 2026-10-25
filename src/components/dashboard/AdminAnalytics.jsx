import { useEffect, useState } from 'react'
import { CalendarDays, IndianRupee, Stethoscope, Users } from 'lucide-react'
import StatCard from './StatCard'
import { api } from '../../services/api'
import { doctorService } from '../../services/doctorService'
import { patientService } from '../../services/patientService'

const colors=['#1595b8','#45b5c7','#6ac6b1','#94d3a5','#c3df9c']
const rows=r=>Array.isArray(r)?r:(r?.content||[])
const localKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
export default function AdminAnalytics(props={}){
  const [remote,setRemote]=useState({doctors:[],patients:[],appointments:[],orders:[]})
  useEffect(()=>{if(Object.keys(props).length)return;let live=true;Promise.allSettled([doctorService.list(),patientService.list({size:100}),api.get('/appointments'),api.get('/orders')]).then(([d,p,a,o])=>{if(!live)return;setRemote({doctors:d.status==='fulfilled'?rows(d.value.data):[],patients:p.status==='fulfilled'?rows(p.value.data):[],appointments:a.status==='fulfilled'?rows(a.value.data):[],orders:o.status==='fulfilled'?rows(o.value.data):[]})});return()=>{live=false}},[])
  const doctors=props.doctors??remote.doctors,patients=props.patients??remote.patients,appointments=props.appointments??remote.appointments,orders=props.orders??remote.orders
  const today=localKey(new Date()),todayCount=appointments.filter(a=>a.status!=='CANCELLED'&&String(a.appointmentDate||'').slice(0,10)===today).length
  const revenue=orders.reduce((sum,o)=>sum+Number(o.totalAmount||0),0)
  const weekdays=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));const key=localKey(d);return {label:d.toLocaleDateString(undefined,{weekday:'short'}),count:appointments.filter(a=>String(a.appointmentDate||'').slice(0,10)===key&&a.status!=='CANCELLED').length}})
  const departments=['Cardiology','Dermatology','Neurology','Orthopedics','General Medicine']
  const values=departments.map(dep=>appointments.filter(a=>a.status!=='CANCELLED'&&(a.doctor?.specialization||'').toLowerCase()===dep.toLowerCase()).length)
  const total=values.reduce((a,b)=>a+b,0)||1;let cursor=0;const gradient=values.map((n,i)=>{const start=cursor;cursor+=n/total*100;return `${colors[i]} ${start}% ${cursor}%`}).join(', ')
  const max=Math.max(...weekdays.map(d=>d.count),1)
  return <div className="admin-analytics"><div className="stat-grid"><StatCard label="Active doctors" value={doctors.length} icon={Stethoscope} detail="Clinicians in the directory"/><StatCard label="Registered patients" value={patients.length} icon={Users} detail="Hospital patient records"/><StatCard label="Today's consultations" value={todayCount} icon={CalendarDays} detail="Scheduled or completed today"/><StatCard label="Pharmacy revenue" value={`₹${revenue.toLocaleString('en-IN')}`} icon={IndianRupee} detail="Recorded order totals · demo estimates"/></div>
    <div className="analytics-grid"><section className="panel"><div className="panel-heading"><h2>Weekly consultations</h2><small>Last 7 days</small></div><div className="bar-chart" role="img" aria-label="Weekly consultation counts">{weekdays.map(d=><div className="bar-column" key={d.label}><b>{d.count}</b><span className="bar-track"><i style={{height:`${Math.max(8,d.count/max*100)}%`}}/></span><small>{d.label}</small></div>)}</div></section>
      <section className="panel"><div className="panel-heading"><h2>Appointments by department</h2><small>{total===1&&values.every(n=>n===0)?'No department data yet':`${total} appointments`}</small></div><div className="donut-layout"><div className="donut-chart" style={{background:`conic-gradient(${gradient})`}} role="img" aria-label="Appointment distribution by department"><span>{total===1&&values.every(n=>n===0)?0:total}</span></div><div className="donut-legend">{departments.map((d,i)=><div key={d}><i style={{background:colors[i]}}/><span>{d}</span><b>{values[i]}</b></div>)}</div></div></section></div>
  </div>
}
