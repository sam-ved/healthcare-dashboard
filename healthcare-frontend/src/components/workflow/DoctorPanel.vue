<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { getDoctorAssignedPatients, submitConsultation, getEmployee } from '@/api'
import { AlertCircle, CheckCircle, FileText, Wand2, UserCheck } from 'lucide-vue-next'

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const patients = ref<any[]>([])
const currentUserId = ref<number | null>(null)

const selectedPatient = ref<any>(null)
const consultationForm = reactive({
  prescription: '',
  isSurgeryRequired: false,
  isAdmissionRecommended: false,
})

// Get current user from localStorage
const getCurrentUser = () => {
  const userStr = localStorage.getItem('auth_employee')
  if (userStr) {
    const user = JSON.parse(userStr)
    currentUserId.value = user.id
  }
}

const loadPatients = async () => {
  if (!currentUserId.value) return

  loading.value = true
  errorMessage.value = ''

  try {
    const response = await getDoctorAssignedPatients(currentUserId.value)
    patients.value = response
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to load patients'
  } finally {
    loading.value = false
  }
}

const selectPatient = (patient: any) => {
  selectedPatient.value = patient
  consultationForm.prescription = patient.prescription || ''
  consultationForm.isSurgeryRequired = patient.isSurgeryRequired || false
  consultationForm.isAdmissionRecommended = patient.isAdmissionRecommended || false
  errorMessage.value = ''
}

const submitConsult = async () => {
  if (!selectedPatient.value) return

  if (!consultationForm.prescription.trim()) {
    errorMessage.value = 'Prescription is required'
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await submitConsultation(selectedPatient.value.id, {
      prescription: consultationForm.prescription,
      isSurgeryRequired: consultationForm.isSurgeryRequired,
      isAdmissionRecommended: consultationForm.isAdmissionRecommended,
    })

    successMessage.value = `Consultation for ${response.patient.name} submitted successfully`

    // Update the patient in list
    const index = patients.value.findIndex((p) => p.id === response.patient.id)
    if (index !== -1) {
      patients.value[index] = response.patient
    }

    selectedPatient.value = null
    Object.assign(consultationForm, {
      prescription: '',
      isSurgeryRequired: false,
      isAdmissionRecommended: false,
    })

    setTimeout(() => {
      successMessage.value = ''
    }, 4000)
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to submit consultation'
  } finally {
    loading.value = false
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

onMounted(() => {
  getCurrentUser()
  loadPatients()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-slate-900 mb-2">Doctor Dashboard</h1>
        <p class="text-slate-600">Review and consult with your assigned patients</p>
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

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Patient List -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div class="bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-white">
              <h2 class="text-xl font-bold">My Patients</h2>
              <p class="text-teal-100 text-sm mt-1">{{ patients.length }} assigned</p>
            </div>

            <div class="p-4 space-y-2 max-h-[600px] overflow-y-auto">
              <button
                v-if="patients.length === 0"
                disabled
                class="w-full text-center py-8 text-slate-500"
              >
                No patients assigned
              </button>

              <button
                v-for="patient in patients"
                :key="patient.id"
                @click="selectPatient(patient)"
                :class="[
                  'w-full text-left p-3 rounded-lg border-2 transition',
                  selectedPatient?.id === patient.id
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-slate-200 hover:border-teal-300 bg-slate-50',
                ]"
              >
                <div class="font-semibold text-slate-900 text-sm">{{ patient.name }}</div>
                <div class="text-xs text-slate-600 mt-1">{{ patient.pid }} • Age: {{ patient.age }}</div>
                <div :class="['text-xs px-2 py-1 rounded mt-2 w-fit', getStatusColor(patient.status)]">
                  {{ patient.status }}
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Consultation Form -->
        <div v-if="selectedPatient" class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-slate-900 mb-6">Consultation: {{ selectedPatient.name }}</h2>

            <!-- Patient Info -->
            <div class="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-slate-600">Patient ID</p>
                  <p class="font-semibold text-slate-900">{{ selectedPatient.pid }}</p>
                </div>
                <div>
                  <p class="text-sm text-slate-600">Age</p>
                  <p class="font-semibold text-slate-900">{{ selectedPatient.age }} years</p>
                </div>
                <div>
                  <p class="text-sm text-slate-600">Gender</p>
                  <p class="font-semibold text-slate-900">{{ selectedPatient.gender || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-sm text-slate-600">Blood Group</p>
                  <p class="font-semibold text-slate-900">{{ selectedPatient.bloodGroup || 'N/A' }}</p>
                </div>
                <div class="col-span-2">
                  <p class="text-sm text-slate-600">Chief Complaint</p>
                  <p class="font-semibold text-slate-900">{{ selectedPatient.issue }}</p>
                </div>
                <div class="col-span-2">
                  <p class="text-sm text-slate-600">Allergies</p>
                  <p class="font-semibold text-slate-900">{{ selectedPatient.allergies || 'None' }}</p>
                </div>
              </div>
            </div>

            <!-- Consultation Form -->
            <div class="space-y-6">
              <!-- Prescription -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-3">
                  <FileText class="inline w-4 h-4 mr-2" />
                  Prescription *
                </label>
                <textarea
                  v-model="consultationForm.prescription"
                  placeholder="Enter prescription details (medications, dosage, duration)..."
                  rows="5"
                  class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition"
                />
              </div>

              <!-- Surgery Required -->
              <div class="flex items-center gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
                <input
                  v-model="consultationForm.isSurgeryRequired"
                  type="checkbox"
                  id="surgery"
                  class="w-5 h-5 rounded accent-teal-600"
                />
                <label for="surgery" class="flex items-center gap-2 cursor-pointer">
                  <Wand2 class="w-4 h-4 text-blue-600" />
                  <span class="font-medium text-slate-900">Schedule Surgery</span>
                </label>
              </div>

              <!-- Admission Recommended -->
              <div class="flex items-center gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200">
                <input
                  v-model="consultationForm.isAdmissionRecommended"
                  type="checkbox"
                  id="admission"
                  class="w-5 h-5 rounded accent-teal-600"
                />
                <label for="admission" class="flex items-center gap-2 cursor-pointer">
                  <UserCheck class="w-4 h-4 text-amber-600" />
                  <span class="font-medium text-slate-900">Recommend Admission</span>
                </label>
              </div>

              <!-- Submit Button -->
              <button
                @click="submitConsult"
                :disabled="loading"
                class="w-full py-4 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                <CheckCircle class="w-5 h-5" />
                {{ loading ? 'Submitting...' : 'Submit Consultation' }}
              </button>
            </div>
          </div>
        </div>

        <!-- No Patient Selected -->
        <div v-else class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-lg p-12 text-center">
            <UserCheck class="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p class="text-slate-600">Select a patient from the list to view their details and enter consultation notes.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
