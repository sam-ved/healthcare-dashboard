<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getVisitById, updateVisit } from '@/api'
import type { Visit } from '@/types'
import { ArrowLeft, Activity, FileText, CheckCircle, AlertTriangle } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const visit = ref<Visit | null>(null)
const history = ref<Visit[]>([])

// Form State
const diagnosis = ref('')
const prescription = ref('')
const notes = ref('')
const action = ref<'DISCHARGE' | 'ADMIT' | 'OBSERVE'>('DISCHARGE')
const assignedWard = ref('GENERAL')

onMounted(async () => {
  try {
    const visitId = Number(route.params.visitId)
    if (isNaN(visitId)) throw new Error('Invalid visit ID')

    const data = await getVisitById(visitId)
    visit.value = data
    // @ts-ignore - nested history was included in backend response
    if (data.patient?.visits) {
       // @ts-ignore
       history.value = data.patient.visits.filter(v => v.id !== visitId)
    }

    // Pre-fill if editing
    diagnosis.value = data.diagnosis || ''
    prescription.value = data.prescription || ''
    notes.value = data.notes || ''
  } catch (err) {
    console.error('Failed to load consultation:', err)
    toast.error('Failed to load visit details')
  } finally {
    loading.value = false
  }
})

const handleSubmit = async () => {
  if (!visit.value) return 
  
  if (!diagnosis.value || !prescription.value) {
    toast.error('Diagnosis and Prescription are required')
    return
  }

  loading.value = true
  try {
    let status = 'CHECKUP_PENDING'
    if (action.value === 'DISCHARGE') status = 'DISCHARGED'
    if (action.value === 'ADMIT') status = 'ADMITTED'
    if (action.value === 'OBSERVE') status = 'UNDER_OBSERVATION'

    await updateVisit(visit.value.id, {
      diagnosis: diagnosis.value,
      prescription: prescription.value,
      notes: notes.value,
      status,
      assignedWard: action.value === 'ADMIT' ? assignedWard.value : undefined
    })

    toast.success('Consultation completed successfully')
    router.push('/doctor/dashboard')
  } catch (err) {
    console.error('Failed to submit consultation:', err)
    toast.error('Failed to update visit')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center p-20">
    <div class="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
  </div>

  <div v-else-if="visit" class="max-w-7xl mx-auto space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button @click="router.back()" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft class="w-6 h-6 text-slate-600" />
        </button>
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Patient Consultation</h1>
          <p class="text-slate-500 flex items-center gap-2">
            Visit ID: #{{ visit.id }} • {{ new Date(visit.visitDate).toLocaleString() }}
          </p>
        </div>
      </div>
      <div class="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg font-bold text-sm">
        {{ visit.status.replace('_', ' ') }}
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Left: Patient Details & History -->
      <div class="space-y-6">
        <!-- Patient Card -->
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div class="flex items-center gap-4 mb-6">
              <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                {{ visit.patient?.fullName?.charAt(0) }}
              </div>
              <div>
                <h2 class="text-xl font-bold text-slate-900">{{ visit.patient?.fullName }}</h2>
                <p class="font-mono text-sm text-slate-500">{{ visit.patient?.pid }}</p>
              </div>
           </div>
           <div class="space-y-3 text-sm text-slate-600">
              <div class="flex justify-between py-2 border-b border-slate-50">
                <span>Age / Sex</span>
                <span class="font-medium text-slate-900">{{ visit.patient?.age }} / {{ visit.patient?.gender }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-slate-50">
                <span>Contact</span>
                <span class="font-medium text-slate-900">{{ visit.patient?.phone }}</span>
              </div>
              <div class="flex justify-between py-2">
                <span>Complaint</span>
                <span class="font-medium text-rose-600">{{ visit.visitReason }}</span>
              </div>
           </div>
        </div>

        <!-- History -->
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 class="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Activity class="w-5 h-5 text-slate-400" /> Recent History
          </h3>
          <div v-if="history.length === 0" class="text-slate-400 italic text-sm">No previous visits.</div>
          <div v-else class="space-y-4">
             <div v-for="h in history" :key="h.id" class="text-sm border-l-2 border-slate-200 pl-4 py-1 hover:border-indigo-400 transition-colors">
               <div class="flex justify-between">
                 <span class="font-bold text-slate-700">{{ new Date(h.visitDate).toLocaleDateString() }}</span>
                 <span class="text-xs text-slate-500">{{ h.status }}</span>
               </div>
               <p class="text-slate-600 mt-1">{{ h.diagnosis || h.visitReason }}</p>
             </div>
          </div>
        </div>
      </div>

      <!-- Right: Consultation Form -->
      <div class="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-8">
         <h2 class="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
           <FileText class="w-5 h-5 text-indigo-600" /> Clinical Notes
         </h2>

         <div class="space-y-6">
           <div>
             <label class="block text-sm font-bold text-slate-700 mb-2">Diagnosis <span class="text-rose-500">*</span></label>
             <textarea v-model="diagnosis" rows="2" class="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Enter clinical diagnosis..."></textarea>
           </div>

           <div>
             <label class="block text-sm font-bold text-slate-700 mb-2">Prescription / Treatment Plan <span class="text-rose-500">*</span></label>
             <textarea v-model="prescription" rows="4" class="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-sm" placeholder="- Rx Name (Dosage)&#10;- Rx Name (Dosage)"></textarea>
           </div>
           
           <div>
             <label class="block text-sm font-bold text-slate-700 mb-2">Internal Notes (Optional)</label>
             <input v-model="notes" class="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Private notes..." />
           </div>

           <div class="pt-8 border-t border-slate-100">
             <h3 class="font-bold text-slate-900 mb-4">Disposition</h3>
             <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
               <button 
                 @click="action = 'DISCHARGE'"
                 :class="['p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden', action === 'DISCHARGE' ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 hover:border-slate-300']"
               >
                 <div class="font-bold mb-1">Discharge</div>
                 <div class="text-xs opacity-70">Patient goes home</div>
                 <CheckCircle v-if="action === 'DISCHARGE'" class="absolute top-4 right-4 w-5 h-5 text-emerald-600" />
               </button>

               <button 
                 @click="action = 'OBSERVE'"
                 :class="['p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden', action === 'OBSERVE' ? 'border-amber-500 bg-amber-50 text-amber-800' : 'border-slate-200 hover:border-slate-300']"
               >
                 <div class="font-bold mb-1">Observation</div>
                 <div class="text-xs opacity-70">Keep for few hours</div>
                 <AlertTriangle v-if="action === 'OBSERVE'" class="absolute top-4 right-4 w-5 h-5 text-amber-600" />
               </button>

               <button 
                 @click="action = 'ADMIT'"
                 :class="['p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden', action === 'ADMIT' ? 'border-rose-500 bg-rose-50 text-rose-800' : 'border-slate-200 hover:border-slate-300']"
               >
                 <div class="font-bold mb-1">Admit to Ward</div>
                 <div class="text-xs opacity-70">Requires hospitalization</div>
                 <Activity v-if="action === 'ADMIT'" class="absolute top-4 right-4 w-5 h-5 text-rose-600" />
               </button>
             </div>

             <div v-if="action === 'ADMIT'" class="mt-4 animate-fade-in">
               <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Assign Ward</label>
               <select v-model="assignedWard" class="w-full p-3 rounded-xl border border-slate-200 bg-white">
                 <option value="GENERAL">General Ward</option>
                 <option value="PRIVATE">Private Room</option>
                 <option value="ICU">ICU</option>
               </select>
             </div>
           </div>
           
           <div class="flex justify-end pt-6">
             <button @click="handleSubmit" :disabled="loading" class="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 hover:shadow-lg transition-all disabled:opacity-50">
               {{ loading ? 'Saving...' : 'Complete Consultation' }}
             </button>
           </div>
         </div>
      </div>

    </div>
  </div>
</template>
