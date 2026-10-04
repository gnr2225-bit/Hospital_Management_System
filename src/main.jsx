import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ToastProvider from './components/common/ToastContainer'
import AppRoutes from './routes/AppRoutes'
import './styles.css'
createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><ToastProvider><AuthProvider><AppRoutes/></AuthProvider></ToastProvider></BrowserRouter></React.StrictMode>)
