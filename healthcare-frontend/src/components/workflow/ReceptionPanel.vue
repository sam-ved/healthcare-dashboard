<script setup lang="ts">
import { ref, reactive } from 'vue'
import { registerPatient, assignDoctorToPatient, searchPatients, getPatients } from '@/api'
import { AlertCircle, CheckCircle, Search, Plus } from 'lucide-vue-next'

const activeTab = ref('new-patient')
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const allEmployees = ref<any[]>([])

const newPatientForm = reactive({
  name: '',
  fullName: '',
  age: null as number | null,
  phone: '',
  gender: '',
  address: '',
  bloodGroup: '',
  allergies: '',
  issue: '',
  since: '',
})

const selectedPatient = ref<any>(null)
const selectedDoctorId = ref<number | null>(null)

// Load doctors on component mount
const loadDoctors = async () => {
  try {
    const employees = await getPatients()
    allEmployees.value = employees.filter((e: any) => e.role === 'DOCTOR')
  } catch (error) {
    console.error('Failed to load doctors:', error)
  }
}

const registerNewPatient = async () => {
  if (!newPatientForm.name || !newPatientForm.age || !newPatientForm.phone) {
    errorMessage.value = 'Please fill in required fields (Name, Age, Phone)'
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await registerPatient({
      name: newPatientForm.name,
      fullName: newPatientForm.fullName || newPatientForm.name,
      age: newPatientForm.age,
      phone: newPatientForm.phone,
      gender: newPatientForm.gender || undefined,
      address: newPatientForm.address || undefined,
      bloodGroup: newPatientForm.bloodGroup || undefined,
      allergies: newPatientForm.allergies || undefined,
      issue: newPatientForm.issue || 'General Checkup',
      since: newPatientForm.since || new Date().toISOString().split('T')[0],
    })

    successMessage.value = `Patient ${response.patient.name} registered successfully (ID: ${response.patient.pid})`

    // Reset form
    Object.assign(newPatientForm, {
      name: '',
      fullName: '',
      age: null,
      phone: '',
      gender: '',
      address: '',
      bloodGroup: '',
      allergies: '',
      issue: '',
      since: '',
    })

    setTimeout(() => {
      successMessage.value = ''
    }, 4000)
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to register patient'
  } finally {
    loading.value = false
  }
}

