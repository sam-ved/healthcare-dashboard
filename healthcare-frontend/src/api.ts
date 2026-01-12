// src/api.ts
import axios from 'axios';
import { getToken, saveAuth } from './utils/auth';
import type { Patient, Visit, PatientFormData, AuthResponse, TriageStats, ReceptionDashboardData, DoctorStats } from './types';

// NOTE: Backend routes are mounted at root (e.g., /patients, /auth, /visits)
// so we avoid an extra /api prefix to prevent 404s.
const api = axios.create({
  baseURL: 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getReceptionDashboard = async (): Promise<ReceptionDashboardData> => {
  const response = await api.get('/stats/reception-dashboard');
  return response.data;
};

// --- Authentication APIs ---

export const employeeLogin = async (employeeId: string, password: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/employee-login', { employeeId, password });
  const { token, employee } = response.data;
  saveAuth(token, employee);
  return response.data;
};

export const registerEmployee = async (data: any): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

// --- Patient & Reception APIs ---

// 1. Get All Patients (For Dashboard "Overlooking")
export const getPatients = async (): Promise<Patient[]> => {
  const response = await api.get('/patients');
  return response.data;
};

// 2. Search Patient (For "Looking up" older records)
export const searchPatientByPidOrPhone = async (query: string): Promise<Patient[]> => {
  const response = await api.get(`/patients/search`, { params: { q: query } });
  return response.data;
};

// 3. Create New Patient
export const createPatient = async (data: PatientFormData): Promise<Patient> => {
  const response = await api.post('/patients', data);
  return response.data;
};

// 4. Create Visit (For returning patients)
export const createVisit = async (data: Partial<Visit>): Promise<Visit> => {
  const response = await api.post('/visits', data);
  return response.data;
};
// --- Reception APIs ---

// Get Triage Stats (Active Patients, Doctors, ICU)
export const getTriageStats = async (): Promise<TriageStats> => {
  // Mock data for now, or fetch from backend
  // const response = await api.get('/stats/triage');
  // return response.data;
  return {
    activePatients: 42,
    doctorsAvailable: 8,
    icuOccupancy: 75
  };
};


// --- Doctor APIs ---

// 5. Get Doctor's Personal Stats
// 5. Get Doctor's Personal Stats
export const getDoctorStats = async (doctorId: number): Promise<DoctorStats> => {
  const response = await api.get(`/stats/doctor/${doctorId}`);
  return response.data;
};

// 6. Get Doctor's Patient Queue (Active Visits)
export const getDoctorQueue = async (doctorId: number) => {
  const response = await api.get(`/visits/queue/${doctorId}`);
  return response.data;
};

// 7. Get Full Patient Details (History + Vitals) for Examination
export const getPatientDetails = async (patientId: number) => {
  const response = await api.get(`/patients/${patientId}`);
  return response.data;
};

// 8. Get Single Visit
export const getVisitById = async (visitId: number): Promise<Visit> => {
  const response = await api.get(`/visits/${visitId}`);
  return response.data;
};

// 9. Update Visit (Diagnosis, Prescribe, Admit)
export const updateVisit = async (visitId: number, data: any) => {
  const response = await api.patch(`/visits/${visitId}`, data);
  return response.data;
};

// 9. Schedule Surgery
export const scheduleSurgery = async (data: any) => {
  const response = await api.post('/surgeries', data);
  return response.data;
};

// --- WORKFLOW APIs (Receptionist, Doctor, Nurse) ---

// Receptionist: Register new patient
export const registerPatient = async (data: any) => {
  const response = await api.post('/patients/register', data);
  return response.data;
};

// Receptionist: Assign doctor to patient
export const assignDoctorToPatient = async (patientId: number, doctorId: number) => {
  const response = await api.put(`/patients/${patientId}/assign-doctor`, { doctorId });
  return response.data;
};

// Receptionist: Search patients
export const searchPatients = async (query: string) => {
  const response = await api.get('/patients/search', { params: { q: query } });
  return response.data;
};

// Doctor: Get patients assigned to doctor
export const getDoctorAssignedPatients = async (doctorId: number) => {
  const response = await api.get(`/patients/doctor/${doctorId}/patients`);
  return response.data;
};

// Doctor: Submit consultation
export const submitConsultation = async (patientId: number, data: any) => {
  const response = await api.put(`/patients/doctor/consultation/${patientId}`, data);
  return response.data;
};

// Nurse: Get dashboard with all active patients
export const getNurseDashboard = async () => {
  const response = await api.get('/patients/nurse/dashboard');
  return response.data;
};

// Nurse: Admit patient
export const admitPatient = async (patientId: number) => {
  const response = await api.put(`/patients/nurse/admit/${patientId}`);
  return response.data;
};

// Nurse: Discharge patient
export const dischargePatient = async (patientId: number) => {
  const response = await api.put(`/patients/nurse/discharge/${patientId}`);
  return response.data;
};

// ---- Legacy API stubs to keep existing views working ----

export const getPatientById = async (patientId: number) => {
  const response = await api.get(`/patients/${patientId}`);
  return response.data;
};

export const getAnalytics = async () => {
  const response = await api.get('/stats/analytics');
  return response.data;
};

export const createSurgery = async (data: any) => {
  const response = await api.post('/surgeries', data);
  return response.data;
};