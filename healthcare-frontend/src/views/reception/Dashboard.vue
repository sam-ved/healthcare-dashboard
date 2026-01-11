<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getTriageStats } from '@/api'
import { Users, UserCog, Bed, Activity, TrendingUp } from 'lucide-vue-next'
import StatCard from '@/components/StatCard.vue'
import type { TriageStats } from '@/types'

const stats = ref<TriageStats>({
  activePatients: 0,
  doctorsAvailable: 0,
  icuOccupancy: 0
})
const loading = ref(true)

onMounted(async () => {
  try {
    stats.value = await getTriageStats()
  } catch (err) {
    console.error('Failed to load stats:', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div
      class="animate-fade-in"
    >
      <h1 class="text-4xl font-bold text-slate-900 mb-2">Triage Dashboard</h1>
      <p class="text-lg text-slate-600">Real-time overview of hospital operations</p>
    </div>

    <!-- Loading Shimmer -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="h-40 bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 bg-slate-200 rounded-lg"></div>
          <div class="flex-1 space-y-3">
            <div class="h-4 bg-slate-200 rounded w-24"></div>
            <div class="h-8 bg-slate-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Active Patients"
        :value="stats.activePatients"
        :icon="Users"
        color="blue"
        trend="+12%"
        :trend-up="true"
        :delay="0"
      />

      <StatCard
        title="Doctors Available"
        :value="stats.doctorsAvailable"
        :icon="UserCog"
        color="medical"
        trend="+3"
        :trend-up="true"
        :delay="1"
      />

      <StatCard
        title="ICU Occupancy"
        :value="`${stats.icuOccupancy}%`"
        :icon="Bed"
        color="rose"
        trend="-5%"
        :trend-up="false"
        :delay="2"
      />
    </div>

    <!-- Quick Actions -->
    <div 
      class="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-8 shadow-lg animate-slide-up"
      style="animation-delay: 0.3s"
    >
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-medical-500 to-medical-700 flex items-center justify-center">
          <Activity class="w-5 h-5 text-white" />
        </div>
        <h2 class="text-2xl font-bold text-slate-900">Quick Actions</h2>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <router-link
          to="/reception/patient-entry"
          class="group relative flex items-center gap-4 p-6 rounded-xl border-2 border-slate-200 hover:border-medical-400 bg-white hover:shadow-lg transition-all duration-300"
        >
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
            <Users class="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 class="font-bold text-slate-900 mb-1">Patient Entry</h3>
            <p class="text-sm text-slate-600">Register new or returning patient</p>
          </div>
          <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-medical-500/0 via-medical-500/5 to-medical-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </router-link>

        <router-link
          to="/reception/ward-management"
          class="group relative flex items-center gap-4 p-6 rounded-xl border-2 border-slate-200 hover:border-medical-400 bg-white hover:shadow-lg transition-all duration-300"
        >
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
            <Bed class="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 class="font-bold text-slate-900 mb-1">Ward Management</h3>
            <p class="text-sm text-slate-600">Manage bed assignments</p>
          </div>
          <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-medical-500/0 via-medical-500/5 to-medical-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </router-link>
      </div>
    </div>
  </div>
</template>
