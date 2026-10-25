import { Menu,Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NotificationBell from '../components/common/NotificationBell'
const labels={patient:'Patient portal',doctor:'Doctor portal',admin:'Administration'}
export default function Navbar({onMenu}){const {user}=useAuth(),loc=useLocation();const heading=loc.pathname.split('/').filter(Boolean).slice(-1)[0]?.replace(/-/g,' ')||'Overview';return <header className="topbar"><button className="mobile-menu icon-button" onClick={onMenu}><Menu/></button><div className="crumb"><span>{labels[user.role]}</span><b>{heading.charAt(0).toUpperCase()+heading.slice(1)}</b></div><div className="topbar-actions"><label className="global-search"><Search size={17}/><input placeholder="Search care and records" onKeyDown={e=>e.key==='Enter'&&(window.location.href='/'+user.role+(user.role==='patient'?'/discover':'/appointments'))}/></label><NotificationBell/></div></header>}
