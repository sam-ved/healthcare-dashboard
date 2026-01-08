export interface Patient {
  id: number;
  name: string;
  age: number;
  issue: string;
  since: string;
  status: 'ADMITTED' | 'DISCHARGED';
  createdAt: string;
}

export interface PatientFormData {
  name: string;
  age: number | null;
  issue: string;
  since: string;
}

export interface FormErrors {
  name: string;
  age: string;
  issue: string;
  since: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}
