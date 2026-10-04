import { X } from 'lucide-react'
export default function Modal({title,onClose,children}) {return <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><section className="modal"><header><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="Close"><X size={19}/></button></header>{children}</section></div>}
