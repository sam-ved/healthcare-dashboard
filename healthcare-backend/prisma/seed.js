import { PrismaClient, Role, VisitStatus, WardType, WorkflowStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
    console.log('🌱 Starting seed...');
    // 1. Clean up database (Optional: careful in production!)
    await prisma.surgery.deleteMany();
    await prisma.visit.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.employee.deleteMany();
    // 2. Create Employees
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = await prisma.employee.create({
        data: {
            employeeId: 'ADMIN-001',
            password: hashedPassword,
            role: Role.ADMIN,
            fullName: 'Super Admin',
            mobile: '9999999999',
            email: 'admin@hospital.com',
        },
    });
    const docCardio = await prisma.employee.create({
        data: {
            employeeId: 'DOC-CARDIO-01',
            password: hashedPassword,
            role: Role.DOCTOR,
            fullName: 'Dr. Rajesh Koothrappali',
            mobile: '9876543210',
            email: 'rajesh@hospital.com',
            department: 'Cardiology',
        },
    });
    const docOrtho = await prisma.employee.create({
        data: {
            employeeId: 'DOC-ORTHO-01',
            password: hashedPassword,
            role: Role.DOCTOR,
            fullName: 'Dr. Sheldon Cooper',
            mobile: '9876543211',
            email: 'sheldon@hospital.com',
            department: 'Orthopedics',
        },
    });
    const nurse1 = await prisma.employee.create({
        data: {
            employeeId: 'NURSE-01',
            password: hashedPassword,
            role: Role.NURSE,
            fullName: 'Nurse Joy',
            mobile: '9876543222',
            email: 'joy@hospital.com',
        },
    });
    const nurse2 = await prisma.employee.create({
        data: {
            employeeId: 'NURSE-02',
            password: hashedPassword,
            role: Role.NURSE,
            fullName: 'Nurse Mary',
            mobile: '9876543223',
            email: 'mary@hospital.com',
        },
    });
    const wardboy = await prisma.employee.create({
        data: {
            employeeId: 'WARDBOY-01',
            password: hashedPassword,
            role: Role.WARDBOY,
            fullName: 'Ramu Kaka',
            mobile: '9876543224',
            email: 'ramu@hospital.com',
        },
    });
    const receptionist = await prisma.employee.create({
        data: {
            employeeId: 'REC-001',
            password: hashedPassword,
            role: Role.RECEPTIONIST, // Updated Role
            fullName: 'Receptionist Sharma',
            mobile: '9876543225',
            email: 'sharma@hospital.com',
        },
    });
    console.log('✅ Employees created');
    // 3. Create Patients with new workflow fields
    const p1 = await prisma.patient.create({
        data: {
            name: 'Amit Sharma',
            age: 45,
            issue: 'Chest Pain',
            since: '1 week',
            pid: 'P-1001',
            fullName: 'Amit Sharma',
            gender: 'Male',
            dob: new Date('1979-01-01'),
            phone: '9876500001',
            address: '123 Main St, Pune',
            bloodGroup: 'O+',
            weight: 75,
            height: 175,
            allergies: 'Peanuts',
            status: WorkflowStatus.WAITING,
            assignedDoctorId: docCardio.id,
        },
    });
    const p2 = await prisma.patient.create({
        data: {
            name: 'Priya Verma',
            age: 28,
            issue: 'Knee Injury',
            since: '2 months',
            pid: 'P-1002',
            fullName: 'Priya Verma',
            gender: 'Female',
            dob: new Date('1996-05-15'),
            phone: '9876500002',
            address: '456 College Rd, Mumbai',
            bloodGroup: 'B+',
            weight: 60,
            height: 165,
            status: WorkflowStatus.CONSULTED,
            assignedDoctorId: docOrtho.id,
            prescription: 'Rest and Ice therapy',
            isSurgeryRequired: true,
            isAdmissionRecommended: true,
        },
    });
    const p3 = await prisma.patient.create({
        data: {
            name: 'Rahul Dravid',
            age: 50,
            issue: 'Regular Checkup',
            since: 'Today',
            pid: 'P-1003',
            fullName: 'Rahul Dravid',
            gender: 'Male',
            dob: new Date('1974-01-11'),
            phone: '9876500003',
            address: '789 Wall St, Bangalore',
            bloodGroup: 'AB+',
            weight: 80,
            height: 180,
            status: WorkflowStatus.DISCHARGED,
            assignedDoctorId: docCardio.id,
            prescription: 'Vitamins A and D',
        },
    });
    const p4 = await prisma.patient.create({
        data: {
            name: 'Neha Kulkarni',
            age: 33,
            issue: 'Palpitations',
            since: '3 days',
            pid: 'P-1004',
            fullName: 'Neha Kulkarni',
            gender: 'Female',
            dob: new Date('1991-08-20'),
            phone: '9876500004',
            address: '22 FC Road, Pune',
            bloodGroup: 'A+',
            weight: 55,
            height: 160,
            allergies: 'Penicillin',
            status: WorkflowStatus.CONSULTED,
            assignedDoctorId: docCardio.id,
            prescription: 'Beta blockers',
            isAdmissionRecommended: true,
        },
    });
    const p5 = await prisma.patient.create({
        data: {
            name: 'Suresh Raina',
            age: 39,
            issue: 'Back Pain',
            since: '1 month',
            pid: 'P-1005',
            fullName: 'Suresh Raina',
            gender: 'Male',
            dob: new Date('1985-11-27'),
            phone: '9876500005',
            address: 'MG Road, Delhi',
            bloodGroup: 'O-',
            weight: 78,
            height: 172,
            allergies: 'None',
            status: WorkflowStatus.ADMITTED,
            assignedDoctorId: docOrtho.id,
            prescription: 'Physical therapy',
            isAdmissionRecommended: false,
        },
    });
    console.log('✅ Patients created with workflow fields');
    console.log('🚀 Seed completed successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map