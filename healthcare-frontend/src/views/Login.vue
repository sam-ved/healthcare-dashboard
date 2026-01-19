<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { employeeLogin } from '@/api'
import { Stethoscope, Mail, Lock, Activity, Users, Shield, ArrowRight, CheckCircle, Sparkles, UserCog } from 'lucide-vue-next'
import FormInput from '@/components/FormInput.vue'
import FormButton from '@/components/FormButton.vue'

const router = useRouter()
const selectedRole = ref<'RECEPTIONIST' | 'DOCTOR' | 'NURSE'>('RECEPTIONIST')
const identifier = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const identifierError = ref('')
const passwordError = ref('')
const roleError = ref('')

const roles = [
  { value: 'RECEPTIONIST', label: 'Receptionist', icon: '📋', color: 'bg-blue-500' },
  { value: 'DOCTOR', label: 'Doctor', icon: '🩺', color: 'bg-teal-500' },
  { value: 'NURSE', label: 'Nurse', icon: '💉', color: 'bg-purple-500' }
]

const validate = () => {
  identifierError.value = ''
  passwordError.value = ''
  roleError.value = ''
  error.value = ''
  
  if (!selectedRole.value) {
    roleError.value = 'Please select your role'
    return false
  }
  
  if (!identifier.value.trim()) {
    identifierError.value = 'Employee ID/Email is required'
    return false
  }
  
  if (!password.value) {
    passwordError.value = 'Password is required'
    return false
  }
  
  if (password.value.length < 6) {
    passwordError.value = 'Password must be at least 6 characters'
    return false
  }
  
  return true
}

const handleLogin = async () => {
  if (!validate()) return
  
  loading.value = true
  error.value = ''
  
  try {
    const response = await employeeLogin(identifier.value, password.value)
    const backendRole = response.employee.role
    
    // Validate role matches
    if (backendRole !== selectedRole.value) {
      error.value = `Role mismatch: You selected ${selectedRole.value} but your account is ${backendRole}`
      loading.value = false
      return
    }
    
    // Success! Add a small delay to show success state
    setTimeout(() => {
      if (backendRole === 'DOCTOR') {
        router.push('/doctor/dashboard')
      } else if (backendRole === 'RECEPTIONIST') {
        router.push('/reception/patient-entry')
      } else if (backendRole === 'NURSE' || backendRole === 'WARDBOY') {
        router.push('/reception/dashboard')
      } else if (backendRole === 'ADMIN') {
        router.push('/admin/analytics')
      } else {
        router.push('/dashboard')
      }
    }, 600)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Invalid credentials. Please try again.'
    loading.value = false
  }
}

const goToSignup = () => {
  router.push('/register')
}
</script>

