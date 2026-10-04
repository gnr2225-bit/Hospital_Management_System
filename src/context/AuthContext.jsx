import { createContext,useContext,useEffect,useState } from 'react'
import { login as verify } from '../services/authService'
const C=createContext(null)
export function AuthProvider({children}) {const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem('arogyacare.session'))}catch{return null}});useEffect(()=>{const out=()=>{setUser(null);localStorage.removeItem('arogyacare.session')};window.addEventListener('arogyacare:unauthorized',out);return()=>window.removeEventListener('arogyacare:unauthorized',out)},[]);const signIn=async data=>{const u=await verify(data);localStorage.setItem('arogyacare.session',JSON.stringify(u));setUser(u);return u};const signOut=()=>{localStorage.removeItem('arogyacare.session');localStorage.removeItem('arogyacare.token');setUser(null)};return <C.Provider value={{user,signIn,signOut}}>{children}</C.Provider>}
export const useAuth=()=>useContext(C)
