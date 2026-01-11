import type { Request, Response } from 'express'
import { prisma } from '../config/prisma.js'

// Get visits by doctor ID
export async function getVisitsByDoctor(req: Request, res: Response) {
  try {
    const doctorId = parseInt(req.params.doctorId)

    const visits = await prisma.visit.findMany({
      where: { doctorId },
      include: {
        patient: true,
        doctor: true
      },
      orderBy: { visitDate: 'desc' }
    })

    res.json(visits)
  } catch (error) {
    console.error('Get visits error:', error)
    res.status(500).json({ message: 'Failed to fetch visits' })
  }
}

// Create a new visit
export async function createVisit(req: Request, res: Response) {
  try {
    const { patientId, doctorId, visitReason, assignedWard, notes } = req.body

    const visit = await prisma.visit.create({
      data: {
        patientId,
        doctorId,
        visitReason,
        assignedWard,
        notes,
        status: 'CHECKUP_PENDING'
      }
    })

    res.status(201).json(visit)
  } catch (error) {
    console.error('Create visit error:', error)
    res.status(500).json({ message: 'Failed to create visit' })
  }
}

// Update a visit
export async function updateVisit(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id)
    const { status, assignedWard, diagnosis, prescription, notes } = req.body

    const visit = await prisma.visit.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(assignedWard && { assignedWard }),
        ...(diagnosis && { diagnosis }),
        ...(prescription && { prescription }),
        ...(notes && { notes }),
        ...(status === 'DISCHARGED' && { dischargedAt: new Date() })
      }
    })

    res.json(visit)
  } catch (error) {
    console.error('Update visit error:', error)
    res.status(500).json({ message: 'Failed to update visit' })
  }
}
