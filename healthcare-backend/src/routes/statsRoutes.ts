import { Router } from 'express'
import { getTriageStats, getAnalytics, getReceptionDashboard, getDoctorStats } from '../controllers/statsController.js'

const router = Router()

router.get('/triage', getTriageStats)
router.get('/reception-dashboard', getReceptionDashboard)
router.get('/doctor/:id', getDoctorStats)
router.get('/analytics', getAnalytics)

export default router
