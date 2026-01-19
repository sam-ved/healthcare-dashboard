import type { Response } from "express"
import type { AuthRequest } from "../middlewares/verifyToken.js"
import { prisma } from "../config/prisma.js"
import {
  createPatient,
  deletePatient,
  listPatients,
  togglePatientStatus,
} from "../services/patientService.js"

import { sendRegistrationSMS } from "../services/smsService.js"

export async function createPatientHandler(req: AuthRequest, res: Response) {
  const { name, dob, issue, since, fullName, gender, phone, address, bloodGroup, allergies, weight, height } = req.body as Record<string, string | number | undefined>
  
  if (!name || !dob || !issue || !phone || !gender || !address || !bloodGroup || !weight || !height) {
    return res.status(400).json({ message: "All mandatory fields (Name, DOB, Phone, Gender, Address, Blood Group, Weight, Height, Issue) are required." })
  }

  // Calculate Age from DOB
  const birthDate = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear(); // Approximate age for summary

  try {
    const patient = await createPatient({ 
      name: String(name), 
      age, 
      dob: new Date(dob),
      issue: String(issue), 
      since: String(since || 'Today'),
      fullName: String(fullName),
      gender: String(gender),
      phone: String(phone),
      address: String(address),
      bloodGroup: String(bloodGroup),
      ...(allergies && { allergies: String(allergies) }),
      weight: Number(weight),
      height: Number(height)
    })

    // Send SMS
    await sendRegistrationSMS(patient.fullName, patient.pid, String(patient.phone)).catch(console.error);

    return res.status(201).json(patient)
  } catch (err: any) {
    // Check for unique constraint violation (P2002)
    if (err.code === 'P2002' && err.meta?.target?.includes('phone')) {
      return res.status(400).json({ message: "Phone number already registered with another patient." })
    }
    return res.status(400).json({ message: err.message })
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
