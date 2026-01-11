<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { employeeLogin } from '@/api'
import { Stethoscope, Loader2, Activity, Users, Shield } from 'lucide-vue-next'

const router = useRouter()

const employeeId = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!employeeId.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await employeeLogin(employeeId.value, password.value)
    
    // Redirect based on role
    const role = response.employee.role
    if (role === 'DOCTOR') {
      router.push('/doctor/dashboard')
    } else if (role === 'NURSE' || role === 'WARDBOY') {
      router.push('/reception/dashboard')
    } else if (role === 'ADMIN') {
      router.push('/admin/analytics')
    }
  } catch (err: any) {
    error.value = err.message || 'Login failed. Please check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Hero Section -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-medical-600 via-medical-700 to-medical-800 relative overflow-hidden">
      <!-- Animated Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-between p-12 text-white">
        <!-- Logo -->
        <div class="animate-fade-in">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Stethoscope class="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold">Growth Catalysts</h1>
              <p class="text-sm text-medical-100">Healthcare Hub</p>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="space-y-8 animate-slide-up" style="animation-delay: 0.2s">
          <div>
            <h2 class="text-5xl font-bold leading-tight mb-4">
              Healthcare<br/>Management<br/>Made Simple
            </h2>
            <p class="text-xl text-medical-100">
              Streamline patient care, manage workflows, and empower your medical team with our comprehensive platform.
            </p>
          </div>

          <!-- Feature Pills -->
          <div class="flex flex-wrap gap-3">
            <div class="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Activity class="w-4 h-4" />
              <span class="text-sm font-medium">Real-time Updates</span>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Users class="w-4 h-4" />
              <span class="text-sm font-medium">Patient Management</span>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Shield class="w-4 h-4" />
              <span class="text-sm font-medium">Secure & Compliant</span>
            </div>
          </div>
        </div>

        <!-- Testimonial -->
        <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-fade-in" style="animation-delay: 0.4s">
          <p class="text-lg mb-4 italic">
            "This system has transformed how we manage patient care. Our workflow efficiency has increased by 40%."
          </p>
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
              <span class="text-lg font-bold">DS</span>
            </div>
            <div>
              <p class="font-semibold">Dr. Sarah Mitchell</p>
              <p class="text-sm text-medical-100">Head of Cardiology</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <div class="w-full max-w-md animate-scale-in" style="animation-delay: 0.1s">
        <!-- Mobile Logo -->
        <div class="lg:hidden text-center mb-8">
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-medical-500 to-medical-700 shadow-lg mb-3">
            <Stethoscope class="w-7 h-7 text-white" />
          </div>
          <h1 class="text-2xl font-bold text-slate-900">Growth Catalysts</h1>
          <p class="text-sm text-slate-600">Healthcare Hub</p>
        </div>

        <!-- Login Card -->
        <div class="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200 p-8 shadow-2xl">
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
            <p class="text-slate-600">Sign in to access your portal</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Employee ID -->
            <div>
              <label class="block text-sm font-semibold text-slate-900 mb-2">
                Employee ID
              </label>
              <input
                v-model="employeeId"
                type="text"
                placeholder="e.g., DOC-CARDIO-01"
                required
                :disabled="loading"
                class="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-semibold text-slate-900 mb-2">
                Password
              </label>
              <input
                v-model="password"
                type="password"
                placeholder="Enter your password"
                required
                :disabled="loading"
                class="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
            </div>

            <!-- Error Message -->
            <div 
              v-if="error" 
              class="rounded-xl bg-rose-50 border border-rose-200 p-4 animate-scale-in"
            >
              <p class="text-sm text-rose-800 font-medium">{{ error }}</p>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-gradient-to-r from-medical-600 to-medical-700 hover:from-medical-700 hover:to-medical-800 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span v-if="!loading" class="flex items-center justify-center gap-2">
                Sign In
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                <Loader2 class="w-5 h-5 animate-spin" />
                Signing in...
              </span>
            </button>
          </form>

          <!-- Demo Credentials -->
          <div class="mt-8 pt-6 border-t border-slate-200">
            <p class="text-xs font-semibold text-slate-700 mb-3">Demo Credentials:</p>
            <div class="space-y-2 text-xs">
              <div class="flex justify-between px-3 py-2 bg-slate-50 rounded-lg">
                <span class="text-slate-600">Doctor:</span>
                <span class="font-mono text-slate-900">DOC-CARDIO-01</span>
              </div>
              <div class="flex justify-between px-3 py-2 bg-slate-50 rounded-lg">
                <span class="text-slate-600">Nurse:</span>
                <span class="font-mono text-slate-900">NURSE-01</span>
              </div>
              <div class="flex justify-between px-3 py-2 bg-slate-50 rounded-lg">
                <span class="text-slate-600">Admin:</span>
                <span class="font-mono text-slate-900">ADMIN-001</span>
              </div>
              <p class="text-center text-slate-500 mt-2">Password: <span class="font-mono font-semibold">password123</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
