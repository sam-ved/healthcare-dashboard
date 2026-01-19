<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { UserPlus, Search, Stethoscope, ClipboardPlus, History, Activity, CheckCircle2, Loader2 } from 'lucide-vue-next';
import { createPatient, createVisit, searchPatientByPidOrPhone, getReceptionDashboard } from '@/api';
import type { Employee } from '@/types';
import { toast } from 'vue-sonner';

const activeTab = ref<'new' | 'returning'>('new');
const loading = ref(false);
const showSuccessAnimation = ref(false);
const registeredPatientInfo = ref<{ pid: string; name: string } | null>(null);
const availableDoctors = ref<Employee[]>([]);

// -- NEW PATIENT STATE --
const newForm = ref({
  fullName: '',
  dob: '',
  gender: '',
  phone: '',
  address: '',
  bloodGroup: '',
  issue: '',
  since: '',
  doctorId: '',
  weight: '',
  height: '',
  allergies: ''
});

const calculatedAge = ref<string>('');

// -- RETURNING PATIENT STATE --
const searchQuery = ref('');
const foundPatient = ref<any>(null);
const returnForm = ref({ reason: '', notes: '', doctorId: '' });

onMounted(async () => {
  try {
    const data = await getReceptionDashboard();
    availableDoctors.value = data.availableDoctors;
  } catch (err) {
    console.error('Failed to load doctors', err);
  }
});

// Watch DOB to calculate Age
watch(() => newForm.value.dob, (newDob) => {
  if (!newDob) {
    calculatedAge.value = '';
    return;
  }
  const birthDate = new Date(newDob);
  const now = new Date();
  
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  
  calculatedAge.value = `${years} Y, ${months} M, ${days} D`;
});

// Actions
const handleRegister = async () => {
  // Frontend Validation
  if (newForm.value.phone.length !== 10 || isNaN(Number(newForm.value.phone))) {
    toast.error('Phone number must be strictly 10 digits');
    return;
  }
  if (!newForm.value.gender) {
    toast.error('Please select a gender');
    return;
  }
  
  if (!newForm.value.doctorId) {
    toast.error('Please assign a doctor');
    return;
  }

  loading.value = true;
  try {
    const patientData: any = {
      name: newForm.value.fullName,
      fullName: newForm.value.fullName,
      age: 0,
      dob: new Date(newForm.value.dob).toISOString(),
      gender: newForm.value.gender,
      phone: newForm.value.phone,
      address: newForm.value.address,
      bloodGroup: newForm.value.bloodGroup,
      issue: newForm.value.issue,
      since: newForm.value.since,
      weight: Number(newForm.value.weight),
      height: Number(newForm.value.height),
      allergies: newForm.value.allergies
    };
    
    const patient = await createPatient(patientData);
    
    // NO AUTO-ADMISSION TO WARD - Just register the patient
    // Patient is now marked as REGISTERED (not ADMITTED)
    
    // Show success animation
    registeredPatientInfo.value = {
      pid: patient.pid,
      name: patient.fullName || patient.name
    };
    showSuccessAnimation.value = true;
    
    // Auto-hide success and reset after delay
    setTimeout(() => {
      showSuccessAnimation.value = false;
      registeredPatientInfo.value = null;
      
      // Reset form
      newForm.value = { 
        fullName: '', dob: '', gender: '', phone: '', address: '', 
        bloodGroup: '', issue: '', since: '', doctorId: '', weight: '', height: '', allergies: '' 
      };
      calculatedAge.value = '';
    }, 3500);
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Registration failed');
  } finally {
    loading.value = false;
  }
};

const handleSearch = async () => {
  if (!searchQuery.value) return;
  loading.value = true;
  foundPatient.value = null;
  
  try {
    const data = await searchPatientByPidOrPhone(searchQuery.value);
    foundPatient.value = data;
  } catch (err) {
    toast.error('Patient not found. Check PID or Phone.');
  } finally {
    loading.value = false;
  }
};

