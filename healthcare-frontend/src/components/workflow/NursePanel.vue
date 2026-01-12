<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getNurseDashboard, admitPatient, dischargePatient } from '@/api'
import { AlertCircle, CheckCircle, AlertTriangle, LogOut, Plus } from 'lucide-vue-next'

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const patients = ref<any[]>([])
const selectedPatientId = ref<number | null>(null)

const loadDashboard = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await getNurseDashboard()
    patients.value = response
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to load dashboard'
  } finally {
    loading.value = false
  }
}

const handleAdmit = async (patientId: number) => {
  try {
    const response = await admitPatient(patientId)
    const index = patients.value.findIndex((p) => p.id === patientId)
    if (index !== -1) {
      patients.value[index] = response.patient
    }
    successMessage.value = `${response.patient.name} admitted successfully`
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to admit patient'
  }
}

const handleDischarge = async (patientId: number) => {
  try {
    const response = await dischargePatient(patientId)
    const index = patients.value.findIndex((p) => p.id === patientId)
    if (index !== -1) {
      patients.value.splice(index, 1) // Remove from list
    }
    successMessage.value = `${response.patient.name} discharged successfully`
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to discharge patient'
  }
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    WAITING: 'bg-blue-100 text-blue-700',
    CONSULTED: 'bg-green-100 text-green-700',
    ADMITTED: 'bg-yellow-100 text-yellow-700',
    DISCHARGED: 'bg-slate-100 text-slate-700',
  }
  return colors[status] || 'bg-slate-100 text-slate-700'
}

const admissionRequiredCount = computed(() => {
  return patients.value.filter((p) => p.isAdmissionRecommended).length
})

import { computed } from 'vue'

onMounted(() => {
  loadDashboard()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-slate-900 mb-2">Nurse Dashboard</h1>
        <p class="text-slate-600">Monitor and manage patient admissions and discharges</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
          <p class="text-slate-600 text-sm font-medium">Total Active Patients</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">{{ patients.length }}</p>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-amber-500">
          <p class="text-slate-600 text-sm font-medium">Awaiting Admission</p>
          <p class="text-3xl font-bold text-amber-600 mt-2">{{ admissionRequiredCount }}</p>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
          <p class="text-slate-600 text-sm font-medium">Admitted</p>
          <p class="text-3xl font-bold text-green-600 mt-2">
            {{ patients.filter((p) => p.status === 'ADMITTED').length }}
          </p>
        </div>
      </div>

      <!-- Messages -->
      <div v-if="successMessage" class="mb-6 p-4 rounded-xl bg-emerald-50 text-emerald-700 flex items-center gap-2 border border-emerald-200">
        <CheckCircle class="w-5 h-5" />
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="mb-6 p-4 rounded-xl bg-rose-50 text-rose-700 flex items-center gap-2 border border-rose-200">
        <AlertCircle class="w-5 h-5" />
        {{ errorMessage }}
      </div>

      <!-- Refresh Button -->
      <div class="mb-6">
        <button
          @click="loadDashboard"
          :disabled="loading"
          class="px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 disabled:opacity-50 transition"
        >
          {{ loading ? 'Refreshing...' : 'Refresh Dashboard' }}
        </button>
      </div>

      <!-- Patients Table -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div v-if="patients.length === 0" class="p-12 text-center">
          <AlertTriangle class="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p class="text-slate-600 text-lg">No active patients at the moment</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200">
                <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Patient Name</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">ID</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Age</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Doctor</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Complaint</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Admission Needed</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr
                v-for="patient in patients"
                :key="patient.id"
                :class="[
                  'hover:bg-slate-50 transition',
                  patient.isAdmissionRecommended ? 'bg-red-50' : '',
                ]"
              >
                <!-- Patient Name (Red highlight if admission needed) -->
                <td :class="['px-6 py-4 font-semibold', patient.isAdmissionRecommended ? 'text-red-700' : 'text-slate-900']">
                  {{ patient.name }}
                </td>

                <!-- Patient ID -->
                <td class="px-6 py-4 text-slate-600 text-sm font-mono">{{ patient.pid }}</td>

                <!-- Age -->
                <td class="px-6 py-4 text-slate-600">{{ patient.age }} yrs</td>

                <!-- Doctor Name -->
                <td class="px-6 py-4 text-slate-600">
                  <span class="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-sm font-medium">
                    {{ patient.doctorName || 'Unassigned' }}
                  </span>
                </td>

                <!-- Chief Complaint -->
                <td class="px-6 py-4 text-slate-600 text-sm">{{ patient.issue }}</td>

                <!-- Status Badge -->
                <td class="px-6 py-4">
                  <span :class="['px-3 py-1 rounded-full text-sm font-medium', getStatusColor(patient.status)]">
                    {{ patient.status }}
                  </span>
                </td>

                <!-- Admission Flag -->
                <td class="px-6 py-4">
                  <div v-if="patient.isAdmissionRecommended" class="flex items-center gap-2">
                    <AlertTriangle class="w-5 h-5 text-red-600" />
                    <span class="text-red-600 font-semibold">Required</span>
                  </div>
                  <div v-else class="text-slate-500 text-sm">No</div>
                </td>

                <!-- Actions -->
                <td class="px-6 py-4">
                  <div class="flex gap-2">
                    <!-- Admit Button (Show if not admitted) -->
                    <button
                      v-if="patient.status !== 'ADMITTED'"
                      @click="handleAdmit(patient.id)"
                      class="px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition flex items-center gap-1"
                    >
                      <Plus class="w-4 h-4" />
                      Admit
                    </button>

                    <!-- Discharge Button (Show if admitted) -->
                    <button
                      v-if="patient.status === 'ADMITTED'"
                      @click="handleDischarge(patient.id)"
                      class="px-3 py-2 rounded-lg bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition flex items-center gap-1"
                    >
                      <LogOut class="w-4 h-4" />
                      Discharge
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Legend -->
      <div class="mt-8 p-6 bg-white rounded-2xl shadow-lg">
        <h3 class="font-semibold text-slate-900 mb-4">Legend</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex items-center gap-3">
            <div class="w-3 h-3 rounded-full bg-red-500"></div>
            <span class="text-sm text-slate-700">Row highlighted = Admission recommended</span>
          </div>
          <div class="flex items-center gap-3">
            <AlertTriangle class="w-4 h-4 text-red-600" />
            <span class="text-sm text-slate-700">Admission status indicator</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="px-2 py-1 rounded text-xs bg-green-100 text-green-700">ADMITTED</span>
            <span class="text-sm text-slate-700">Patient status</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
