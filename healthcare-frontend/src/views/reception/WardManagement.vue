<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getPatients } from '@/api'
import { Bed } from 'lucide-vue-next'
import StatusBadge from '@/components/StatusBadge.vue'
import type { Patient } from '@/types'

const patients = ref<Patient[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    patients.value = await getPatients()
  } catch (err) {
    console.error('Failed to load patients:', err)
  } finally {
    loading.value = false
  }
})

const admittedPatients = computed(() => 
  patients.value.filter((p: Patient) => p.status === 'ADMITTED')
)
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-slate-900 mb-2">Ward Management</h1>
      <p class="text-slate-600">Manage bed assignments and ward allocation</p>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div v-if="loading" class="text-center py-12 text-slate-600">
        Loading patients...
      </div>

      <div v-else-if="admittedPatients.length === 0" class="text-center py-12">
        <Bed class="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p class="text-slate-600">No admitted patients at the moment</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="patient in admittedPatients"
          :key="patient.id"
          class="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors"
        >
          <div class="flex-1">
            <h3 class="font-semibold text-slate-900">{{ patient.fullName || patient.name }}</h3>
            <p class="text-sm text-slate-600">Age: {{ patient.age }} | {{ patient.issue }}</p>
          </div>
          <StatusBadge :status="patient.status" />
        </div>
      </div>
    </div>
  </div>
</template>