const handleReturnVisit = async () => {
  if (!returnForm.value.reason || !returnForm.value.doctorId) {
    toast.error('Please fill reason and assign a doctor');
    return;
  }
  loading.value = true;
  try {
    await createVisit({
      patientId: foundPatient.value.id,
      doctorId: Number(returnForm.value.doctorId),
      visitReason: returnForm.value.reason,
      notes: returnForm.value.notes
    });
    toast.success('New visit added to patient record');
    returnForm.value = { reason: '', notes: '', doctorId: '' };
    handleSearch(); // Refresh history
  } catch (err) {
    toast.error('Failed to add visit');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Patient Intake</h1>
        <p class="text-slate-500">Register new patients or create returning visits</p>
      </div>
    </div>

    <div class="bg-white p-1 rounded-xl border border-slate-200 inline-flex shadow-sm">
      <button 
        @click="activeTab = 'new'"
        :class="['px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2', 
          activeTab === 'new' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50']"
      >
        <UserPlus class="w-4 h-4" /> New Registration
      </button>
      <button 
        @click="activeTab = 'returning'"
        :class="['px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2', 
          activeTab === 'returning' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50']"
      >
        <Search class="w-4 h-4" /> Look Up / Returning
      </button>
    </div>

    <!-- NEW REGISTRATION FORM -->
    <div v-show="activeTab === 'new'" class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in relative">
      <div class="p-8 border-b border-slate-100 bg-slate-50/50">
        <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
          <UserPlus class="w-5 h-5 text-indigo-600" /> New Patient Form
        </h3>
      </div>
      
      <form @submit.prevent="handleRegister" class="p-8 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        <!-- PERSONAL DETAILS -->
        <div class="md:col-span-12">
           <h4 class="font-bold text-indigo-900 text-sm uppercase tracking-wide border-b pb-2 mb-4">Personal Details</h4>
        </div>

        <div class="md:col-span-4">
           <label class="label-std">Name of the Patient <span class="req">*</span></label>
           <input v-model="newForm.fullName" required class="input-std uppercase" placeholder="NAME OF THE PATIENT" />
        </div>

        <div class="md:col-span-3">
          <label class="label-std">Date of Birth <span class="req">*</span></label>
          <input v-model="newForm.dob" type="date" required class="input-std" />
          <p v-if="calculatedAge" class="text-xs font-bold text-indigo-600 mt-1 bg-indigo-50 px-2 py-1 rounded inline-block">
             Age: {{ calculatedAge }}
          </p>
        </div>

        <div class="md:col-span-2">
          <label class="label-std">Gender <span class="req">*</span></label>
          <select v-model="newForm.gender" required class="input-std">
            <option value="" disabled selected>Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Trans</option>
            <option>Preferred not to say</option>
          </select>
        </div>

        <div class="md:col-span-3">
           <label class="label-std">Phone Number <span class="req">*</span></label>
           <input v-model="newForm.phone" required class="input-std" placeholder="10-digit mobile" maxlength="10" pattern="\d{10}" title="10 digit mobile number" />
        </div>

        <div class="md:col-span-8">
           <label class="label-std">Address <span class="req">*</span></label>
           <input v-model="newForm.address" required class="input-std" placeholder="Complete residential address" />
        </div>
        
        <div class="md:col-span-4">
           <label class="label-std">Blood Group <span class="req">*</span></label>
           <input v-model="newForm.bloodGroup" required class="input-std uppercase" placeholder="e.g. O+" />
        </div>

        <!-- CLINICAL INFO -->
        <div class="md:col-span-12 mt-4">
           <h4 class="font-bold text-indigo-900 text-sm uppercase tracking-wide border-b pb-2 mb-4">Clinical Info</h4>
        </div>

        <div class="md:col-span-6">
           <label class="label-std">Chief Complaint (Health Issue) <span class="req">*</span></label>
           <div class="relative">
             <input v-model="newForm.issue" required class="input-std pl-10" placeholder="Main symptom or reason for visit" />
             <Activity class="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
           </div>
        </div>

         <div class="md:col-span-3">
             <label class="label-std">Symptoms Since <span class="req">*</span></label>
             <input v-model="newForm.since" required class="input-std" placeholder="e.g. 2 days" />
        </div>

        <div class="md:col-span-3">
             <label class="label-std">Allergies</label>
             <input v-model="newForm.allergies" class="input-std" placeholder="Optional" />
        </div>

        <div class="md:col-span-2">
             <label class="label-std">Weight (kg) <span class="req">*</span></label>
             <input v-model="newForm.weight" type="number" required class="input-std" placeholder="kg" />
        </div>

        <div class="md:col-span-2">
             <label class="label-std">Height (cm) <span class="req">*</span></label>
             <input v-model="newForm.height" type="number" required class="input-std" placeholder="cm" />
        </div>

        <!-- ASSIGNMENT -->
        <div class="md:col-span-8">
           <label class="label-std">Assign Doctor <span class="req">*</span></label>
            <div class="relative">
              <select v-model="newForm.doctorId" required class="input-std pl-10 appearance-none bg-white">
                <option value="" disabled selected>Select Physician</option>
                <option v-for="doc in availableDoctors" :key="doc.id" :value="doc.id">
                  Dr. {{ doc.fullName }} ({{ doc.department || 'General' }})
                </option>
              </select>
              <Stethoscope class="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            </div>
            <p v-if="availableDoctors.length === 0" class="text-xs text-rose-500 mt-1">No doctors currently marked available.</p>
        </div>

        <div class="md:col-span-12 mt-6 pt-6 border-t border-slate-100 flex justify-end">
             <button 
               type="submit"
               :disabled="loading" 
               class="btn-primary w-full md:w-auto min-w-[200px] relative overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
             >
               <span v-if="loading" class="flex items-center gap-2 justify-center">
                 <Loader2 class="w-5 h-5 animate-spin" />
                 Registering...
               </span>
               <span v-else class="flex items-center gap-2 justify-center">
                 <UserPlus class="w-5 h-5" />
                 Complete Registration
               </span>
             </button>
        </div>

      </form>
      
      <!-- Success Animation Overlay -->
      <transition
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div 
          v-if="showSuccessAnimation" 
          class="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <div class="text-center space-y-6 p-8 max-w-md">
            <!-- Animated Check Circle -->
            <div class="relative inline-block">
              <div class="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 animate-bounce-once">
                <CheckCircle2 class="w-14 h-14 text-white animate-scale-in" />
              </div>
              <!-- Pulse Rings -->
              <div class="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
            </div>
            
            <!-- Success Message -->
            <div class="space-y-3">
              <h3 class="text-2xl font-bold text-slate-900">Patient Registered Successfully!</h3>
              <div class="bg-gradient-to-r from-blue-50 to-green-50 border border-green-200 rounded-xl p-4">
                <p class="text-sm text-slate-600 mb-1">Patient ID</p>
                <p class="text-xl font-mono font-bold text-green-700">{{ registeredPatientInfo?.pid }}</p>
              </div>
              <p class="text-slate-600">
                {{ registeredPatientInfo?.name }} has been registered.<br/>
                <span class="text-sm text-slate-500">SMS notification sent to patient.</span>
              </p>
            </div>
            
            <!-- Progress indicator -->
            <div class="flex items-center justify-center gap-2 text-sm text-slate-500">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Returning to registration form...
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- RETURNING PATIENT FORM -->
    <div v-show="activeTab === 'returning'" class="bg-white rounded-xl border border-slate-200 shadow-sm min-h-[500px] animate-fade-in">
       
       <!-- Search Bar -->
       <div class="p-8 border-b border-slate-100 max-w-2xl mx-auto text-center space-y-4">
          <h3 class="text-lg font-bold text-slate-900">Find Patient Record</h3>
          <div class="relative">
            <input 
              v-model="searchQuery" 
              @keyup.enter="handleSearch"
              placeholder="Search by PID (e.g. P-1001) or Phone" 
              class="w-full pl-12 pr-24 py-4 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 text-lg transition-all"
            />
            <Search class="w-6 h-6 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <button @click="handleSearch" class="absolute right-2 top-2 bottom-2 px-5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
              Search
            </button>
          </div>
       </div>

       <!-- Patient Found View -->
       <div v-if="foundPatient" class="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-50/50">
          
          <!-- Sidebar: Patient Card -->
          <div class="lg:col-span-4 space-y-6">
            <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div class="flex items-center gap-4 mb-6">
                  <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-indigo-200">
                    {{ foundPatient.name.charAt(0) }}
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-slate-900">{{ foundPatient.fullName || foundPatient.name }}</h2>
                    <p class="font-mono text-sm text-slate-500 tracking-wide">{{ foundPatient.pid }}</p>
                  </div>
                </div>
                <div class="space-y-3 text-sm border-t border-slate-100 pt-4">
                   <div class="flex justify-between border-b border-slate-50 pb-2">
                     <span class="text-slate-500">Age / Gender</span> 
                     <span class="font-medium text-slate-900">{{ foundPatient.age }} / {{ foundPatient.gender }}</span>
                   </div>
                   <div class="flex justify-between border-b border-slate-50 pb-2">
                     <span class="text-slate-500">Contact</span> 
                     <span class="font-medium text-slate-900">{{ foundPatient.phone }}</span>
                   </div>
                   <div class="flex justify-between">
                     <span class="text-slate-500">Blood Group</span> 
                     <span class="font-medium text-slate-900">{{ foundPatient.bloodGroup || 'N/A' }}</span>
                   </div>
                </div>
            </div>
          </div>

          <!-- Main: New Visit & History -->
          <div class="lg:col-span-8 space-y-8">
            
            <!-- Create Visit Form -->
            <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <h4 class="font-bold text-slate-900 mb-6 flex items-center gap-2">
                 <ClipboardPlus class="w-5 h-5 text-indigo-600" /> Create New Visit
               </h4>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                 <div>
                   <label class="label-std">Reason for Visit</label>
                   <input v-model="returnForm.reason" placeholder="e.g. Follow-up, Fever" class="input-std" />
                 </div>
                 <div>
                   <label class="label-std">Assign Doctor</label>
                   <div class="relative">
                      <select v-model="returnForm.doctorId" class="input-std pl-10 appearance-none bg-white">
                        <option value="" disabled selected>Select Physician</option>
                        <option v-for="doc in availableDoctors" :key="doc.id" :value="doc.id">
                          Dr. {{ doc.fullName }}
                        </option>
                      </select>
                      <Stethoscope class="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                   </div>
                 </div>
                 <div class="md:col-span-2 flex justify-end">
                   <button @click="handleReturnVisit" :disabled="loading" class="btn-primary w-full md:w-auto">
                     {{ loading ? 'Processing...' : 'Confirm Check-In' }}
                   </button>
                 </div>
               </div>
            </div>

            <!-- History List -->
            <div>
              <h4 class="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <History class="w-5 h-5 text-slate-400" /> Previous Visits
              </h4>
              <div class="space-y-3">
                 <div v-if="!foundPatient.visits || foundPatient.visits.length === 0" class="text-slate-400 italic text-sm">
                   No patient history found.
                 </div>
                 <div v-for="visit in foundPatient.visits" :key="visit.id" class="flex gap-4 p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 transition-colors">
                   <div class="text-center min-w-[50px] pr-4 border-r border-slate-100">
                     <div class="text-xs font-bold text-slate-400 uppercase">{{ new Date(visit.visitDate).toLocaleString('default', { month: 'short' }) }}</div>
                     <div class="text-xl font-bold text-slate-900">{{ new Date(visit.visitDate).getDate() }}</div>
                   </div>
                   <div class="flex-1">
                     <p class="font-bold text-slate-900">{{ visit.visitReason }}</p>
                     <p class="text-sm text-slate-500">Dr. {{ visit.doctor?.fullName || 'Unassigned' }}</p>
                   </div>
                   <div>
                     <span class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">{{ visit.status }}</span>
                   </div>
                 </div>
              </div>
            </div>

          </div>
       </div>
    </div>

  </div>
</template>

<style scoped>
.label-std {
  @apply block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1 tracking-wider;
}
.req {
  @apply text-rose-500;
}
.input-std {
  @apply w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 placeholder:text-slate-400 transition-all shadow-sm;
}
.btn-primary {
  @apply px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all;
}

/* Success Animation */
@keyframes bounce-once {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.05);
  }
}

@keyframes scale-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-bounce-once {
  animation: bounce-once 0.8s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.6s ease-out;
}
</style>
