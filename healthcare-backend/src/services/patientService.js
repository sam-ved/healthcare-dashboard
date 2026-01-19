import { PatientStatus } from "@prisma/client";
import { prisma } from "../config/prisma.js";
export async function createPatient(data) {
    // Generate a simple PID
    const count = await prisma.patient.count();
    const pid = `P-${String(count + 1001).padStart(4, '0')}`;
    return prisma.patient.create({
        data: {
            name: data.name,
            age: data.age,
            dob: data.dob,
            issue: data.issue,
            since: data.since,
            status: data.status ?? PatientStatus.ADMITTED,
            pid,
            fullName: data.fullName || data.name,
            gender: data.gender,
            phone: data.phone,
            address: data.address,
            bloodGroup: data.bloodGroup,
            allergies: data.allergies ?? null,
            weight: data.weight,
            height: data.height
        },
    });
}
export async function listPatients() {
    return prisma.patient.findMany({ orderBy: { createdAt: "desc" } });
}
export async function togglePatientStatus(id) {
    const patient = await prisma.patient.findUnique({ where: { id } });
    if (!patient) {
        throw new Error("Patient not found");
    }
    const nextStatus = patient.status === PatientStatus.ADMITTED ? PatientStatus.DISCHARGED : PatientStatus.ADMITTED;
    return prisma.patient.update({ where: { id }, data: { status: nextStatus } });
}
export async function deletePatient(id) {
    return prisma.patient.delete({ where: { id } });
}
//# sourceMappingURL=patientService.js.map