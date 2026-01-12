import { prisma } from '../config/prisma.js';
import { WorkflowStatus } from '@prisma/client';
// ===== RECEPTIONIST WORKFLOWS =====
/**
 * Receptionist: Register a new patient
 * POST /patients/register
 */
export async function registerPatient(req, res) {
    try {
        const { name, fullName, age, phone, gender, address, bloodGroup, allergies, issue, since } = req.body;
        if (!name || !age || !phone) {
            return res.status(400).json({ message: 'Name, age, and phone are required' });
        }
        // Generate unique patient ID
        const patientCount = await prisma.patient.count();
        const pid = `P-${String(patientCount + 1001).padStart(4, '0')}`;
        const patient = await prisma.patient.create({
            data: {
                pid,
                name,
                fullName: fullName || name,
                age,
                phone,
                gender,
                address,
                bloodGroup,
                allergies,
                issue: issue || 'General Checkup',
                since: since || new Date().toISOString().split('T')[0],
                status: WorkflowStatus.WAITING, // Receptionist sets initial status
            },
            include: { assignedDoctor: true },
        });
        res.status(201).json({ message: 'Patient registered successfully', patient });
    }
    catch (error) {
        console.error('Register patient error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
/**
 * Receptionist: Assign a doctor to a patient
 * PUT /patients/:id/assign-doctor
 */
export async function assignDoctor(req, res) {
    try {
        const { id } = req.params;
        const { doctorId } = req.body;
        if (!doctorId) {
            return res.status(400).json({ message: 'Doctor ID is required' });
        }
        // Verify doctor exists
        const doctor = await prisma.employee.findUnique({
            where: { id: parseInt(doctorId) },
        });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        // Update patient with assigned doctor and set status to waiting
        const patient = await prisma.patient.update({
            where: { id: parseInt(id) },
            data: {
                assignedDoctorId: parseInt(doctorId),
                status: WorkflowStatus.WAITING,
            },
            include: { assignedDoctor: true },
        });
        res.json({ message: 'Doctor assigned successfully', patient });
    }
    catch (error) {
        console.error('Assign doctor error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
/**
 * Receptionist: Search for patients by name or ID
 * GET /patients/search?q=query
 */
export async function searchPatient(req, res) {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: 'Search query is required' });
        }
        const patients = await prisma.patient.findMany({
            where: {
                OR: [
                    { name: { contains: String(q), mode: 'insensitive' } },
                    { pid: { contains: String(q), mode: 'insensitive' } },
                    { phone: { contains: String(q), mode: 'insensitive' } },
                ],
            },
            include: { assignedDoctor: true },
        });
        res.json(patients);
    }
    catch (error) {
        console.error('Search patient error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
// ===== DOCTOR WORKFLOWS =====
/**
 * Doctor: Get list of patients assigned to this doctor
 * GET /doctor/:id/patients
 */
export async function getDoctorPatients(req, res) {
    try {
        const { id } = req.params;
        const patients = await prisma.patient.findMany({
            where: {
                assignedDoctorId: parseInt(id),
                status: {
                    not: WorkflowStatus.DISCHARGED, // Show active patients only
                },
            },
            include: { assignedDoctor: true },
        });
        res.json(patients);
    }
    catch (error) {
        console.error('Get doctor patients error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
/**
 * Doctor: Submit consultation for a patient
 * PUT /doctor/consultation/:patientId
 */
export async function submitConsultation(req, res) {
    try {
        const { patientId } = req.params;
        const { prescription, isSurgeryRequired, isAdmissionRecommended } = req.body;
        // Update patient with consultation data
        const patient = await prisma.patient.update({
            where: { id: parseInt(patientId) },
            data: {
                prescription: prescription || null,
                isSurgeryRequired: isSurgeryRequired || false,
                isAdmissionRecommended: isAdmissionRecommended || false,
                status: WorkflowStatus.CONSULTED, // Doctor moves status to consulted
            },
            include: { assignedDoctor: true },
        });
        // If admission is recommended, alert nurses
        if (isAdmissionRecommended) {
            console.log(`🚨 ALERT: Patient ${patient.name} (ID: ${patient.id}) requires admission. Notify nurses.`);
        }
        res.json({ message: 'Consultation submitted successfully', patient });
    }
    catch (error) {
        console.error('Submit consultation error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
// ===== NURSE WORKFLOWS =====
/**
 * Nurse: Get dashboard view - all active patients with doctor details
 * GET /nurse/dashboard
 */
export async function getNurseDashboard(req, res) {
    try {
        const patients = await prisma.patient.findMany({
            where: {
                status: {
                    not: WorkflowStatus.DISCHARGED,
                },
            },
            include: {
                assignedDoctor: {
                    select: {
                        id: true,
                        fullName: true,
                        employeeId: true,
                        department: true,
                    },
                },
            },
            orderBy: [
                { isAdmissionRecommended: 'desc' }, // Admission recommended patients first
                { createdAt: 'desc' },
            ],
        });
        // Format response with additional flags for frontend
        const formattedPatients = patients.map((patient) => ({
            ...patient,
            needsAdmission: patient.isAdmissionRecommended,
            consultationComplete: patient.status === WorkflowStatus.CONSULTED,
            doctorName: patient.assignedDoctor?.fullName || 'Unassigned',
        }));
        res.json(formattedPatients);
    }
    catch (error) {
        console.error('Get nurse dashboard error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
/**
 * Nurse: Update patient admission status
 * PUT /nurse/admit/:patientId
 */
export async function admitPatient(req, res) {
    try {
        const { patientId } = req.params;
        const patient = await prisma.patient.update({
            where: { id: parseInt(patientId) },
            data: {
                status: WorkflowStatus.ADMITTED,
            },
            include: { assignedDoctor: true },
        });
        res.json({ message: 'Patient admitted successfully', patient });
    }
    catch (error) {
        console.error('Admit patient error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
/**
 * Nurse: Discharge a patient
 * PUT /nurse/discharge/:patientId
 */
export async function dischargePatient(req, res) {
    try {
        const { patientId } = req.params;
        const patient = await prisma.patient.update({
            where: { id: parseInt(patientId) },
            data: {
                status: WorkflowStatus.DISCHARGED,
            },
            include: { assignedDoctor: true },
        });
        res.json({ message: 'Patient discharged successfully', patient });
    }
    catch (error) {
        console.error('Discharge patient error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
//# sourceMappingURL=workflowController.js.map