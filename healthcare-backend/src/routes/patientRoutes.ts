import { Router } from "express";
import {
  createPatientHandler,
  deletePatientHandler,
  listPatientsHandler,
  togglePatientStatusHandler,
} from "../controllers/patientController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.post("/patients", verifyToken, createPatientHandler);
router.get("/patients", verifyToken, listPatientsHandler);
router.put("/patients/:id", verifyToken, togglePatientStatusHandler);
router.delete("/patients/:id", verifyToken, deletePatientHandler);

export default router;
