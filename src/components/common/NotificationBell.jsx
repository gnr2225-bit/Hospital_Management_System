import { useEffect, useState } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { appointmentService } from '../../services/appointmentService'
import { api } from '../../services/api'

const load=()=>{try{return JSON.parse(localStorage.getItem('arogyacare.notifications')||'[]')}catch{return []}}
const landingPath=role=>role==='doctor'?'/doctor/appointments':role==='admin'?'/admin':'/patient/appointments'
const list=data=>Array.isArray(data)?data:(data?.content||[])
export default function NotificationBell(){
  const {user}=useAuth(),navigate=useNavigate(),[items,setItems]=useState(load),[open,setOpen]=useState(false),[seen,setSeen]=useState(()=>{try{return new Set(JSON.parse(localStorage.getItem('arogyacare.notificationSeen')||'[]'))}catch{return new Set()}})
  useEffect(()=>{
    let active=true,initialized=false,timer
    const sync=next=>setItems(current=>{const merged=[...next,...current].filter((n,i,all)=>all.findIndex(x=>x.id===n.id)===i).slice(0,12);localStorage.setItem('arogyacare.notifications',JSON.stringify(merged));return merged})
    const onEvent=e=>{const detail=e.detail||{};sync([{id:`event-${Date.now()}-${Math.random()}`,title:detail.title||'Hospital update',body:detail.body||'A new update is available.',createdAt:new Date().toISOString(),path:landingPath(user.role)},...load()])}
    window.addEventListener('arogyacare:notification',onEvent)
    async function poll(){
      try{
        const requests=[appointmentService.list(),user.role==='admin'?api.get('/orders'):user.role==='patient'&&user.patientId?api.get(`/patients/${user.patientId}/orders`):Promise.resolve({data:[]})]
        const [appointmentsResult,ordersResult]=await Promise.allSettled(requests)
        if(!active)return
        const appointments=appointmentsResult.status==='fulfilled'?list(appointmentsResult.value.data):[]
        const relevant=appointments.filter(a=>user.role==='admin'||(user.role==='doctor'&&String(a.doctor?.id??a.doctorId)===String(user.doctorId))||(user.role==='patient'&&String(a.patient?.id??a.patientId)===String(user.patientId)))
        const currentAppointmentIds=relevant.map(a=>String(a.id)),oldAppointmentIds=JSON.parse(localStorage.getItem('arogyacare.notificationAppointmentIds')||'[]')
        const orders=ordersResult.status==='fulfilled'?list(ordersResult.value.data):[]
        const oldOrders=JSON.parse(localStorage.getItem('arogyacare.notificationOrderStatuses')||'{}')
        const nextStatuses=Object.fromEntries(orders.map(o=>[String(o.id),String(o.status||'PLACED').toUpperCase()]))
        if(initialized){
          const freshAppointments=relevant.filter(a=>!oldAppointmentIds.includes(String(a.id))).map(a=>{const clinic=a.doctor?.hospital,address=[clinic?.address,clinic?.city].filter(Boolean).join(', ');return{id:`appointment-${a.id}`,title:'Appointment confirmed',body:`Appointment with ${a.doctor?.name||'your care team'} is confirmed.${clinic?` Go to ${clinic.name}${address?`, ${address}`:''}.`:' Clinic address is not listed; contact the hospital before travelling.'}`,createdAt:new Date().toISOString(),path:landingPath(user.role)}})
          const orderEvents=orders.flatMap(o=>{const old=oldOrders[String(o.id)],status=nextStatuses[String(o.id)];if(old===status)return[];const isNew=old===undefined;const label=status==='OUT_FOR_DELIVERY'?'dispatched for delivery':status.replaceAll('_',' ').toLowerCase();const alreadyNotified=load().some(n=>n.body?.includes(`Order #${o.id}`)&&Date.now()-new Date(n.createdAt).getTime()<60000);if(isNew&&alreadyNotified)return[];return[{id:`order-${o.id}-${status}`,title:isNew?'Medicine order placed':`Order #${o.id} updated`,body:isNew?`Order #${o.id} was placed.`:`Order #${o.id} ${label}.`,createdAt:new Date().toISOString(),path:user.role==='admin'?'/admin':'/patient/pharmacy'}]})
          if(freshAppointments.length||orderEvents.length)sync([...freshAppointments,...orderEvents,...load()])
        }else initialized=true
        localStorage.setItem('arogyacare.notificationAppointmentIds',JSON.stringify([...new Set([...oldAppointmentIds,...currentAppointmentIds])]))
        localStorage.setItem('arogyacare.notificationOrderStatuses',JSON.stringify({...oldOrders,...nextStatuses}))
      }catch{}
      if(active)timer=setTimeout(poll,30000)
    }
    poll()
    return()=>{active=false;clearTimeout(timer);window.removeEventListener('arogyacare:notification',onEvent)}
  },[user.role,user.patientId,user.doctorId])
  const unread=items.filter(n=>!seen.has(n.id)).length
  function openItem(item){const next=new Set(seen);next.add(item.id);setSeen(next);localStorage.setItem('arogyacare.notificationSeen',JSON.stringify([...next]));setOpen(false);navigate(item.path||'/')}
  function markAll(){const next=new Set(items.map(i=>i.id));setSeen(next);localStorage.setItem('arogyacare.notificationSeen',JSON.stringify([...next]))}
  return <div className="notification-wrap"><button className="notification-trigger" aria-label={`Notifications${unread?`, ${unread} unread`:''}`} onClick={()=>setOpen(v=>!v)}><Bell size={19}/>{unread>0&&<span>{unread>9?'9+':unread}</span>}</button>{open&&<section className="notification-menu"><header><b>Notifications</b><button className="text-button" onClick={markAll}><CheckCheck size={14}/> Mark all read</button></header>{items.length?items.map(item=><button className={`notification-item ${seen.has(item.id)?'read':''}`} key={item.id} onClick={()=>openItem(item)}><i/><span><b>{item.title}</b><small>{item.body}</small><time>{new Date(item.createdAt).toLocaleString()}</time></span></button>):<p className="muted notification-empty">No recent updates. New appointments and in-app events will appear here.</p>}</section>}</div>
}
