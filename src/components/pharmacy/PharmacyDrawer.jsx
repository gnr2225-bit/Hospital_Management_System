import { useState } from 'react'
import { CheckCircle2, Minus, Plus, ShoppingBag, X } from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'

const unitEstimate=50, gstRate=.05
const steps=['PLACED','CONFIRMED','PACKED','OUT FOR DELIVERY','DELIVERED']
const progressIndex=status=>{const index=steps.indexOf(String(status||'PLACED').toUpperCase().replaceAll('_',' '));return Math.max(0,index)}
export default function PharmacyDrawer({open,onClose,medicines,selected,onToggle,quantities,onQuantity,onPlace,busy}){
  const [payment,setPayment]=useState('CASH_ON_DELIVERY'),[processing,setProcessing]=useState(false),[placed,setPlaced]=useState(null),[gatewayError,setGatewayError]=useState('')
  const cart=medicines.filter(m=>selected[m.key]),count=cart.reduce((n,m)=>n+Number(quantities[m.key]||1),0),subtotal=count*unitEstimate,gst=subtotal*gstRate,total=subtotal+gst
  async function checkout(){if(!cart.length)return;const address=document.getElementById('cart-address')?.value?.trim();if(!address){setGatewayError('Enter a delivery address to continue.');return}setProcessing(true);setGatewayError('');setPlaced(null);await new Promise(resolve=>setTimeout(resolve,1100));try{const order=await onPlace(cart,total,payment,address);setPlaced(order);setProcessing(false)}catch(e){setGatewayError(e.response?.data?.error||'Order could not be placed. Please try again.');setProcessing(false)}}
  if(!open)return null
  return <div className="drawer-shade" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><aside className="pharmacy-drawer" role="dialog" aria-modal="true" aria-label="Pharmacy cart"><header className="drawer-header"><div><span className="eyebrow">AROGYACARE PHARMACY</span><h2><ShoppingBag size={19}/> Medicine cart</h2></div><button className="icon-button" onClick={onClose} aria-label="Close cart"><X/></button></header>
    {processing?<div className="gateway-progress"><span className="gateway-spinner"/><h3>{payment==='CASH_ON_DELIVERY'?'Preparing your order':'Simulating secure checkout'}</h3><p>{payment==='CASH_ON_DELIVERY'?'Submitting your COD order…':`Demo ${payment==='SIMULATED_UPI'?'UPI':'card'} flow. No real payment is processed.`}</p><div className="progress-track"><span/></div></div>:placed?<div className="checkout-success"><CheckCircle2 size={40}/><h3>Order placed</h3><p>Tracking ID <b>AC-{placed.id||Date.now()}</b></p><button className="button primary" onClick={()=>{setPlaced(null);onClose()}}>Done</button></div>:<>
      <div className="drawer-body">{cart.length?cart.map(m=><article className="cart-row" key={m.key}><div><b>{m.name}</b><small>Prescription #{m.prescriptionId} · Estimated ₹{unitEstimate} each</small></div><div className="stepper"><button aria-label="Decrease quantity" onClick={()=>onQuantity(m.key,Math.max(1,Number(quantities[m.key]||1)-1))}><Minus size={14}/></button><span>{quantities[m.key]||1}</span><button aria-label="Increase quantity" onClick={()=>onQuantity(m.key,Math.min(99,Number(quantities[m.key]||1)+1))}><Plus size={14}/></button></div><button className="icon-button" aria-label="Remove medicine" onClick={()=>onToggle(m.key,false)}><X size={15}/></button></article>):<p className="empty-state">Choose medicines from your prescriptions to add them here.</p>}
      <p className="estimate-note">Demo estimate only: ₹50 per item and 5% illustrative GST. The hospital API has no catalog or tax configuration; no real payment is processed.</p>
      <label className="form-label">Delivery address<textarea rows="3" id="cart-address" placeholder="House, street, city and postal code"/></label>
      <fieldset className="payment-options"><legend>Payment method</legend><label><input type="radio" name="payment" checked={payment==='CASH_ON_DELIVERY'} onChange={()=>setPayment('CASH_ON_DELIVERY')}/> Cash on Delivery (COD)</label><label><input type="radio" name="payment" checked={payment==='SIMULATED_UPI'} onChange={()=>setPayment('SIMULATED_UPI')}/> UPI (simulated)</label><label><input type="radio" name="payment" checked={payment==='SIMULATED_CARD'} onChange={()=>setPayment('SIMULATED_CARD')}/> Card (simulated)</label></fieldset>
      <div className="cart-totals"><span>Subtotal <b>₹{subtotal.toFixed(2)}</b></span><span>GST (5%) <b>₹{gst.toFixed(2)}</b></span><span className="total-line">Total <b>₹{total.toFixed(2)}</b></span></div>
      {gatewayError&&<div className="notice error-notice" role="alert">{gatewayError}</div>}
      <button className="button primary full" disabled={!cart.length||busy} onClick={checkout}>{busy?<LoadingSpinner label="Placing order"/>:'Place Order'}</button>
      </div>
    </>}
    {placed&&<section className="drawer-tracking"><h3>Order tracking · AC-{placed.id||'new'}</h3><div className="tracking-steps">{steps.map((s,i)=><div className={`tracking-step ${i<=progressIndex(placed.status)?'done':''}`} key={s}><span/>{s}</div>)}</div></section>}
  </aside></div>
}
