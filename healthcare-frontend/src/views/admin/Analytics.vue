<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAnalytics } from '@/api'
import { TrendingUp, Activity, Users } from 'lucide-vue-next'
import type { Analytics } from '@/types'

const analytics = ref<Analytics>({
  patientInflow: [],
  diseaseHeatmap: [],
  staffStatus: []
})
const loading = ref(true)

onMounted(async () => {
  try {
    analytics.value = await getAnalytics()
  } catch (err) {
    console.error('Failed to load analytics:', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-slate-900 mb-2">Admin Analytics</h1>
      <p class="text-slate-600">Executive summary and insights</p>
    </div>

    <div v-if="loading" class="text-center py-12 text-slate-600">
      Loading analytics...
    </div>

    <template v-else>
      <!-- Patient Inflow -->
      <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <TrendingUp class="w-5 h-5 text-indigo-600" />
          Patient Inflow (Last 7 Days)
        </h2>
        <div class="space-y-2">
          <div
            v-for="item in analytics.patientInflow"
            :key="item.date"
            class="flex items-center gap-4"
          >
            <span class="text-sm text-slate-600 w-24">{{ item.date }}</span>
            <div class="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
              <div
                class="bg-gradient-to-r from-indigo-500 to-purple-600 h-full flex items-center justify-end px-2"
                :style="{ width: `${(item.count / 10) * 100}%` }"
              >
                <span class="text-xs font-semibold text-white">{{ item.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Disease Heatmap -->
      <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Activity class="w-5 h-5 text-rose-600" />
          Top Diagnosed Diseases
        </h2>
        <div class="space-y-3">
          <div
            v-for="(item, idx) in analytics.diseaseHeatmap"
            :key="item.disease"
            class="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
          >
            <div class="flex items-center gap-3">
              <span class="flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-bold text-sm">
                {{ idx + 1 }}
              </span>
              <span class="font-medium text-slate-900">{{ item.disease }}</span>
            </div>
            <span class="text-lg font-bold text-slate-700">{{ item.count }}</span>
          </div>
        </div>
      </div>

      <!-- Staff Status -->
      <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Users class="w-5 h-5 text-emerald-600" />
          Staff Status
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="staff in analytics.staffStatus"
            :key="staff.name"
            class="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
          >
            <span class="font-medium text-slate-900">{{ staff.name }}</span>
            <span
              :class="[
                'px-3 py-1 rounded-full text-sm font-medium',
                staff.status === 'Available'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              ]"
            >
              {{ staff.status }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
