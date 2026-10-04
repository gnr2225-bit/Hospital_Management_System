import { api } from './api'
const accounts = [
 { role:'admin', email:'admin@hospital.com', password:'admin123', name:'Hospital Administrator' },
 { role:'doctor', email:'priya.sharma@hospital.com', password:'doctor123', name:'Dr. Priya Sharma' },
 { role:'doctor', email:'alice.johnson@hospital.com', password:'doctor123', name:'Dr. Alice Johnson' },
 { role:'doctor', email:'ananya.reddy@hospital.com', password:'doctor123', name:'Dr. Ananya Reddy' },
 { role:'patient', email:'john.doe@hospital.com', password:'patient123', name:'John Doe' }
]
export async function login({ role, identifier, password }) {
 const account = accounts.find(a => a.role === role && a.email.toLowerCase() === identifier.trim().toLowerCase() && a.password === password)
 if (role === 'patient' && !(account && account.email === 'john.doe@hospital.com')) {
   try { return (await api.post('/auth/login', { email:identifier.trim(), password })).data }
   catch (error) {
     if (error.response?.status === 401) throw new Error('Invalid email or password for the selected role.')
     if (!error.response) throw new Error('Cannot connect to the hospital service. Make sure the backend is running on port 8080.')
     throw new Error(error.response.data?.message || 'Unable to sign in right now. Please try again.')
   }
 }
 if (!account) throw new Error('Invalid email or password for the selected role.')
 let patientId = null, doctorId = null
 try {
   if (role === 'patient') { const r = await api.get('/patients', { params:{ size:100 } }); const list = Array.isArray(r.data) ? r.data : r.data.content || []; patientId = list.find(p => p.email?.toLowerCase() === account.email)?.id ?? null }
   if (role === 'doctor') { const normalize = name => name?.replace(/^dr\.\s*/i,'').trim().toLowerCase(); const r = await api.get('/doctors'); doctorId = (r.data || []).find(d => normalize(d.name) === normalize(account.name))?.id ?? null }
 } catch (e) { if (e.response) throw new Error('Unable to verify your portal account with the hospital service. Please try again.') }
 return { role, email:account.email, name:account.name, patientId, doctorId }
}

export async function registerPatient(body) {
 return (await api.post('/auth/register', body)).data
}
