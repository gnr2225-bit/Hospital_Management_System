import { patientService } from './patientService'
export const reportService = { patient: id => patientService.report(id) }
