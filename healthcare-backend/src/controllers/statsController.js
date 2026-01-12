import { prisma } from '../config/prisma.js';
// Get triage statistics
export async function getTriageStats(req, res) {
    try {
        const activePatients = await prisma.patient.count({
            where: { status: 'ADMITTED' }
        });
        const doctorsAvailable = await prisma.employee.count({
            where: { role: 'DOCTOR' }
        });
        const icuPatients = await prisma.visit.count({
            where: {
                assignedWard: 'ICU',
                status: 'ADMITTED'
            }
        });
        res.json({
            activePatients,
            doctorsAvailable,
            icuOccupancy: Math.min(100, icuPatients * 10) // Mock calculation
        });
    }
    catch (error) {
        console.error('Get triage stats error:', error);
        res.status(500).json({ message: 'Failed to fetch stats' });
    }
}
// Get analytics
export async function getAnalytics(req, res) {
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
        ];
        const diseaseHeatmap = [
            { disease: 'Chest Pain', count: 15 },
            { disease: 'Knee Injury', count: 12 },
            { disease: 'Back Pain', count: 10 },
            { disease: 'Headache', count: 8 },
            { disease: 'Fever', count: 7 }
        ];
        const doctors = await prisma.employee.findMany({
            where: { role: 'DOCTOR' }
        });
        const staffStatus = doctors.map(doc => ({
            name: doc.fullName,
            status: Math.random() > 0.5 ? 'Available' : 'Busy'
        }));
        res.json({
            patientInflow,
            diseaseHeatmap,
            staffStatus
        });
    }
    catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({ message: 'Failed to fetch analytics' });
    }
}
// Get reception dashboard data
export async function getReceptionDashboard(req, res) {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        // 1. Available Doctors & On Leave
        const doctors = await prisma.employee.findMany({
            where: { role: 'DOCTOR' },
            select: { id: true, fullName: true, department: true, available: true }
        });
        const availableDoctors = doctors.filter(d => d.available);
        const doctorsOnLeave = doctors.filter(d => !d.available);
        // 2. Today's Appointments (Visits)
        const appointmentsToday = await prisma.visit.findMany({
            where: {
                visitDate: {
                    gte: today,
                    lt: tomorrow
                }
            },
            include: {
                patient: { select: { fullName: true, pid: true } },
                doctor: { select: { fullName: true } }
            }
        });
        // 3. Scheduled Surgeries
        const surgeriesToday = await prisma.surgery.findMany({
            where: {
                scheduledFor: {
                    gte: today,
                    lt: tomorrow
                }
            },
            include: {
                patient: { select: { fullName: true, pid: true } },
                doctor: { select: { fullName: true } }
            }
        });
        res.json({
            availableDoctors,
            doctorsOnLeave,
            appointmentsToday,
            surgeriesToday
        });
    }
    catch (error) {
        console.error('Get reception dashboard error:', error);
        res.status(500).json({ message: 'Failed to fetch reception dashboard data' });
    }
}
// Get doctor dashboard stats
export async function getDoctorStats(req, res) {
    try {
        const doctorId = parseInt(req.params.id || '');
        if (isNaN(doctorId)) {
            return res.status(400).json({ message: 'Invalid doctor ID' });
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        // 1. Patients Waiting (Queue)
        const patientsWaiting = await prisma.visit.count({
            where: {
                doctorId,
                status: { in: ['CHECKUP_PENDING', 'ADMITTED', 'UNDER_OBSERVATION'] }
            }
        });
        // 2. Today's Surgeries
        const surgeriesToday = await prisma.surgery.count({
            where: {
                doctorId,
                scheduledFor: {
                    gte: today,
                    lt: tomorrow
                }
            }
        });
        // 3. Consultations Done Today
        const consultationsDone = await prisma.visit.count({
            where: {
                doctorId,
                status: 'DISCHARGED',
                visitDate: {
                    gte: today,
                    lt: tomorrow
                }
            }
        });
        res.json({
            patientsWaiting,
            surgeriesToday,
            consultationsDone
        });
    }
    catch (error) {
        console.error('Get doctor stats error:', error);
        res.status(500).json({ message: 'Failed to fetch doctor stats' });
    }
}
//# sourceMappingURL=statsController.js.map