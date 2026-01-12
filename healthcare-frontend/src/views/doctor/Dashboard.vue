<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getDoctorStats, getDoctorQueue } from '@/api'
import { Users, Activity, ClipboardList, Clock, ArrowRight, UserCheck } from 'lucide-vue-next'
import StatCard from '@/components/StatCard.vue'
import type { DoctorStats, Visit } from '@/types'
import { getEmployee } from '@/utils/auth'

const router = useRouter()
const stats = ref<DoctorStats>({
  patientsWaiting: 0,
  surgeriesToday: 0,
  consultationsDone: 0
})
const queue = ref<Visit[]>([])
const loading = ref(true)
const doctorName = ref('')

onMounted(async () => {
  try {
    const user = getEmployee()
    if (user) {
      doctorName.value = user.fullName || 'Doctor'
      if (user.id) {
        const [statsData, queueData] = await Promise.all([
          getDoctorStats(user.id),
          getDoctorQueue(user.id)
        ])
        stats.value = statsData
        queue.value = queueData
      }
    }
  } catch (err) {
    console.error('Failed to load doctor dashboard:', err)
  } finally {
    loading.value = false
  }
})

const startConsultation = (visitId: number) => {
  router.push(`/doctor/consultation/${visitId}`)
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="animate-fade-in">
      <h1 class="text-4xl font-bold text-slate-900 mb-2">Welcome, {{ doctorName }}</h1>
      <p class="text-lg text-slate-600">Your daily Overview and active patient queue.</p>
    </div>

    <!-- Loading Shimmer -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="h-32 bg-white rounded-xl border border-slate-200 animate-pulse"></div>
    </div>

    <!-- Stats -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style="animation-delay: 0.1s">
      <StatCard
        title="Patients Waiting"
        :value="stats.patientsWaiting"
        :icon="Users"
        color="orange"
        trend="In Queue"
        :trend-up="true"
        :delay="0"
      />
      <StatCard
        title="Surgeries Today"
        :value="stats.surgeriesToday"
        :icon="Activity"
        color="rose"
        trend="Scheduled"
        :trend-up="true"
        :delay="1"
      />
      <StatCard
        title="Consultations Done"
        :value="stats.consultationsDone"
        :icon="UserCheck"
        color="teal"
        trend="Today"
        :trend-up="true"
        :delay="2"
      />
    </div>

    <!-- Active Queue -->
    <div class="animate-slide-up" style="animation-delay: 0.2s">
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        <div class="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
           <h3 class="font-bold text-slate-900 flex items-center gap-2">
             <Clock class="w-5 h-5 text-indigo-600" /> Active Patient Queue
           </h3>
           <span class="text-xs font-semibold bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-600">
             {{ queue.length }} Waiting
           </span>
        </div>
        
        <div v-if="queue.length === 0 && !loading" class="p-12 text-center text-slate-400">
          <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardList class="w-8 h-8 text-slate-300" />
          </div>
          <p class="text-lg font-medium text-slate-900">All caught up!</p>
          <p>No patients currently waiting in your queue.</p>
        </div>

        <div v-else class="divide-y divide-slate-50">
           <div 
             v-for="visit in queue" 
             :key="visit.id"
             class="p-6 hover:bg-slate-50 transition-colors flex items-center gap-6 group"
           >
              <div class="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-lg">
                {{ visit.patient?.fullName?.charAt(0) || 'P' }}
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 mb-1">
                  <h4 class="font-bold text-slate-900 truncate">{{ visit.patient?.fullName }}</h4>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700">
                    {{ visit.status.replace('_', ' ') }}
                  </span>
                </div>
                <p class="text-sm text-slate-500 truncate">
                  <span class="font-medium text-slate-700">Reason:</span> {{ visit.visitReason }}
                </p>
                <div class="flex items-center gap-4 mt-2 text-xs text-slate-400">
                  <span class="flex items-center gap-1"><Clock class="w-3 h-3" /> {{ new Date(visit.visitDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</span>
                  <span>{{ visit.patient?.gender }}, {{ visit.patient?.age }} yrs</span>
                </div>
              </div>

              <button 
                @click="startConsultation(visit.id)"
                class="px-5 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm group-hover:shadow-md"
              >
                Consult <ArrowRight class="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>
