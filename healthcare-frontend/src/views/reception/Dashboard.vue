<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getReceptionDashboard } from '@/api'
import { Users, UserCog, Bed, Activity, Calendar, Stethoscope, ClipboardList } from 'lucide-vue-next'
import StatCard from '@/components/StatCard.vue'
import type { ReceptionDashboardData } from '@/types'

const data = ref<ReceptionDashboardData | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    data.value = await getReceptionDashboard()
  } catch (err) {
    console.error('Failed to load dashboard data:', err)
  } finally {
    loading.value = false
  }
})

// Derived Stats
const stats = computed(() => {
  if (!data.value) return { activePatients: 0, doctorsAvailable: 0, appointments: 0, surgeries: 0 }
  return {
    activePatients: 42, // Mocked for now as backend endpoint logic was specific to reception dashboard lists
    doctorsAvailable: data.value.availableDoctors.length,
    appointments: data.value.appointmentsToday.length,
    surgeries: data.value.surgeriesToday.length
  }
})
</script>

<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div class="animate-fade-in">
      <h1 class="text-4xl font-bold text-slate-900 mb-2">Reception Dashboard</h1>
      <p class="text-lg text-slate-600">Overview of today's hospital operations</p>
    </div>

    <!-- Loading Shimmer -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div v-for="i in 4" :key="i" class="h-32 bg-white rounded-xl border border-slate-200 p-6 animate-pulse"></div>
    </div>

    <!-- Stats Cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard
        title="Doctors Available"
        :value="stats.doctorsAvailable"
        :icon="UserCog"
        color="medical"
        trend="Just now"
        :trend-up="true"
        :delay="0"
      />
      <StatCard
        title="Appointments"
        :value="stats.appointments"
        :icon="Calendar"
        color="blue"
        trend="Today"
        :trend-up="true"
        :delay="1"
      />
      <StatCard
        title="Surgeries"
        :value="stats.surgeries"
        :icon="Activity"
        color="rose"
        trend="Scheduled"
        :trend-up="false"
        :delay="2"
      />
      <StatCard
        title="Active Patients"
        :value="stats.activePatients"
        :icon="Users"
        color="indigo"
        trend="In Wards"
        :trend-up="true"
        :delay="3"
      />
    </div>

    <!-- Main Content Grid -->
    <div v-if="!loading && data" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Available Doctors List -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px] animate-slide-up" style="animation-delay: 0.2s">
        <div class="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div class="flex items-center gap-3">
             <div class="p-2 bg-teal-100 rounded-lg"><Stethoscope class="w-5 h-5 text-teal-600" /></div>
             <h3 class="font-bold text-slate-900">Doctors On Duty</h3>
          </div>
          <span class="text-xs font-semibold bg-white border border-slate-200 px-2 py-1 rounded-md text-slate-500">{{ data.availableDoctors.length }} Active</span>
        </div>
        <div class="overflow-y-auto p-4 space-y-3 flex-1">
          <div v-if="data.availableDoctors.length === 0" class="text-center py-10 text-slate-400 italic">No doctors available properly marked.</div>
          <div 
            v-for="doc in data.availableDoctors" 
            :key="doc.employeeId"
            class="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group"
          >
            <div class="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm group-hover:bg-white group-hover:shadow-sm transition-all">
              {{ doc.fullName.charAt(0) }}
            </div>
            <div>
              <p class="font-semibold text-slate-900">{{ doc.fullName }}</p>
              <p class="text-xs text-slate-500">{{ doc.department || 'General' }}</p>
            </div>
            <div class="ml-auto">
              <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
            </div>
          </div>
        </div>
      </div>

     <!-- Today's Appointments -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px] animate-slide-up" style="animation-delay: 0.3s">
        <div class="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div class="flex items-center gap-3">
             <div class="p-2 bg-blue-100 rounded-lg"><ClipboardList class="w-5 h-5 text-blue-600" /></div>
             <h3 class="font-bold text-slate-900">Appointments</h3>
          </div>
          <span class="text-xs font-semibold bg-white border border-slate-200 px-2 py-1 rounded-md text-slate-500">{{ data.appointmentsToday.length }} Scheduled</span>
        </div>
        <div class="overflow-y-auto p-4 space-y-3 flex-1">
           <div v-if="data.appointmentsToday.length === 0" class="text-center py-10 text-slate-400 italic">No appointments for today.</div>
           <div 
             v-for="visit in data.appointmentsToday" 
             :key="visit.id"
             class="p-4 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-md transition-all duration-200 cursor-pointer"
           >
             <div class="flex justify-between items-start mb-2">
               <span class="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{{ visit.patient.pid }}</span>
               <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{{ visit.status.replace('_', ' ') }}</span>
             </div>
             <p class="font-bold text-slate-900">{{ visit.patient.fullName }}</p>
             <div class="flex items-center gap-2 mt-2 text-xs text-slate-500">
               <Stethoscope class="w-3 h-3" />
               <span>Dr. {{ visit.doctor.fullName }}</span>
             </div>
           </div>
        </div>
      </div>

      <!-- Quick Actions (Retained) -->
      <div class="flex flex-col gap-6 animate-slide-up" style="animation-delay: 0.4s">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-1 p-6">
          <h3 class="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Activity class="w-5 h-5 text-medical-600" /> Quick Actions
          </h3>
          <div class="grid grid-cols-1 gap-3">
             <router-link
              to="/reception/patient-entry"
              class="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 transition-colors border border-slate-100"
            >
               <div class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-500"><Users class="w-5 h-5" /></div>
               <div class="font-semibold">Register Patient</div>
            </router-link>
            <router-link
              to="/reception/ward-management"
              class="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-purple-50 hover:text-purple-700 transition-colors border border-slate-100"
            >
               <div class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-purple-500"><Bed class="w-5 h-5" /></div>
               <div class="font-semibold">Ward Management</div>
            </router-link>
          </div>
        </div>

         <!-- Surgeries Summary -->
         <div class="bg-gradient-to-br from-rose-50 to-white rounded-2xl border border-rose-100 p-6 flex-1">
           <h3 class="font-bold text-rose-900 mb-4 flex items-center gap-2"><Activity class="w-5 h-5" /> Operations</h3>
           <div v-if="data.surgeriesToday.length === 0" class="text-sm text-rose-600/60 italic">No surgeries scheduled.</div>
           <div v-else class="space-y-3">
              <div v-for="surgery in data.surgeriesToday" :key="surgery.id" class="text-sm bg-white p-3 rounded-lg border border-rose-100 shadow-sm">
                <p class="font-bold text-slate-800">{{ surgery.surgeryType }}</p>
                <div class="flex justify-between mt-1 text-xs text-slate-500">
                  <span>{{ surgery.patient.fullName }}</span>
                  <span class="text-rose-600 font-medium whitespace-nowrap">{{ new Date(surgery.scheduledFor).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</span>
                </div>
              </div>
           </div>
         </div>
      </div>

    </div>
  </div>
</template>
