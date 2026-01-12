import { Router } from 'express';
import { getVisitsByDoctor, createVisit, updateVisit, getQueueByDoctor, getVisitById } from '../controllers/visitController.js';
const router = Router();
router.get('/queue/:doctorId', getQueueByDoctor);
router.get('/queue/:doctorId', getQueueByDoctor);
router.get('/doctor/:doctorId', getVisitsByDoctor);
router.get('/:id', getVisitById);
router.post('/', createVisit);
router.patch('/:id', updateVisit);
export default router;
//# sourceMappingURL=visitRoutes.js.map