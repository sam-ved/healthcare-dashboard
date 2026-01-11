<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getVisitsByDoctor } from '@/api'
import { getEmployee } from '@/utils/auth'
import { ClipboardList, Clock, ChevronRight } from 'lucide-vue-next'
import Badge from '@/components/Badge.vue'
import Avatar from '@/components/Avatar.vue'
import type { Visit } from '@/types'
import { useRouter } from 'vue-router'

const router = useRouter()
const visits = ref<Visit[]>([])
const loading = ref(true)

const employee = getEmployee()

onMounted(async () => {
  if (!employee) return
  
  try {
    visits.value = await getVisitsByDoctor(employee.id)
  } catch (err) {
    console.error('Failed to load visits:', err)
  } finally {
    loading.value = false
  }
})

const pendingVisits = computed(() => 
  visits.value.filter((v: Visit) => v.status === 'CHECKUP_PENDING' || v.status === 'ADMITTED')
)

const openPatient = (visit: Visit) => {
  router.push(`/doctor/patient/${visit.patientId}`)
}

const getStatusVariant = (status: string) => {
  const variants: Record<string, 'warning' | 'info' | 'success' | 'danger'> = {
    'CHECKUP_PENDING': 'warning',
    'ADMITTED': 'info',
    'DISCHARGED': 'success',
    'SURGERY_SCHEDULED': 'danger'
  }
  return variants[status] || 'neutral'
}

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}
</script>

<template>
  <div class="space-y-8">
    <div class="animate-fade-in">
      <h1 class="text-4xl font-bold text-slate-900 mb-2">Patient Queue</h1>
      <p class="text-lg text-slate-600">{{ pendingVisits.length }} patients awaiting examination</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-slate-200 rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-slate-200 rounded w-1/3"></div>
            <div class="h-3 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div 
      v-else-if="pendingVisits.length === 0" 
      class="bg-white rounded-2xl border border-slate-200 shadow-lg p-12"
    >
      <div class="text-center">
        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
          <ClipboardList class="w-10 h-10 text-emerald-600" />
        </div>
        <h3 class="text-2xl font-bold text-slate-900 mb-2">All Caught Up!</h3>
        <p class="text-slate-600">No patients in queue right now</p>
      </div>
    </div>

    <!-- Patient List -->
    <div v-else class="space-y-3">
      <div
        v-for="(visit, index) in pendingVisits"
        :key="visit.id"
        @click="openPatient(visit)"
        class="group relative bg-white rounded-xl border-2 border-slate-200 hover:border-medical-400 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg animate-slide-up"
        :style="{ animationDelay: `${index * 50}ms` }"
      >
        <div class="flex items-center justify-between">
          <!-- Patient Info -->
          <div class="flex items-center gap-4 flex-1">
            <Avatar 
              :name="visit.patient?.fullName || visit.patient?.name" 
              size="lg"
            />
            <div class="flex-1">
              <h3 class="text-lg font-bold text-slate-900 mb-1">
                {{ visit.patient?.fullName || visit.patient?.name }}
              </h3>
              <p class="text-sm text-slate-600 mb-2">{{ visit.visitReason }}</p>
              <div class="flex items-center gap-3 text-xs">
                <div class="flex items-center gap-1 text-slate-500">
                  <Clock class="w-3.5 h-3.5" />
                  <span>{{ formatTime(visit.visitDate) }}</span>
                </div>
                <Badge :variant="getStatusVariant(visit.status)" dot>
                  {{ visit.status.replace(/_/g, ' ') }}
                </Badge>
              </div>
            </div>
          </div>

          <!-- Arrow Icon -->
          <ChevronRight class="w-6 h-6 text-slate-400 group-hover:text-medical-600 group-hover:translate-x-1 transition-all duration-200" />
        </div>

        <!-- Hover Glow Effect -->
        <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-medical-500/0 via-medical-500/5 to-medical-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  </div>
</template>
