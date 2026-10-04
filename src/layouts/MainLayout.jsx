import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
export default function MainLayout(){const [open,setOpen]=useState(false);return <div className="app-shell"><div className={open?'sidebar-wrap open':'sidebar-wrap'}><Sidebar/></div>{open&&<div className="mobile-shade" onClick={()=>setOpen(false)}/>}<div className="main-column"><Navbar onMenu={()=>setOpen(!open)}/><main className="page-content"><Outlet/></main></div></div>}
