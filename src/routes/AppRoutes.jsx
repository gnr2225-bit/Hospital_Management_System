import { Navigate,Route,Routes,useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LandingPage from '../pages/LandingPage'
import RoleSelectPage from '../pages/RoleSelectPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import PharmacyStorePage from '../pages/PharmacyStorePage'
import PatientDashboard from '../pages/PatientDashboard'
import DoctorDashboard from '../pages/DoctorDashboard'
import AdminDashboard from '../pages/AdminDashboard'
import PatientAppointmentsPage from '../pages/PatientAppointmentsPage'
import MainLayout from '../layouts/MainLayout'
import { AppointmentBookingPage,AdminDoctorsPage,AdminHospitalsPage,AdminPatientsPage,DoctorDiscoveryPage,DoctorQueuePage,PrescriptionsPage,SoapReportsPage } from '../pages/WorkflowPages'
function Guard({role,children}){const {user}=useAuth(),loc=useLocation();if(!user)return <Navigate to="/roles" replace state={{from:loc.pathname}}/>;if(user.role!==role)return <Navigate to="/unauthorized" replace/>;return children}
function Portal({role,children}){return <Guard role={role}><MainLayout/></Guard>}
export default function AppRoutes(){return <Routes><Route path="/" element={<LandingPage/>}/><Route path="/roles" element={<RoleSelectPage/>}/><Route path="/login" element={<LoginPage/>}/><Route path="/register" element={<RegisterPage/>}/><Route path="/unauthorized" element={<main className="unauthorized"><div className="error-code">403</div><h1>Access denied</h1><p>This portal is only available to the matching hospital role.</p><a className="button primary" href="/">Return home</a></main>}/><Route path="/patient" element={<Portal role="patient"/>}><Route index element={<PatientDashboard/>}/><Route path="discover" element={<DoctorDiscoveryPage/>}/><Route path="book" element={<AppointmentBookingPage/>}/><Route path="appointments" element={<PatientAppointmentsPage/>}/><Route path="prescriptions" element={<PrescriptionsPage/>}/><Route path="pharmacy" element={<PharmacyStorePage/>}/><Route path="reports" element={<SoapReportsPage/>}/></Route><Route path="/doctor" element={<Portal role="doctor"/>}><Route index element={<DoctorDashboard/>}/><Route path="appointments" element={<DoctorQueuePage/>}/></Route><Route path="/admin" element={<Portal role="admin"/>}><Route index element={<AdminDashboard/>}/><Route path="doctors" element={<AdminDoctorsPage/>}/><Route path="patients" element={<AdminPatientsPage/>}/><Route path="hospitals" element={<AdminHospitalsPage/>}/></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes>}
