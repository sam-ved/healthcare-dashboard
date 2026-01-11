<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPatientById, updateVisit, createSurgery } from '@/api'
import { getEmployee } from '@/utils/auth'
import { Calendar, Pill, Bed, Activity, Loader2 } from 'lucide-vue-next'
import StatusBadge from '@/components/StatusBadge.vue'
import type { Patient } from '@/types'

const route = useRoute()
const router = useRouter()
const patient = ref<Patient | null>(null)
const loading = ref(true)
const actionLoading = ref(false)

const prescriptionText = ref('')
const selectedWard = ref('')
const surgeryType = ref('')
const surgeryDate = ref('')

const employee = getEmployee()

onMounted(async () => {
  const id = Number(route.params.id)
  try {
    patient.value = await getPatientById(id)
  } catch (err) {
    console.error('Failed to load patient:', err)
  } finally {
    loading.value = false
  }
})

const handlePrescribe = async () => {
  if (!patient.value || !patient.value.visits?.[0] || !prescriptionText.value) return
  
  actionLoading.value = true
  try {
    await updateVisit(patient.value.visits[0].id, {
      prescription: prescriptionText.value,
      status: 'DISCHARGED'
    })
    alert('Patient discharged successfully')
    router.push('/doctor/queue')
  } catch (err: any) {
    alert(err.message || 'Failed to discharge patient')
  } finally {
    actionLoading.value = false
  }
}

const handleAdmit = async () => {
  if (!patient.value || !patient.value.visits?.[0] || !selectedWard.value) return
  
  actionLoading.value = true
  try {
    await updateVisit(patient.value.visits[0].id, {
      assignedWard: selectedWard.value,
      status: 'ADMITTED'
    })
    alert('Patient admitted successfully')
    router.push('/doctor/queue')
  } catch (err: any) {
    alert(err.message || 'Failed to admit patient')
  } finally {
    actionLoading.value = false
  }
}

const handleScheduleSurgery = async () => {
  if (!patient.value || !surgeryType.value || !surgeryDate.value || !employee) return
  
  actionLoading.value = true
  try {
    await createSurgery({
      patientId: patient.value.id,
      doctorId: employee.id,
      surgeryType: surgeryType.value,
      scheduledFor: new Date(surgeryDate.value).toISOString()
    })
    
    if (patient.value.visits?.[0]) {
      await updateVisit(patient.value.visits[0].id, {
        status: 'SURGERY_SCHEDULED'
      })
    }
    
    alert('Surgery scheduled successfully (Relatives notified)')
    router.push('/doctor/queue')
  } catch (err: any) {
    alert(err.message || 'Failed to schedule surgery')
  } finally {
    actionLoading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div v-if="loading" class="text-center py-12">Loading patient...</div>

    <div v-else-if="!patient" class="text-center py-12 text-slate-600">
      Patient not found
    </div>

    <template v-else>
      <!-- Patient Header -->
      <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h1 class="text-2xl font-bold text-slate-900">{{ patient.fullName || patient.name }}</h1>
            <p class="text-slate-600">PID: {{ patient.pid || patient.id }}</p>
          </div>
          <StatusBadge v-if="patient.visits?.[0]" :status="patient.visits[0].status" size="lg" />
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span class="text-slate-600">Age:</span>
            <span class="ml-2 font-semibold">{{ patient.age }}</span>
          </div>
          <div>
            <span class="text-slate-600">Gender:</span>
            <span class="ml-2 font-semibold">{{ patient.gender || 'N/A' }}</span>
          </div>
          <div>
            <span class="text-slate-600">Blood Group:</span>
            <span class="ml-2 font-semibold">{{ patient.bloodGroup || 'N/A' }}</span>
          </div>
          <div>
            <span class="text-slate-600">Allergies:</span>
            <span class="ml-2 font-semibold text-rose-600">{{ patient.allergies || 'None' }}</span>
          </div>
        </div>
      </div>

      <!-- Medical History -->
      <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Activity class="w-5 h-5" />
          Medical History
        </h2>
        <div v-if="patient.visits && patient.visits.length > 0" class="space-y-3">
          <div
            v-for="visit in patient.visits"
            :key="visit.id"
            class="p-4 bg-slate-50 rounded-lg border border-slate-200"
          >
            <div class="flex items-start justify-between mb-2">
              <p class="font-semibold text-slate-900">{{ visit.visitReason }}</p>
              <StatusBadge :status="visit.status" size="sm" />
            </div>
            <p v-if="visit.diagnosis" class="text-sm text-slate-600"><strong>Diagnosis:</strong> {{ visit.diagnosis }}</p>
            <p v-if="visit.prescription" class="text-sm text-slate-600"><strong>Prescription:</strong> {{ visit.prescription }}</p>
            <p class="text-xs text-slate-500 mt-2">{{ new Date(visit.visitDate).toLocaleString() }}</p>
          </div>
        </div>
        <p v-else class="text-slate-600">No previous visits</p>
      </div>

      <!-- Action Console -->
      <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 class="text-lg font-bold text-slate-900 mb-4">Action Console</h2>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Prescribe -->
          <div class="space-y-3">
            <div class="flex items-center gap-2 text-emerald-700 font-semibold">
              <Pill class="w-5 h-5" />
              <span>Prescribe & Discharge</span>
            </div>
            <textarea
              v-model="prescriptionText"
              rows="4"
              placeholder="Enter prescription..."
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
            />
            <button
              @click="handlePrescribe"
              :disabled="actionLoading || !prescriptionText"
              class="w-full px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Loader2 v-if="actionLoading" class="w-4 h-4 animate-spin" />
              <span>Discharge</span>
            </button>
          </div>

          <!-- Admit -->
          <div class="space-y-3">
            <div class="flex items-center gap-2 text-amber-700 font-semibold">
              <Bed class="w-5 h-5" />
              <span>Admit to Ward</span>
            </div>
            <select
              v-model="selectedWard"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Select Ward</option>
              <option value="GENERAL">General</option>
              <option value="ICU">ICU</option>
              <option value="PRIVATE">Private</option>
            </select>
            <button
              @click="handleAdmit"
              :disabled="actionLoading || !selectedWard"
              class="w-full px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center gap-2 mt-16"
            >
              <Loader2 v-if="actionLoading" class="w-4 h-4 animate-spin" />
              <span>Admit</span>
            </button>
          </div>

          <!-- Surgery -->
          <div class="space-y-3">
            <div class="flex items-center gap-2 text-rose-700 font-semibold">
              <Calendar class="w-5 h-5" />
              <span>Schedule Surgery</span>
            </div>
            <input
              v-model="surgeryType"
              type="text"
              placeholder="Surgery type..."
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500"
            />
            <input
              v-model="surgeryDate"
              type="datetime-local"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500"
            />
            <button
              @click="handleScheduleSurgery"
              :disabled="actionLoading || !surgeryType || !surgeryDate"
              class="w-full px-4 py-2 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Loader2 v-if="actionLoading" class="w-4 h-4 animate-spin" />
              <span>Schedule</span>
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
