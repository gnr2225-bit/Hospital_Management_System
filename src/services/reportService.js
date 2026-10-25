import { patientService } from './patientService'
export const reportService = { patient: id => patientService.report(id) }

const childText=(node,name)=>Array.from(node?.children||[]).find(child=>child.localName===name)?.textContent?.trim()||''
export function parsePatientReport(xml){
  if(typeof xml!=='string')return xml
  const document=new DOMParser().parseFromString(xml,'application/xml')
  if(document.getElementsByTagName('parsererror').length)throw new Error('The hospital returned an unreadable SOAP report.')
  const fault=Array.from(document.getElementsByTagName('*')).find(node=>node.localName==='Fault')
  if(fault){const reason=childText(fault,'faultstring')||childText(fault,'Text')||'The SOAP service could not return this report.';throw new Error(reason)}
  const response=Array.from(document.getElementsByTagName('*')).find(node=>node.localName==='getPatientReportResponse')
  if(!response)throw new Error('The SOAP response did not contain a patient report.')
  const appointments=Array.from(response.children).filter(node=>node.localName==='appointments').map(node=>({
    appointmentId:childText(node,'appointmentId'),
    doctorName:childText(node,'doctorName'),
    specialization:childText(node,'specialization'),
    date:childText(node,'date'),
    status:childText(node,'status'),
    reason:childText(node,'reason')
  }))
  return {patientId:childText(response,'patientId'),patientName:childText(response,'patientName'),appointments}
}
