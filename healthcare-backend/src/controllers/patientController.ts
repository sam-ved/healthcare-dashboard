import type { Response } from "express"
import type { AuthRequest } from "../middlewares/verifyToken.js"
import { prisma } from "../config/prisma.js"
import {
  createPatient,
  deletePatient,
  listPatients,
  togglePatientStatus,
} from "../services/patientService.js"

export async function createPatientHandler(req: AuthRequest, res: Response) {
  const { name, age, issue, since, fullName, gender, phone, address, bloodGroup, allergies, weight } = req.body
  
  if (!name || !age || !issue) {
    return res.status(400).json({ message: "name, age, and issue are required" })
  }

  try {
    const patient = await createPatient({ 
      name, 
      age: Number(age), 
      issue, 
      since: since || 'Today',
      fullName,
      gender,
      phone,
      address,
      bloodGroup,
      allergies,
      ...(weight && { weight: Number(weight) })
    })
    return res.status(201).json(patient)
  } catch (err) {
    return res.status(400).json({ message: (err as Error).message })
  }
}

export async function getPatientByIdHandler(req: AuthRequest, res: Response) {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid patient id" })
  }

  try {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        visits: {
          include: {
            doctor: true
          },
          orderBy: { visitDate: 'desc' }
        }
      }
    })

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" })
    }

    return res.json(patient)
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message })
  }
}

export async function searchPatientHandler(req: AuthRequest, res: Response) {
  const query = req.query.q as string

  if (!query) {
    return res.status(400).json({ message: "Search query is required" })
  }

  try {
    const patient = await prisma.patient.findFirst({
      where: {
        OR: [
          { pid: query },
          { phone: query }
        ]
      },
      include: {
        visits: {
          orderBy: { visitDate: 'desc' },
          take: 3
        }
      }
    })

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" })
    }

    return res.json(patient)
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message })
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
