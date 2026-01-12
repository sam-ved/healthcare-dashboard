import { Router } from 'express';
import { employeeLogin } from '../controllers/employeeController.js';
const router = Router();
router.post('/employee-login', employeeLogin);
export default router;
//# sourceMappingURL=employeeRoutes.js.map