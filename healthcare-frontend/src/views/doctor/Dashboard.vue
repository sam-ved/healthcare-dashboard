<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ClipboardList, Activity } from 'lucide-vue-next'


</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-slate-900 mb-2">Doctor Dashboard</h1>
      <p class="text-slate-600">Welcome back, Doctor</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <RouterLink
        to="/doctor/queue"
        class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all group"
      >
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200">
            <ClipboardList class="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 class="font-semibold text-slate-900">Patient Queue</h3>
            <p class="text-sm text-slate-600">View pending examinations</p>
          </div>
        </div>
      </RouterLink>

      <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Activity class="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 class="font-semibold text-slate-900">Today's Activity</h3>
            <p class="text-sm text-slate-600">View your schedule</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
