import { Router } from "express"
import {
  createPatientHandler,
  deletePatientHandler,
  listPatientsHandler,
  togglePatientStatusHandler,
  getPatientByIdHandler,
  searchPatientHandler,
} from "../controllers/patientController.js"
import { verifyToken } from "../middlewares/verifyToken.js"

const router = Router()

router.post("/patients", createPatientHandler)
router.get("/patients", listPatientsHandler)
router.get("/patients/search", searchPatientHandler)
router.get("/patients/:id", getPatientByIdHandler)
router.put("/patients/:id", togglePatientStatusHandler)
router.delete("/patients/:id", deletePatientHandler)

export default router
