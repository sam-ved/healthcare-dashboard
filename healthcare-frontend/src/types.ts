export interface Employee {
  id: number
  employeeId: string
  role: 'ADMIN' | 'DOCTOR' | 'NURSE' | 'WARDBOY'
  fullName: string
  contact: string
  department?: string
}

export interface AuthResponse {
  token: string
  employee: Employee
}

export interface Patient {
  id: number
  pid: string
  name: string
  fullName?: string
  age: number
  gender?: string
  phone?: string
  address?: string
  bloodGroup?: string
  allergies?: string
  weight?: number
  issue: string
  since: string
  status: 'ADMITTED' | 'DISCHARGED'
  createdAt: string
  visits?: Visit[]
}

export interface Visit {
  id: number
  patientId: number
  doctorId: number
  visitReason: string
  status: 'CHECKUP_PENDING' | 'ADMITTED' | 'DISCHARGED' | 'SURGERY_SCHEDULED' | 'IN_SURGERY' | 'UNDER_OBSERVATION'
  assignedWard?: 'GENERAL' | 'ICU' | 'PRIVATE'
  diagnosis?: string
  prescription?: string
  notes?: string
  visitDate: string
  dischargedAt?: string
  patient?: Patient
  doctor?: Employee
}

export interface Surgery {
  id: number
  patientId: number
  doctorId: number
  surgeryType: string
  scheduledFor: string
  status: string
  createdAt: string
  patient?: Patient
  doctor?: Employee
}

export interface PatientFormData {
  name: string
  age: number | null
  issue: string
  since: string
  fullName?: string
  gender?: string
  phone?: string
  address?: string
  bloodGroup?: string
  allergies?: string
  weight?: number
}

export interface TriageStats {
  activePatients: number
  doctorsAvailable: number
  icuOccupancy: number
}

export interface Analytics {
  patientInflow: { date: string; count: number }[]
  diseaseHeatmap: { disease: string; count: number }[]
  staffStatus: { name: string; status: 'Available' | 'Busy' }[]
}
