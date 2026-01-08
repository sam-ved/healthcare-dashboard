import type { Response } from "express";
import type { AuthRequest } from "../middlewares/verifyToken.js";
import {
  createPatient,
  deletePatient,
  listPatients,
  togglePatientStatus,
} from "../services/patientService.js";

export async function createPatientHandler(req: AuthRequest, res: Response) {
  const { name, age, issue, since } = req.body;
  if (!name || !age || !issue || !since) {
    return res.status(400).json({ message: "name, age, issue, and since are required" });
  }

  try {
    const patient = await createPatient({ name, age: Number(age), issue, since });
    return res.status(201).json(patient);
  } catch (err) {
    return res.status(400).json({ message: (err as Error).message });
  }
}

export async function listPatientsHandler(req: AuthRequest, res: Response) {
  const patients = await listPatients();
  return res.json(patients);
}

export async function togglePatientStatusHandler(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid patient id" });
  }

  try {
    const updated = await togglePatientStatus(id);
    return res.json(updated);
  } catch (err) {
    return res.status(404).json({ message: (err as Error).message });
  }
}

export async function deletePatientHandler(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid patient id" });
  }

  try {
    await deletePatient(id);
    return res.status(204).send();
  } catch (err) {
    return res.status(404).json({ message: (err as Error).message });
  }
}