const searchExistingPatients = async () => {
  if (!searchQuery.value.trim()) {
    errorMessage.value = 'Please enter search query'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const results = await searchPatients(searchQuery.value)
    searchResults.value = results
    if (results.length === 0) {
      errorMessage.value = 'No patients found'
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to search patients'
  } finally {
    loading.value = false
  }
}

const selectPatient = (patient: any) => {
  selectedPatient.value = patient
  selectedDoctorId.value = null
  errorMessage.value = ''
}

const assignDoctor = async () => {
  if (!selectedPatient.value || !selectedDoctorId.value) {
    errorMessage.value = 'Please select both patient and doctor'
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await assignDoctorToPatient(selectedPatient.value.id, selectedDoctorId.value)
    successMessage.value = `Doctor assigned to ${response.patient.name} successfully`

    selectedPatient.value = null
    selectedDoctorId.value = null
    searchQuery.value = ''
    searchResults.value = []

    setTimeout(() => {
      successMessage.value = ''
    }, 4000)
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to assign doctor'
  } finally {
    loading.value = false
  }
}

// Load doctors on mount
loadDoctors()
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-slate-900 mb-2">Reception Dashboard</h1>
        <p class="text-slate-600">Manage patient registration and doctor assignments</p>
      </div>

      <!-- Tabs -->
      <div class="flex gap-4 mb-6 border-b border-slate-200">
        <button
          @click="activeTab = 'new-patient'"
          :class="[
            'px-4 py-3 font-medium border-b-2 transition-colors',
            activeTab === 'new-patient'
              ? 'border-teal-500 text-teal-600'
              : 'border-transparent text-slate-600 hover:text-slate-900',
          ]"
        >
          <Plus class="inline w-4 h-4 mr-2" />
          Register Patient
        </button>
        <button
          @click="activeTab = 'existing-patient'"
          :class="[
            'px-4 py-3 font-medium border-b-2 transition-colors',
            activeTab === 'existing-patient'
              ? 'border-teal-500 text-teal-600'
              : 'border-transparent text-slate-600 hover:text-slate-900',
          ]"
        >
          <Search class="inline w-4 h-4 mr-2" />
          Assign Doctor
        </button>
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

      <!-- Tab Content -->

      <!-- Tab 1: Register New Patient -->
      <div v-if="activeTab === 'new-patient'" class="bg-white rounded-2xl shadow-lg p-8">
        <h2 class="text-2xl font-bold text-slate-900 mb-6">Register New Patient</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
            <input
              v-model="newPatientForm.name"
              type="text"
              placeholder="e.g. John Doe"
              class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Age *</label>
            <input
              v-model.number="newPatientForm.age"
              type="number"
              placeholder="e.g. 35"
              class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Phone *</label>
            <input
              v-model="newPatientForm.phone"
              type="tel"
              placeholder="e.g. 9876543210"
              class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Gender</label>
            <select
              v-model="newPatientForm.gender"
              class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-slate-700 mb-2">Address</label>
            <input
              v-model="newPatientForm.address"
              type="text"
              placeholder="e.g. 123 Main St, City"
              class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Blood Group</label>
            <select
              v-model="newPatientForm.bloodGroup"
              class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition"
            >
              <option value="">Select Blood Group</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Allergies</label>
            <input
              v-model="newPatientForm.allergies"
              type="text"
              placeholder="e.g. Peanuts, Penicillin"
              class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Chief Complaint</label>
            <input
              v-model="newPatientForm.issue"
              type="text"
              placeholder="e.g. Chest pain, Headache"
              class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Duration</label>
            <input
              v-model="newPatientForm.since"
              type="text"
              placeholder="e.g. 2 days, 1 week"
              class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition"
            />
          </div>
        </div>

        <button
          @click="registerNewPatient"
          :disabled="loading"
          class="mt-8 w-full py-4 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          <Plus class="w-5 h-5" />
          {{ loading ? 'Registering...' : 'Register Patient' }}
        </button>
      </div>

      <!-- Tab 2: Assign Doctor to Existing Patient -->
      <div v-if="activeTab === 'existing-patient'" class="bg-white rounded-2xl shadow-lg p-8">
        <h2 class="text-2xl font-bold text-slate-900 mb-6">Assign Doctor to Patient</h2>

        <!-- Search Section -->
        <div class="mb-8">
          <label class="block text-sm font-semibold text-slate-700 mb-3">Search Patient</label>
          <div class="flex gap-2">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name, ID, or phone..."
              class="flex-1 px-4 py-3 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition"
              @keyup.enter="searchExistingPatients"
            />
            <button
              @click="searchExistingPatients"
              :disabled="loading"
              class="px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 disabled:opacity-50 transition"
            >
              {{ loading ? 'Searching...' : 'Search' }}
            </button>
          </div>
        </div>

        <!-- Search Results -->
        <div v-if="searchResults.length > 0" class="mb-8">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">Search Results</h3>
          <div class="space-y-2">
            <button
              v-for="patient in searchResults"
              :key="patient.id"
              @click="selectPatient(patient)"
              :class="[
                'w-full text-left p-4 rounded-lg border-2 transition',
                selectedPatient?.id === patient.id
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-slate-200 hover:border-teal-300 bg-slate-50',
              ]"
            >
              <div class="font-semibold text-slate-900">{{ patient.name }} ({{ patient.pid }})</div>
              <div class="text-sm text-slate-600">Age: {{ patient.age }}, Phone: {{ patient.phone }}</div>
              <div class="text-xs text-slate-500 mt-1">Status: {{ patient.status }}</div>
            </button>
          </div>
        </div>

        <!-- Doctor Selection (shown when patient is selected) -->
        <div v-if="selectedPatient" class="mb-8 p-6 bg-teal-50 rounded-xl border border-teal-200">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">Selected Patient: {{ selectedPatient.name }}</h3>

          <label class="block text-sm font-semibold text-slate-700 mb-3">Assign Doctor</label>
          <select
            v-model="selectedDoctorId"
            class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition"
          >
            <option :value="null">Select a Doctor...</option>
            <option v-for="doctor in allEmployees" :key="doctor.id" :value="doctor.id">
              {{ doctor.fullName }} ({{ doctor.employeeId }}) - {{ doctor.department || 'General' }}
            </option>
          </select>

          <button
            @click="assignDoctor"
            :disabled="loading || !selectedDoctorId"
            class="mt-4 w-full py-3 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-700 disabled:opacity-50 transition"
          >
            {{ loading ? 'Assigning...' : 'Assign Doctor' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
