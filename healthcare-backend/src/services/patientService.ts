import { PatientStatus } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export interface PatientInput {
  name: string;
  age: number;
  issue: string;
  since: string;
  status?: PatientStatus;
}

export async function createPatient(data: PatientInput) {
  return prisma.patient.create({
    data: {
      name: data.name,
      age: data.age,
      issue: data.issue,
      since: data.since,
      status: data.status ?? PatientStatus.ADMITTED,
    },
  });
}

export async function listPatients() {
  return prisma.patient.findMany({ orderBy: { createdAt: "desc" } });
}

export async function togglePatientStatus(id: number) {
  const patient = await prisma.patient.findUnique({ where: { id } });
  if (!patient) {
    throw new Error("Patient not found");
  }

  const nextStatus =
    patient.status === PatientStatus.ADMITTED ? PatientStatus.DISCHARGED : PatientStatus.ADMITTED;

  return prisma.patient.update({ where: { id }, data: { status: nextStatus } });
}

export async function deletePatient(id: number) {
  return prisma.patient.delete({ where: { id } });
}
