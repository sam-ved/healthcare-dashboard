import type { Request, Response } from 'express'
import { prisma } from '../config/prisma.js'

// Get triage statistics
export async function getTriageStats(req: Request, res: Response) {
  try {
    const activePatients = await prisma.patient.count({
      where: { status: 'ADMITTED' }
    })

    const doctorsAvailable = await prisma.employee.count({
      where: { role: 'DOCTOR' }
    })

    const icuPatients = await prisma.visit.count({
      where: { 
        assignedWard: 'ICU',
        status: 'ADMITTED'
      }
    })

    res.json({
      activePatients,
      doctorsAvailable,
      icuOccupancy: Math.min(100, icuPatients * 10) // Mock calculation
    })
  } catch (error) {
    console.error('Get triage stats error:', error)
    res.status(500).json({ message: 'Failed to fetch stats' })
  }
}

// Get analytics
export async function getAnalytics(req: Request, res: Response) {
  try {
    // Mock data for now - would need proper aggregation queries
    const patientInflow = [
      { date: '2026-01-05', count: 8 },
      { date: '2026-01-06', count: 6 },
      { date: '2026-01-07', count: 7 },
      { date: '2026-01-08', count: 9 },
      { date: '2026-01-09', count: 5 },
      { date: '2026-01-10', count: 10 },
      { date: '2026-01-11', count: 8 }
    ]

    const diseaseHeatmap = [
      { disease: 'Chest Pain', count: 15 },
      { disease: 'Knee Injury', count: 12 },
      { disease: 'Back Pain', count: 10 },
      { disease: 'Headache', count: 8 },
      { disease: 'Fever', count: 7 }
    ]

    const doctors = await prisma.employee.findMany({
      where: { role: 'DOCTOR' }
    })

    const staffStatus = doctors.map(doc => ({
      name: doc.fullName,
      status: Math.random() > 0.5 ? 'Available' : 'Busy'
    }))

    res.json({
      patientInflow,
      diseaseHeatmap,
      staffStatus
    })
  } catch (error) {
    console.error('Get analytics error:', error)
    res.status(500).json({ message: 'Failed to fetch analytics' })
  }
}
