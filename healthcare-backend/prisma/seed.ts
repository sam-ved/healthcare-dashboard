import { PrismaClient, Role, VisitStatus, WardType } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // 1. Clean up database (Optional: careful in production!)
  await prisma.surgery.deleteMany()
  await prisma.visit.deleteMany()
  await prisma.patient.deleteMany()
  await prisma.employee.deleteMany()

  // 2. Create Employees
  const hashedPassword = await bcrypt.hash('password123', 10)

  const admin = await prisma.employee.create({
    data: {
      employeeId: 'ADMIN-001',
      password: hashedPassword,
      role: Role.ADMIN,
      fullName: 'Super Admin',
      contact: '9999999999',
    },
  })

  const docCardio = await prisma.employee.create({
    data: {
      employeeId: 'DOC-CARDIO-01',
      password: hashedPassword,
      role: Role.DOCTOR,
      fullName: 'Dr. Rajesh Koothrappali',
      contact: '9876543210',
      department: 'Cardiology',
    },
  })

  const docOrtho = await prisma.employee.create({
    data: {
      employeeId: 'DOC-ORTHO-01',
      password: hashedPassword,
      role: Role.DOCTOR,
      fullName: 'Dr. Sheldon Cooper',
      contact: '9876543211',
      department: 'Orthopedics',
    },
  })

  const nurse1 = await prisma.employee.create({
    data: {
      employeeId: 'NURSE-01',
      password: hashedPassword,
      role: Role.NURSE,
      fullName: 'Nurse Joy',
      contact: '9876543222',
    },
  })

  const nurse2 = await prisma.employee.create({
    data: {
      employeeId: 'NURSE-02',
      password: hashedPassword,
      role: Role.NURSE,
      fullName: 'Nurse Mary',
      contact: '9876543223',
    },
  })

  const wardboy = await prisma.employee.create({
    data: {
      employeeId: 'WARDBOY-01',
      password: hashedPassword,
      role: Role.WARDBOY,
      fullName: 'Ramu Kaka',
      contact: '9876543224',
    },
  })

  console.log('✅ Employees created')

  // 3. Create Patients
  const p1 = await prisma.patient.create({
    data: {
      name: 'Amit Sharma',
      age: 45,
      issue: 'Chest Pain',
      since: '1 week',
      pid: 'P-1001',
      fullName: 'Amit Sharma',
      gender: 'Male',
      phone: '9876500001',
      address: '123 Main St, Pune',
      bloodGroup: 'O+',
      allergies: 'Peanuts',
      visits: {
        create: {
          doctorId: docCardio.id,
          visitReason: 'Chest Pain',
          status: VisitStatus.ADMITTED,
          assignedWard: WardType.GENERAL,
          diagnosis: 'Mild Cardiac Arrest',
          visitDate: new Date(),
        },
      },
    },
  })

  const p2 = await prisma.patient.create({
    data: {
      name: 'Priya Verma',
      age: 28,
      issue: 'Knee Injury',
      since: '2 months',
      pid: 'P-1002',
      fullName: 'Priya Verma',
      gender: 'Female',
      phone: '9876500002',
      address: '456 College Rd, Mumbai',
      bloodGroup: 'B+',
      weight: 60,
      visits: {
        create: {
          doctorId: docOrtho.id,
          visitReason: 'Knee Injury',
          status: VisitStatus.SURGERY_SCHEDULED,
          diagnosis: 'ACL Tear',
          notes: 'Surgery scheduled for next Tuesday',
        },
      },
    },
  })

  const p3 = await prisma.patient.create({
    data: {
      name: 'Rahul Dravid',
      age: 50,
      issue: 'Regular Checkup',
      since: 'Today',
      pid: 'P-1003',
      fullName: 'Rahul Dravid',
      gender: 'Male',
      phone: '9876500003',
      address: '789 Wall St, Bangalore',
      bloodGroup: 'AB+',
      visits: {
        create: {
          doctorId: docCardio.id,
          visitReason: 'Regular Checkup',
          status: VisitStatus.DISCHARGED,
          diagnosis: 'Healthy',
          prescription: 'Vitamins A and D',
          dischargedAt: new Date(),
        },
      },
    },
  })

  const p4 = await prisma.patient.create({
    data: {
      name: 'Neha Kulkarni',
      age: 33,
      issue: 'Palpitations',
      since: '3 days',
      pid: 'P-1004',
      fullName: 'Neha Kulkarni',
      gender: 'Female',
      phone: '9876500004',
      address: '22 FC Road, Pune',
      bloodGroup: 'A+',
      allergies: 'Penicillin',
      visits: {
        create: {
          doctorId: docCardio.id,
          visitReason: 'Palpitations',
          status: VisitStatus.CHECKUP_PENDING,
          diagnosis: 'To be evaluated',
        },
      },
    },
  })

  const p5 = await prisma.patient.create({
    data: {
      name: 'Suresh Raina',
      age: 39,
      issue: 'Back Pain',
      since: '1 month',
      pid: 'P-1005',
      fullName: 'Suresh Raina',
      gender: 'Male',
      phone: '9876500005',
      address: 'MG Road, Delhi',
      bloodGroup: 'O-',
      allergies: 'None',
      visits: {
        create: {
          doctorId: docOrtho.id,
          visitReason: 'Back Pain',
          status: VisitStatus.ADMITTED,
          assignedWard: WardType.GENERAL,
          diagnosis: 'Lumbar strain',
        },
      },
    },
  })

  // Create a Surgery for Patient 2
  await prisma.surgery.create({
    data: {
      patientId: p2.id,
      doctorId: docOrtho.id,
      surgeryType: 'ACL Reconstruction',
      scheduledFor: new Date(new Date().setDate(new Date().getDate() + 2)), // 2 days from now
      status: 'SCHEDULED',
    },
  })

  console.log('✅ Patients and Visits created')
  console.log('🚀 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })