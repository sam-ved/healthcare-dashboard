import { Router } from 'express'
import {
  registerPatient,
  assignDoctor,
  searchPatient,
  getDoctorPatients,
  submitConsultation,
  getNurseDashboard,
  admitPatient,
  dischargePatient,
} from '../controllers/workflowController.js'

const router = Router()

// ===== RECEPTIONIST ROUTES =====
router.post('/register', registerPatient)
router.put('/:id/assign-doctor', assignDoctor)
router.get('/search', searchPatient)

// ===== DOCTOR ROUTES =====
router.get('/doctor/:id/patients', getDoctorPatients)
router.put('/doctor/consultation/:patientId', submitConsultation)

// ===== NURSE ROUTES =====
router.get('/nurse/dashboard', getNurseDashboard)
router.put('/nurse/admit/:patientId', admitPatient)
router.put('/nurse/discharge/:patientId', dischargePatient)

export default router
