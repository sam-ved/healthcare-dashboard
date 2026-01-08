import type { Patient, AuthResponse } from './types';

const API_BASE_URL = 'http://localhost:3000';

// Get token from localStorage
function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

// Save token to localStorage
export function saveToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

// Remove token from localStorage
export function removeToken(): void {
  localStorage.removeItem('auth_token');
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!getToken();
}

// Auth API calls
export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  return response.json();
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
}

// Patient API calls
export async function fetchPatients(): Promise<Patient[]> {
  const token = getToken();
  if (!token) throw new Error('No authentication token');

  const response = await fetch(`${API_BASE_URL}/api/patients`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      removeToken();
      throw new Error('Session expired. Please login again.');
    }
    throw new Error('Failed to fetch patients');
  }

  return response.json();
}

export async function createPatient(data: {
  name: string;
  age: number;
  issue: string;
  since: string;
}): Promise<Patient> {
  const token = getToken();
  if (!token) throw new Error('No authentication token');

  const response = await fetch(`${API_BASE_URL}/api/patients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 401) {
      removeToken();
      throw new Error('Session expired. Please login again.');
    }
    const error = await response.json();
    throw new Error(error.message || 'Failed to create patient');
  }

  return response.json();
}

export async function updatePatientStatus(id: number, status: 'ADMITTED' | 'DISCHARGED'): Promise<Patient> {
  const token = getToken();
  if (!token) throw new Error('No authentication token');

  const response = await fetch(`${API_BASE_URL}/api/patients/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      removeToken();
      throw new Error('Session expired. Please login again.');
    }
    throw new Error('Failed to update patient status');
  }

  return response.json();
}

export async function deletePatient(id: number): Promise<void> {
  const token = getToken();
  if (!token) throw new Error('No authentication token');

  const response = await fetch(`${API_BASE_URL}/api/patients/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      removeToken();
      throw new Error('Session expired. Please login again.');
    }
    throw new Error('Failed to delete patient');
  }
}
