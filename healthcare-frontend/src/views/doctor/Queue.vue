<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  ClipboardList, 
  Clock, 
  ArrowRight,
  AlertCircle 
} from 'lucide-vue-next';
import { getDoctorQueue } from '@/api';
import { getEmployee } from '@/utils/auth';
import StatusBadge from '@/components/StatusBadge.vue'; // Ensure you have this component

const router = useRouter();
const visits = ref<any[]>([]);
const loading = ref(true);
const employee = getEmployee();

onMounted(async () => {
  if (employee?.id) {
    try {
      visits.value = await getDoctorQueue(employee.id);
    } catch (err) {
      console.error('Failed to fetch queue', err);
    } finally {
      loading.value = false;
    }
  }
});

const handleExamine = (patientId: number) => {
  router.push(`/doctor/patient/${patientId}`);
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Patient Queue</h1>
        <p class="text-slate-500">Upcoming appointments and checkups</p>
      </div>
      <div class="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600">
        {{ new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) }}
      </div>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div v-if="loading" class="p-12 text-center text-slate-500">
        Loading your schedule...
      </div>

      <div v-else-if="visits.length === 0" class="p-12 text-center">
        <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ClipboardList class="w-8 h-8 text-slate-400" />
        </div>
        <h3 class="text-lg font-bold text-slate-900">All Caught Up!</h3>
        <p class="text-slate-500">You have no pending patients in your queue.</p>
      </div>

      <div v-else class="divide-y divide-slate-100">
        <div 
          v-for="visit in visits" 
          :key="visit.id"
          class="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4 group cursor-pointer"
          @click="handleExamine(visit.patient.id)"
        >
          <div class="w-16 text-center">
            <div class="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full inline-block">
               #{{ visit.id }}
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="text-base font-bold text-slate-900 truncate">{{ visit.patient.fullName }}</h3>
              <span class="text-xs text-slate-400 font-mono">{{ visit.patient.pid }}</span>
            </div>
            <div class="flex items-center gap-4 text-sm text-slate-500">
              <span class="flex items-center gap-1">
                <AlertCircle class="w-4 h-4 text-rose-500" v-if="visit.visitReason.includes('Emergency')" />
                {{ visit.visitReason }}
              </span>
              <span>•</span>
              <span>{{ visit.patient.age }} Yrs / {{ visit.patient.gender }}</span>
            </div>
          </div>

          <div class="px-4">
            <StatusBadge :status="visit.status" />
          </div>

          <div class="pr-4">
            <button 
              class="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 flex items-center gap-2"
            >
              Examine <ArrowRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>