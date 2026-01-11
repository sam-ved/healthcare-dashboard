import { Router } from 'express'
import { getVisitsByDoctor, createVisit, updateVisit } from '../controllers/visitController.js'

const router = Router()

router.get('/doctor/:doctorId', getVisitsByDoctor)
router.post('/', createVisit)
router.put('/:id', updateVisit)

export default router
