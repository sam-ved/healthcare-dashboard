import { Router } from 'express';
import { createSurgery, getSurgeries } from '../controllers/surgeryController.js';
const router = Router();
router.post('/', createSurgery);
router.get('/', getSurgeries);
export default router;
//# sourceMappingURL=surgeryRoutes.js.map