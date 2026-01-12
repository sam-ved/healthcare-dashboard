import type { Request, Response } from 'express'
import { prisma } from '../config/prisma.js'

// Get active queue by doctor ID
export async function getQueueByDoctor(req: Request, res: Response) {
  try {
    const doctorId = parseInt(req.params.doctorId!)

    const visits = await prisma.visit.findMany({
      where: {
        doctorId,
        status: {
          in: ['CHECKUP_PENDING', 'ADMITTED', 'UNDER_OBSERVATION']
        }
      },
      include: {
        patient: true
      },
      orderBy: { visitDate: 'asc' } // Oldest first (FIFO)
    })

    res.json(visits)
  } catch (error) {
    console.error('Get queue error:', error)
    res.status(500).json({ message: 'Failed to fetch queue' })
  }
}

// Get single visit by ID
export async function getVisitById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id!)
    const visit = await prisma.visit.findUnique({
      where: { id },
      include: {
        patient: {
          include: { visits: { orderBy: { visitDate: 'desc' }, take: 5 } } // Include brief history
        },
        doctor: true
      }
    })
    if (!visit) return res.status(404).json({ message: 'Visit not found' })
    res.json(visit)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch visit' })
  }
}

// Get visits by doctor ID
export async function getVisitsByDoctor(req: Request, res: Response) {
  try {
    const doctorId = parseInt(req.params.doctorId!)

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
    const id = parseInt(req.params.id!)
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
