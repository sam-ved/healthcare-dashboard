<template>
  <!-- Login/Register Screen -->
  <div v-if="!isLoggedIn" class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-100 flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl border border-slate-200 p-8 shadow-xl">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 mb-4">
            <svg class="w-7 h-7 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-slate-900 mb-2">Healthcare Dashboard</h1>
          <p class="text-slate-600">{{ isLoginMode ? 'Sign in to continue' : 'Create your account' }}</p>
        </div>

        <form @submit.prevent="handleAuth" class="space-y-5">
          <!-- Name field (signup only) -->
          <div v-if="!isLoginMode">
            <label class="block text-sm font-semibold text-slate-900 mb-2">Full Name *</label>
            <input
              v-model="authFormData.name"
              type="text"
              placeholder="John Doe"
              required
              :disabled="loading"
              class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            />
          </div>

          <!-- Email field -->
          <div>
            <label class="block text-sm font-semibold text-slate-900 mb-2">Email Address *</label>
            <input
              v-model="authFormData.email"
              type="email"
              placeholder="you@example.com"
              required
              :disabled="loading"
              class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            />
          </div>

          <!-- Password field -->
          <div>
            <label class="block text-sm font-semibold text-slate-900 mb-2">Password *</label>
            <input
              v-model="authFormData.password"
              type="password"
              placeholder="••••••••"
              required
              minlength="6"
              :disabled="loading"
              class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            />
            <p v-if="!isLoginMode" class="text-xs text-slate-600 mt-1">Minimum 6 characters</p>
          </div>

          <!-- Error message -->
          <div v-if="authError" class="rounded-lg bg-rose-50 border border-rose-200 p-3 sm:p-4">
            <p class="text-sm text-rose-800 font-medium">{{ authError }}</p>
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-2.5 text-base font-semibold text-white hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {{ loading ? '⏳ Processing...' : isLoginMode ? 'Sign In' : 'Create Account' }}
          </button>
        </form>

        <!-- Toggle auth mode -->
        <div class="mt-6 text-center">
          <p class="text-sm text-slate-600">
            {{ isLoginMode ? "Don't have an account?" : 'Already have an account?' }}
            <button
              @click="toggleAuthMode"
              :disabled="loading"
              class="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline disabled:opacity-50 transition-colors"
            >
              {{ isLoginMode ? 'Sign up' : 'Sign in' }}
            </button>
          </p>
        </div>
      </div>

      <!-- Demo credentials -->
      <div v-if="isLoginMode" class="mt-6 text-center text-xs text-slate-500">
        <p>Demo: sam@test.com / password123</p>
      </div>
    </div>
  </div>

  <!-- Dashboard Screen -->
  <div v-else class="min-h-screen bg-slate-50">
    <!-- Navbar -->
    <nav class="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 sm:h-20">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-600">
              <span class="text-white font-bold text-lg">H</span>
            </div>
            <div>
              <h1 class="text-xl font-bold text-slate-900">Healthcare Hub</h1>
              <p class="text-xs text-slate-600 hidden sm:block">Patient Management System</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="hidden sm:block text-right">
              <p class="text-sm font-medium text-slate-900">{{ currentUser?.name }}</p>
              <p class="text-xs text-slate-600">{{ currentUser?.email }}</p>
            </div>
            <button
              @click="logout"
              class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 sm:px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <LogOut class="h-4 w-4" />
              <span class="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h2 class="text-3xl sm:text-4xl font-bold text-slate-900">Patient Management</h2>
        <p class="text-slate-600 mt-2">Growth Catalysts — Professional Patient Management System</p>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="mb-6 rounded-lg bg-rose-50 border border-rose-200 p-4">
        <p class="text-sm text-rose-800 font-medium">{{ errorMessage }}</p>
      </div>

      <!-- Patient Enrollment Form -->
      <div class="mb-8 rounded-xl border border-slate-200 bg-white p-6 lg:p-8 shadow-sm">
        <h3 class="text-2xl font-bold text-slate-900 mb-6">Add New Patient</h3>
        
        <form @submit.prevent="savePatient" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Patient Name -->
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-slate-900 mb-2">Patient Name *</label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="Enter full name"
              required
              :disabled="loading"
              class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 transition-all"
            />
            <p v-if="formErrors.name" class="text-xs text-rose-600 mt-1">{{ formErrors.name }}</p>
          </div>

          <!-- Age -->
          <div>
            <label class="block text-sm font-semibold text-slate-900 mb-2">Age *</label>
            <input
              v-model.number="formData.age"
              type="number"
              placeholder="35"
              required
              min="1"
              max="150"
              :disabled="loading"
              class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 transition-all"
            />
            <p v-if="formErrors.age" class="text-xs text-rose-600 mt-1">{{ formErrors.age }}</p>
          </div>

          <!-- Issue Since -->
          <div>
            <label class="block text-sm font-semibold text-slate-900 mb-2">Issue Since *</label>
            <input
              v-model="formData.since"
              type="text"
              placeholder="2026-01-08"
              required
              :disabled="loading"
              class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 transition-all"
            />
            <p v-if="formErrors.since" class="text-xs text-rose-600 mt-1">{{ formErrors.since }}</p>
          </div>

          <!-- Health Issue Description -->
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-slate-900 mb-2">Health Issue Description *</label>
            <textarea
              v-model="formData.issue"
              placeholder="Describe the health issue"
              required
              :disabled="loading"
              rows="3"
              class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 transition-all resize-none"
            />
            <p v-if="formErrors.issue" class="text-xs text-rose-600 mt-1">{{ formErrors.issue }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-2.5 text-base font-semibold text-white hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            <Plus class="h-5 w-5" />
            {{ loading ? 'Saving...' : 'Add Patient' }}
          </button>
        </form>
      </div>

      <!-- Statistics Cards -->
      <div class="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Total Patients -->
        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600 mb-2">Total Patients</p>
              <p class="text-4xl font-bold text-indigo-600">{{ totalPatients }}</p>
            </div>
            <div class="p-3 bg-indigo-100 rounded-full">
              <svg class="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Currently Admitted -->
        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600 mb-2">Currently Admitted</p>
              <p class="text-4xl font-bold text-blue-600">{{ currentlyAdmitted }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Successfully Discharged -->
        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600 mb-2">Successfully Discharged</p>
              <p class="text-4xl font-bold text-emerald-600">{{ successfullyDischarged }}</p>
            </div>
            <div class="p-3 bg-emerald-100 rounded-full">
              <svg class="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Patients Table -->
      <div class="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div class="px-6 py-5 border-b border-slate-200 bg-slate-50">
          <h3 class="text-xl font-bold text-slate-900">Patient Records</h3>
          <p class="text-sm text-slate-600 mt-1">Manage and track patient status</p>
        </div>

        <div v-if="patients.length === 0" class="px-6 py-12 text-center">
          <svg class="w-12 h-12 text-slate-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
            <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000-2 4 4 0 00-4 4v10a4 4 0 004 4h12a4 4 0 004-4V5a4 4 0 00-4-4 1 1 0 000 2 2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clip-rule="evenodd"/>
          </svg>
          <p class="text-sm text-slate-700 font-medium">No patient records yet</p>
          <p class="text-xs text-slate-600 mt-1">Add your first patient using the form above</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-semibold text-slate-900">Name</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-slate-900">Age</th>
                <th class="hidden md:table-cell px-6 py-3 text-left text-sm font-semibold text-slate-900">Issue</th>
                <th class="hidden lg:table-cell px-6 py-3 text-left text-sm font-semibold text-slate-900">Since</th>
                <th class="px-6 py-3 text-center text-sm font-semibold text-slate-900">Status</th>
                <th class="px-6 py-3 text-right text-sm font-semibold text-slate-900">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-for="patient in patients" :key="patient.id" class="hover:bg-slate-50/50 transition-colors">
                <td class="px-6 py-4 font-medium text-slate-900">{{ patient.name }}</td>
                <td class="px-6 py-4 text-slate-700">{{ patient.age }}</td>
                <td class="hidden md:table-cell px-6 py-4 text-slate-700">{{ patient.issue }}</td>
                <td class="hidden lg:table-cell px-6 py-4 text-slate-700">{{ patient.since }}</td>
                <td class="px-6 py-4 text-center">
                  <span
                    class="inline-block px-3 py-1 rounded-full text-xs font-semibold ring-1 ring-inset"
                    :class="patient.status === 'ADMITTED'
                      ? 'bg-blue-50 text-blue-700 ring-blue-600/20'
                      : 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'"
                  >
                    {{ patient.status === 'ADMITTED' ? '✓ Admitted' : '✓ Discharged' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button
                    v-if="patient.status === 'ADMITTED'"
                    @click="dischargePatient(patient.id)"
                    :disabled="loading"
                    class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Check class="h-4 w-4" />
                    <span class="hidden sm:inline">Discharge</span>
                  </button>
                  <button
                    v-else
                    @click="undoDischarge(patient.id)"
                    :disabled="loading"
                    class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <RotateCcw class="h-4 w-4" />
                    <span class="hidden sm:inline">Undo</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { LogOut, Plus, Check, RotateCcw } from 'lucide-vue-next'
import * as api from './api'
import type { Patient, PatientFormData } from './types'

// Auth State
const isLoggedIn = ref(false)
const isLoginMode = ref(true)
const authError = ref('')
const currentUser = ref<{ name: string; email: string } | null>(null)

const authFormData = ref({
  name: '',
  email: '',
  password: ''
})

// Patient Management State
const patients = ref<Patient[]>([])
const loading = ref(false)
const errorMessage = ref('')

const formData = ref<PatientFormData>({
  name: '',
  age: null,
  issue: '',
  since: ''
})

const formErrors = ref({
  name: '',
  age: '',
  issue: '',
  since: ''
})

// Computed Statistics
const totalPatients = computed(() => patients.value.length)
const currentlyAdmitted = computed(() => patients.value.filter(p => p.status === 'ADMITTED').length)
const successfullyDischarged = computed(() => patients.value.filter(p => p.status === 'DISCHARGED').length)

// Lifecycle Hooks
onMounted(() => {
  if (api.isAuthenticated()) {
    isLoggedIn.value = true
    loadPatients()
  }
})

// Auth Methods
const toggleAuthMode = () => {
  isLoginMode.value = !isLoginMode.value
  authError.value = ''
  authFormData.value = { name: '', email: '', password: '' }
}

const handleAuth = async () => {
  authError.value = ''

  // Validation
  if (!authFormData.value.email || !authFormData.value.password) {
    authError.value = 'Email and password are required'
    return
  }

  if (authFormData.value.password.length < 6) {
    authError.value = 'Password must be at least 6 characters'
    return
  }

  if (!isLoginMode.value && !authFormData.value.name) {
    authError.value = 'Name is required for signup'
    return
  }

  loading.value = true

  try {
    let response
    if (isLoginMode.value) {
      response = await api.login(authFormData.value.email, authFormData.value.password)
    } else {
      response = await api.register(
        authFormData.value.name,
        authFormData.value.email,
        authFormData.value.password
      )
    }

    // Save token and user info
    api.saveToken(response.token)
    currentUser.value = response.user
    isLoggedIn.value = true
    authFormData.value = { name: '', email: '', password: '' }
    await loadPatients()
  } catch (error: any) {
    authError.value = error.message || 'Authentication failed'
  } finally {
    loading.value = false
  }
}

const logout = () => {
  api.removeToken()
  isLoggedIn.value = false
  isLoginMode.value = true
  currentUser.value = null
  patients.value = []
  authFormData.value = { name: '', email: '', password: '' }
  authError.value = ''
  errorMessage.value = ''
}

// Patient Management Methods
const loadPatients = async () => {
  try {
    const data = await api.fetchPatients()
    patients.value = data
    errorMessage.value = ''
  } catch (error: any) {
    errorMessage.value = 'Failed to load patients: ' + error.message
    if (error.message === 'Session expired. Please login again.') {
      logout()
    }
  }
}

const savePatient = async () => {
  // Validate form
  formErrors.value = { name: '', age: '', issue: '', since: '' }

  if (!formData.value.name.trim()) {
    formErrors.value.name = 'Name is required'
  }
  if (!formData.value.age || formData.value.age < 1 || formData.value.age > 150) {
    formErrors.value.age = 'Valid age required (1-150)'
  }
  if (!formData.value.issue.trim()) {
    formErrors.value.issue = 'Issue description is required'
  }
  if (!formData.value.since.trim()) {
    formErrors.value.since = 'Issue date is required'
  }

  if (Object.values(formErrors.value).some(e => e)) {
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    await api.createPatient({
      name: formData.value.name.trim(),
      age: formData.value.age as number,
      issue: formData.value.issue.trim(),
      since: formData.value.since.trim()
    })

    // Reset form and reload
    formData.value = { name: '', age: null, issue: '', since: '' }
    await loadPatients()
  } catch (error: any) {
    errorMessage.value = 'Failed to save patient: ' + error.message
  } finally {
    loading.value = false
  }
}

const dischargePatient = async (patientId: any) => {
  loading.value = true
  errorMessage.value = ''

  try {
    await api.updatePatientStatus(patientId, 'DISCHARGED')
    await loadPatients()
  } catch (error: any) {
    errorMessage.value = 'Failed to discharge patient: ' + error.message
  } finally {
    loading.value = false
  }
}

const undoDischarge = async (patientId: any) => {
  loading.value = true
  errorMessage.value = ''

  try {
    await api.updatePatientStatus(patientId, 'ADMITTED')
    await loadPatients()
  } catch (error: any) {
    errorMessage.value = 'Failed to update patient status: ' + error.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Smooth transitions for interactive elements */
button:not(:disabled),
input:not(:disabled),
textarea:not(:disabled) {
  transition: all 0.3s ease;
}

/* Loading animation */
@keyframes shimmer {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

button:disabled {
  animation: shimmer 1.5s ease-in-out infinite;
}

/* Remove default browser styling on inputs */
input[type="text"],
input[type="email"],
input[type="password"],
input[type="number"],
textarea {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

/* Responsive adjustments for mobile */
@media (max-width: 768px) {
  :deep(table) {
    font-size: 0.875rem;
  }
}

/* iOS input fix - prevents zoom */
@media only screen and (max-width: 768px) {
  input,
  textarea,
  select {
    font-size: 16px;
  }
}
</style>
