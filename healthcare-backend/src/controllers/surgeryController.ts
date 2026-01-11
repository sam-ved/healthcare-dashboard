import type { Request, Response } from 'express'
import { prisma } from '../config/prisma.js'

// Create a surgery
export async function createSurgery(req: Request, res: Response) {
  try {
    const { patientId, doctorId, surgeryType, scheduledFor } = req.body

    const surgery = await prisma.surgery.create({
      data: {
        patientId,
        doctorId,
        surgeryType,
        scheduledFor: new Date(scheduledFor),
        status: 'SCHEDULED'
      }
    })

    res.status(201).json(surgery)
  } catch (error) {
    console.error('Create surgery error:', error)
    res.status(500).json({ message: 'Failed to create surgery' })
  }
}

// Get surgeries
export async function getSurgeries(req: Request, res: Response) {
  try {
    const surgeries = await prisma.surgery.findMany({
      include: {
        patient: true,
        doctor: true
      },
      orderBy: { scheduledFor: 'asc' }
    })

    res.json(surgeries)
  } catch (error) {
    console.error('Get surgeries error:', error)
    res.status(500).json({ message: 'Failed to fetch surgeries' })
  }
}
