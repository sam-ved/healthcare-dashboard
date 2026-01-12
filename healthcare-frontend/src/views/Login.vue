<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { employeeLogin } from '@/api'
import { Stethoscope, Loader2, Activity, Users, Shield, ArrowRight } from 'lucide-vue-next'

const router = useRouter()
const identifier = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!identifier.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const response = await employeeLogin(identifier.value, password.value)
    const role = response.employee.role
    // Add a small delay to let the user see the success state
    setTimeout(() => {
       if (role === 'DOCTOR') router.push('/doctor/dashboard')
       else if (role === 'NURSE' || role === 'WARDBOY') router.push('/reception/dashboard')
       else if (role === 'RECEPTIONIST') router.push('/reception/dashboard') // Added RECEPTIONIST
       else if (role === 'ADMIN') router.push('/admin/analytics')
    }, 500)
  } catch (err: any) {
    error.value = err.message || 'Login failed.'
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex bg-slate-50">
    <div 
      class="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center"
      v-motion
      :initial="{ opacity: 0, x: -100 }"
      :enter="{ opacity: 1, x: 0, transition: { duration: 800, type: 'spring' } }"
    >
      <div class="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-teal-600/30 rounded-full blur-[120px] animate-pulse"></div>
      <div class="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px]" v-motion :enter="{ scale: 1.2, transition: { repeat: Infinity, duration: 5000, repeatType: 'mirror' } }"></div>

      <div class="relative z-10 max-w-xl px-12 text-white">
        <div class="mb-8 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
          </span>
          <span class="text-sm font-medium tracking-wide">System Operational</span>
        </div>
        
        <h1 class="text-5xl font-bold leading-tight mb-6">
          The Future of <br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">Healthcare Ops</span>
        </h1>
        
        <p class="text-lg text-slate-400 mb-10 leading-relaxed">
          Manage patients, track vitals, and streamline ward operations with the Growth Catalysts intelligent hospital dashboard.
        </p>

        <div class="grid grid-cols-2 gap-6">
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <Activity class="w-6 h-6 text-teal-400 mb-2" />
            <h3 class="font-semibold">Real-time Vitals</h3>
          </div>
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <Users class="w-6 h-6 text-indigo-400 mb-2" />
            <h3 class="font-semibold">Patient Queue</h3>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full lg:w-1/2 flex items-center justify-center p-8">
      <div 
        class="w-full max-w-md"
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }"
      >
        <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-xl shadow-teal-500/20 mb-6">
            <Stethoscope class="w-8 h-8" />
          </div>
          <h2 class="text-3xl font-bold text-slate-900">Welcome Back</h2>
          <p class="text-slate-500 mt-2">Enter credentials to access the portal</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div class="space-y-1.5">
            <label class="text-sm font-semibold text-slate-700 ml-1">Employee ID / Email / Mobile</label>
            <input 
              v-model="identifier"
              type="text" 
              placeholder="DOC-001, email@hospital.com, or mobile"
              class="w-full px-5 py-4 rounded-xl bg-white border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-semibold text-slate-700 ml-1">Password</label>
            <input 
              v-model="password"
              type="password" 
              placeholder="••••••••"
              class="w-full px-5 py-4 rounded-xl bg-white border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div v-if="error" class="p-4 rounded-xl bg-rose-50 text-rose-600 text-sm font-medium flex items-center gap-2" v-motion-fade>
             <Shield class="w-4 h-4" /> {{ error }}
          </div>

          <button 
            type="submit"
            :disabled="loading"
            class="w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 disabled:opacity-70"
          >
            <span v-if="!loading">Sign In to Dashboard</span>
            <span v-else class="flex items-center gap-2"><Loader2 class="w-5 h-5 animate-spin" /> Verifying...</span>
            <ArrowRight v-if="!loading" class="w-5 h-5" />
          </button>
        </form>

        <p class="text-center text-sm text-slate-500 mt-6">
          New employee? 
          <router-link to="/register" class="text-teal-600 font-bold hover:text-teal-700">Register here</router-link>
        </p>

        <div class="mt-8 text-center">
          <p class="text-xs text-slate-400 font-medium uppercase tracking-wider">Demo Credentials</p>
          <div class="flex flex-wrap justify-center gap-4 mt-3">
             <span class="px-3 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-mono">DOC-CARDIO-01</span>
             <span class="px-3 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-mono">REC-001</span>
             <span class="px-3 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-mono">password123</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