<template>
  <div class="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
    <!-- Left Side - Medical Hero Section -->
    <div 
      class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden items-center justify-center"
    >
      <!-- Animated Background Blobs -->
      <div class="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-teal-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div class="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[100px] opacity-50"></div>
      
      <!-- Medical Image/Illustration Placeholder -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] bg-repeat"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 max-w-xl px-12 text-white space-y-8">
        <!-- Status Badge -->
        <div class="inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-teal-400"></span>
          </span>
          <span class="text-sm font-semibold tracking-wide">System Online</span>
        </div>
        
        <!-- Hero Text -->
        <div class="space-y-4">
          <h1 class="text-5xl font-bold leading-tight">
            Transform Healthcare
            <span class="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 mt-2">
              Management Today
            </span>
          </h1>
          
          <p class="text-lg text-slate-300 leading-relaxed max-w-lg">
            Streamline patient care, optimize workflows, and deliver exceptional healthcare experiences with our intelligent platform.
          </p>
        </div>

        <!-- Feature Cards -->
        <div class="grid grid-cols-2 gap-4 pt-4">
          <div class="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300 cursor-pointer group">
            <Activity class="w-7 h-7 text-teal-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 class="font-semibold text-white mb-1">Real-time Monitoring</h3>
            <p class="text-xs text-slate-400">Track patient vitals live</p>
          </div>
          <div class="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300 cursor-pointer group">
            <Users class="w-7 h-7 text-indigo-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 class="font-semibold text-white mb-1">Smart Scheduling</h3>
            <p class="text-xs text-slate-400">Efficient queue management</p>
          </div>
          <div class="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300 cursor-pointer group">
            <Shield class="w-7 h-7 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 class="font-semibold text-white mb-1">Secure Access</h3>
            <p class="text-xs text-slate-400">Role-based controls</p>
          </div>
          <div class="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300 cursor-pointer group">
            <Sparkles class="w-7 h-7 text-yellow-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 class="font-semibold text-white mb-1">AI Insights</h3>
            <p class="text-xs text-slate-400">Data-driven decisions</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
      <!-- Decorative Elements -->
      <div class="absolute top-10 right-10 w-20 h-20 bg-teal-100 rounded-full blur-3xl opacity-50"></div>
      <div class="absolute bottom-10 left-10 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
      
      <div class="w-full max-w-md relative z-10">
        <!-- Logo & Title -->
        <div class="text-center mb-10 space-y-4">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 text-white shadow-2xl shadow-teal-500/30 mb-4 hover:shadow-teal-500/50 transition-all duration-300 hover:scale-105">
            <Stethoscope class="w-10 h-10" />
          </div>
          <div>
            <h2 class="text-4xl font-bold text-slate-900 mb-2">Welcome Back</h2>
            <p class="text-slate-600">Sign in to access your dashboard</p>
          </div>
        </div>

        <!-- Login Form -->
        <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 p-8 border border-white/20">
          <form @submit.prevent="handleLogin" class="space-y-5">
            <!-- Role Selection -->
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-2">
                <UserCog class="w-4 h-4" />
                I am logging in as
              </label>
              <div class="grid grid-cols-3 gap-3">
                <button
                  v-for="role in roles"
                  :key="role.value"
                  type="button"
                  @click="selectedRole = role.value as any"
                  class="relative p-4 rounded-xl border-2 transition-all duration-300 group hover:scale-105"
                  :class="[
                    selectedRole === role.value
                      ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-teal-100 shadow-lg shadow-teal-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-md'
                  ]"
                >
                  <div class="flex flex-col items-center gap-2">
                    <div 
                      class="w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all"
                      :class="[
                        selectedRole === role.value 
                          ? `${role.color} shadow-lg` 
                          : 'bg-slate-100'
                      ]"
                    >
                      {{ role.icon }}
                    </div>
                    <span 
                      class="font-semibold text-xs transition-colors"
                      :class="selectedRole === role.value ? 'text-teal-700' : 'text-slate-600'"
                    >
                      {{ role.label }}
                    </span>
                  </div>
                  <!-- Check Mark -->
                  <div 
                    v-if="selectedRole === role.value"
                    class="absolute -top-2 -right-2 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <CheckCircle class="w-4 h-4 text-white" />
                  </div>
                </button>
              </div>
              <transition
                enter-active-class="transition-all duration-300"
                enter-from-class="opacity-0 -translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
              >
                <p v-if="roleError" class="text-red-600 text-sm mt-1.5 ml-1 flex items-center gap-1">
                  <span class="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                  {{ roleError }}
                </p>
              </transition>
            </div>

            <!-- Employee ID Input -->
            <FormInput
              v-model="identifier"
              label="Employee ID / Email / Mobile"
              type="text"
              :icon="Mail"
              placeholder="DOC-001 or email@hospital.com"
              :error="identifierError"
              autocomplete="username"
            />

            <!-- Password Input -->
            <FormInput
              v-model="password"
              label="Password"
              type="password"
              :icon="Lock"
              placeholder="Enter your password"
              :error="passwordError"
              autocomplete="current-password"
            />

            <!-- Error Alert -->
            <transition
              enter-active-class="transition-all duration-300"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition-all duration-200"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div v-if="error" class="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-3">
                <div class="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
                {{ error }}
              </div>
            </transition>

            <!-- Login Button -->
            <FormButton
              type="submit"
              :loading="loading"
              variant="primary"
              size="lg"
              class="w-full"
            >
              <span v-if="!loading" class="flex items-center gap-2">
                Sign In
                <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </FormButton>
          </form>

          <!-- Divider -->
          <div class="relative my-8">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-slate-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white text-slate-500 font-medium">New to the platform?</span>
            </div>
          </div>

          <!-- Sign Up Link -->
          <button
            @click="goToSignup"
            type="button"
            class="w-full py-3.5 px-6 rounded-xl border-2 border-slate-200 hover:border-teal-500 text-slate-700 hover:text-teal-700 font-semibold transition-all duration-300 hover:bg-teal-50 flex items-center justify-center gap-2 group"
          >
            Create New Account
            <CheckCircle class="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <!-- Footer Note -->
        <p class="text-center text-sm text-slate-500 mt-6">
          Secure login powered by <span class="font-semibold text-teal-600">Growth Catalyst</span>
        </p>
      </div>
    </div>
  </div>
</template>
