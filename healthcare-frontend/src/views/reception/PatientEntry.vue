<script setup lang="ts">
import { ref } from 'vue'
import { UserPlus, Search, Loader2, CheckCircle, AlertCircle } from 'lucide-vue-next'
import { createPatient, createVisit, searchPatientByPidOrPhone } from '@/api'
import type { Patient } from '@/types'

const activeTab = ref<'new' | 'returning'>('new')
const loading = ref(false)
const success = ref('')
const error = ref('')

// New Patient Form
const newPatientForm = ref({
  name: '',
  fullName: '',
  age: null as number | null,
  gender: '',
  phone: '',
  address: '',
  bloodGroup: '',
  allergies: '',
  issue: '',
  since: ''
})

// Returning Patient
const searchQuery = ref('')
const foundPatient = ref<Patient | null>(null)
const searchLoading = ref(false)
const returningVisitForm = ref({
  visitReason: '',
  notes: ''
})

const resetMessages = () => {
  success.value = ''
  error.value = ''
}

const handleNewPatient = async () => {
  resetMessages()
  
  if (!newPatientForm.value.name || !newPatientForm.value.age || !newPatientForm.value.issue) {
    error.value = 'Please fill in all required fields'
    return
  }

  loading.value = true
  
  try {
    const patient = await createPatient({
      name: newPatientForm.value.name,
      fullName: newPatientForm.value.fullName || newPatientForm.value.name,
      age: newPatientForm.value.age!,
      gender: newPatientForm.value.gender,
      phone: newPatientForm.value.phone,
      address: newPatientForm.value.address,
      bloodGroup: newPatientForm.value.bloodGroup,
      allergies: newPatientForm.value.allergies,
      issue: newPatientForm.value.issue,
      since: newPatientForm.value.since
    })

    // Create initial visit
    await createVisit({
        patientId: patient.id,
        doctorId: 1, // Will be assigned later
      visitReason: newPatientForm.value.issue,
      notes: 'New patient registration'
    })

    success.value = `Patient registered successfully! PID: ${patient.pid || patient.id} (SMS sent)`
    
    // Reset form
    newPatientForm.value = {
      name: '',
      fullName: '',
      age: null,
      gender: '',
      phone: '',
      address: '',
      bloodGroup: '',
      allergies: '',
      issue: '',
      since: ''
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to register patient'
  } finally {
    loading.value = false
  }
}

const handleSearch = async () => {
  if (!searchQuery.value) return

  searchLoading.value = true
  foundPatient.value = null
  resetMessages()

  try {
    const patient = await searchPatientByPidOrPhone(searchQuery.value)
    if (patient) {
      foundPatient.value = patient
    } else {
      error.value = 'No patient found with that PID or phone number'
    }
  } catch (err: any) {
    error.value = err.message || 'Search failed'
  } finally {
    searchLoading.value = false
  }
}

const handleReturningVisit = async () => {
  if (!foundPatient.value || !returningVisitForm.value.visitReason) {
    error.value = 'Please provide visit reason'
    return
  }

  loading.value = true
  resetMessages()

  try {
    await createVisit({
      patientId: foundPatient.value.id,
      doctorId: 1, // Will be assigned
      visitReason: returningVisitForm.value.visitReason,
      notes: returningVisitForm.value.notes
    })

    success.value = 'Visit created successfully!'
    
    // Reset
    searchQuery.value = ''
    foundPatient.value = null
    returningVisitForm.value = { visitReason: '', notes: '' }
  } catch (err: any) {
    error.value = err.message || 'Failed to create visit'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-slate-900 mb-2">Patient Entry</h1>
      <p class="text-slate-600">Register new or returning patients</p>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="flex border-b border-slate-200">
        <button
          @click="activeTab = 'new'; resetMessages()"
          :class="[
            'flex-1 px-6 py-4 font-semibold transition-colors',
            activeTab === 'new'
              ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600'
              : 'text-slate-600 hover:bg-slate-50'
          ]"
        >
          <div class="flex items-center justify-center gap-2">
            <UserPlus class="w-5 h-5" />
            <span>New Patient</span>
          </div>
        </button>
        <button
          @click="activeTab = 'returning'; resetMessages()"
          :class="[
            'flex-1 px-6 py-4 font-semibold transition-colors',
            activeTab === 'returning'
              ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600'
              : 'text-slate-600 hover:bg-slate-50'
          ]"
        >
          <div class="flex items-center justify-center gap-2">
            <Search class="w-5 h-5" />
            <span>Returning Patient</span>
          </div>
        </button>
      </div>

      <!-- Messages -->
      <div v-if="success" class="m-6 rounded-lg bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3">
        <CheckCircle class="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <p class="text-sm text-emerald-800 font-medium">{{ success }}</p>
      </div>

      <div v-if="error" class="m-6 rounded-lg bg-rose-50 border border-rose-200 p-4 flex items-start gap-3">
        <AlertCircle class="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
        <p class="text-sm text-rose-800 font-medium">{{ error }}</p>
      </div>

      <!-- New Patient Form -->
      <div v-if="activeTab === 'new'" class="p-6">
        <form @submit.prevent="handleNewPatient" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-slate-900 mb-2">
                Name <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="newPatientForm.name"
                type="text"
                required
                class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-slate-900 mb-2">
                Age <span class="text-rose-500">*</span>
              </label>
              <input
                v-model.number="newPatientForm.age"
                type="number"
                required
                min="0"
                max="150"
                class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-slate-900 mb-2">Gender</label>
              <select
                v-model="newPatientForm.gender"
                class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-slate-900 mb-2">Phone</label>
              <input
                v-model="newPatientForm.phone"
                type="tel"
                placeholder="9876543210"
                class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-slate-900 mb-2">Blood Group</label>
              <select
                v-model="newPatientForm.bloodGroup"
                class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
                <option>O+</option>
                <option>O-</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-slate-900 mb-2">Allergies</label>
              <input
                v-model="newPatientForm.allergies"
                type="text"
                placeholder="None"
                class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-slate-900 mb-2">Address</label>
              <input
                v-model="newPatientForm.address"
                type="text"
                class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-slate-900 mb-2">
                Chief Complaint <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="newPatientForm.issue"
                type="text"
                required
                placeholder="e.g., Chest pain"
                class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-slate-900 mb-2">Duration</label>
              <input
                v-model="newPatientForm.since"
                type="text"
                placeholder="e.g., 3 days"
                class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
            <span>{{ loading ? 'Registering...' : 'Register Patient' }}</span>
          </button>
        </form>
      </div>

      <!-- Returning Patient Search -->
      <div v-else class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">
            Search by PID or Phone Number
          </label>
          <div class="flex gap-3">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="P-1001 or 9876543210"
              class="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              @keyup.enter="handleSearch"
            />
            <button
              @click="handleSearch"
              :disabled="searchLoading || !searchQuery"
              class="px-6 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <Loader2 v-if="searchLoading" class="w-5 h-5 animate-spin" />
              <Search v-else class="w-5 h-5" />
              <span>Search</span>
            </button>
          </div>
        </div>

        <!-- Patient Found -->
        <div v-if="foundPatient" class="space-y-6">
          <div class="bg-slate-50 rounded-lg border border-slate-200 p-6">
            <h3 class="font-bold text-slate-900 mb-4">Patient History</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-slate-600">Name:</span>
                <span class="ml-2 font-semibold text-slate-900">{{ foundPatient.fullName || foundPatient.name }}</span>
              </div>
              <div>
                <span class="text-slate-600">Age:</span>
                <span class="ml-2 font-semibold text-slate-900">{{ foundPatient.age }}</span>
              </div>
              <div>
                <span class="text-slate-600">Blood Group:</span>
                <span class="ml-2 font-semibold text-slate-900">{{ foundPatient.bloodGroup || 'N/A' }}</span>
              </div>
              <div>
                <span class="text-slate-600">Phone:</span>
                <span class="ml-2 font-semibold text-slate-900">{{ foundPatient.phone || 'N/A' }}</span>
              </div>
            </div>
          </div>

          <form @submit.prevent="handleReturningVisit" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-slate-900 mb-2">
                Visit Reason <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="returningVisitForm.visitReason"
                type="text"
                required
                placeholder="e.g., Follow-up checkup"
                class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-slate-900 mb-2">Notes</label>
              <textarea
                v-model="returningVisitForm.notes"
                rows="3"
                placeholder="Additional notes (BP, Weight, etc.)"
                class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
              <span>{{ loading ? 'Creating Visit...' : 'Create Visit' }}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
