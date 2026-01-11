import type { Employee } from '@/types'

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_employee'

export function saveAuth(token: string, employee: Employee): void {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(employee))
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getEmployee(): Employee | null {
  const data = localStorage.getItem(USER_KEY)
  return data ? JSON.parse(data) : null
}

export function getUserRole(): string | null {
  const employee = getEmployee()
  return employee?.role || null
}

export function isAuthenticated(): boolean {
  return !!getToken() && !!getEmployee()
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getAuthHeaders(): HeadersInit {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}
