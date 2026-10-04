import { createContext,useCallback,useContext,useState } from 'react'
import { CheckCircle2, X, AlertCircle } from 'lucide-react'
const C=createContext(null)
export function ToastProvider({children}) { const [items,setItems]=useState([]); const toast=useCallback((message,type='success')=>{const id=Date.now()+Math.random();setItems(x=>[...x,{id,message,type}]);setTimeout(()=>setItems(x=>x.filter(t=>t.id!==id)),4500)},[]);return <C.Provider value={toast}>{children}<div className="toast-stack">{items.map(t=><div className={`toast ${t.type}`} key={t.id}><span>{t.type==='success'?<CheckCircle2 size={19}/>:<AlertCircle size={19}/>}</span>{t.message}<button aria-label="Dismiss" onClick={()=>setItems(x=>x.filter(i=>i.id!==t.id))}><X size={16}/></button></div>)}</div></C.Provider> }
export const useToast=()=>useContext(C)
