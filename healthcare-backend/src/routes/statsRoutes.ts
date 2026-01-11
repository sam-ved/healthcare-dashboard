import { Router } from 'express'
import { getTriageStats, getAnalytics } from '../controllers/statsController.js'

const router = Router()

router.get('/triage', getTriageStats)
router.get('/analytics', getAnalytics)

export default router
