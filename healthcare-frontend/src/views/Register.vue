<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { registerEmployee } from '@/api'
import type { RegisterEmployeeData } from '@/types'
import { UserPlus, User, Mail, Phone, Lock, Building, ShieldCheck, CheckCircle2, ArrowRight, Briefcase, LockKeyhole } from 'lucide-vue-next'
import FormInput from '@/components/FormInput.vue'
import FormButton from '@/components/FormButton.vue'

const router = useRouter()
const loading = ref(false)
const step = ref(1) // 1: form, 2: success

const formData = ref<RegisterEmployeeData>({
  fullName: '',
  email: '',
  mobile: '',
  password: '',
  role: 'DOCTOR',
  department: ''
})

const confirmPassword = ref('')
const generatedId = ref<string | null>(null)

// Form Validation Errors
const errors = ref({
  fullName: '',
  email: '',
  mobile: '',
  password: '',
  confirmPassword: '',
  department: ''
})

const validateForm = (): boolean => {
  // Reset errors
  errors.value = {
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    department: ''
  }

  let isValid = true

  // Full Name
  if (!formData.value.fullName.trim()) {
    errors.value.fullName = 'Full name is required'
    isValid = false
  } else if (formData.value.fullName.trim().length < 3) {
    errors.value.fullName = 'Name must be at least 3 characters'
    isValid = false
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.value.email.trim()) {
    errors.value.email = 'Email is required'
    isValid = false
  } else if (!emailRegex.test(formData.value.email)) {
    errors.value.email = 'Please enter a valid email'
    isValid = false
  }

  // Mobile
  const mobileRegex = /^[0-9]{10}$/
  if (!formData.value.mobile.trim()) {
    errors.value.mobile = 'Mobile number is required'
    isValid = false
  } else if (!mobileRegex.test(formData.value.mobile.replace(/\D/g, ''))) {
    errors.value.mobile = 'Please enter a valid 10-digit mobile number'
    isValid = false
  }

  // Password
  if (!formData.value.password) {
    errors.value.password = 'Password is required'
    isValid = false
  } else if (formData.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
    isValid = false
  }

  // Confirm Password
  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (confirmPassword.value !== formData.value.password) {
    errors.value.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  // Department (optional but validate if provided)
  if (formData.value.department && formData.value.department.trim().length < 2) {
    errors.value.department = 'Department name must be at least 2 characters'
    isValid = false
  }

  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    const response = await registerEmployee(formData.value)
    generatedId.value = response.employee.employeeId
    step.value = 2
  } catch (error: any) {
    console.error(error)
    const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.'
    // Show error in the first applicable field
    errors.value.email = errorMessage
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}

const roles = [
  { value: 'DOCTOR', label: 'Doctor', icon: '🩺' },
  { value: 'NURSE', label: 'Nurse', icon: '💉' },
  { value: 'WARDBOY', label: 'Ward Boy', icon: '🏥' },
  { value: 'RECEPTIONIST', label: 'Receptionist', icon: '📋' },
  { value: 'ADMIN', label: 'Administrator', icon: '👨‍💼' }
]
</script>

<template>
  <div class="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
    <!-- Left Side - Hero Section -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 relative overflow-hidden items-center justify-center">
      <!-- Animated Background -->
      <div class="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div class="absolute bottom-[-15%] left-[-15%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[100px]"></div>
      
      <!-- Pattern Overlay -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] bg-repeat"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 max-w-xl px-12 text-white space-y-8">
        <div class="space-y-4">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <ShieldCheck class="w-4 h-4 text-blue-300" />
            <span class="text-sm font-semibold">Secure Registration</span>
          </div>
          
          <h1 class="text-5xl font-bold leading-tight">
            Join Our Healthcare
            <span class="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 mt-2">
              Excellence Team
            </span>
          </h1>
          
          <p class="text-lg text-slate-300 leading-relaxed">
            Be part of a modern healthcare platform that empowers staff to deliver exceptional patient care.
          </p>
        </div>

        <!-- Benefits -->
        <div class="space-y-4 pt-4">
          <div class="flex items-start gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
            <div class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 class="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 class="font-semibold mb-1">Instant Access</h3>
              <p class="text-sm text-slate-400">Get your employee ID immediately after registration</p>
            </div>
          </div>
          
          <div class="flex items-start gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
            <div class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <LockKeyhole class="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h3 class="font-semibold mb-1">Role-Based Access</h3>
              <p class="text-sm text-slate-400">Custom dashboard based on your responsibilities</p>
            </div>
          </div>
          
          <div class="flex items-start gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
            <div class="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0">
              <Briefcase class="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h3 class="font-semibold mb-1">Professional Tools</h3>
              <p class="text-sm text-slate-400">Access all tools needed for your role</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side - Registration Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
      <!-- Decorative Elements -->
      <div class="absolute top-10 right-10 w-24 h-24 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
      <div class="absolute bottom-10 left-10 w-32 h-32 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
      
      <div class="w-full max-w-md relative z-10">
        <!-- Success View -->
        <transition
          enter-active-class="transition-all duration-500"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
        >
          <div v-if="step === 2" class="text-center space-y-6">
            <div class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full shadow-2xl shadow-green-500/30 mb-4 animate-bounce-slow">
              <CheckCircle2 class="w-12 h-12 text-white" />
            </div>
            
            <div class="space-y-3">
              <h2 class="text-3xl font-bold text-slate-900">Registration Complete!</h2>
              <p class="text-slate-600">Your account has been created successfully</p>
            </div>
            
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 space-y-3">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                <ShieldCheck class="w-4 h-4" />
                Your Employee ID
              </div>
              <p class="text-3xl font-mono font-bold text-blue-900 tracking-wider">{{ generatedId }}</p>
              <p class="text-sm text-blue-600">Save this ID - you'll need it to sign in</p>
            </div>

            <FormButton
              @click="goToLogin"
              variant="primary"
              size="lg"
              class="w-full mt-6"
            >
              <span class="flex items-center gap-2">
                Continue to Login
                <ArrowRight class="w-5 h-5" />
              </span>
            </FormButton>
          </div>
        </transition>

        <!-- Registration Form -->
        <transition
          enter-active-class="transition-all duration-500"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
        >
          <div v-if="step === 1">
            <!-- Header -->
            <div class="text-center mb-8 space-y-3">
              <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white shadow-2xl shadow-blue-500/30 mb-4 hover:scale-105 transition-transform">
                <UserPlus class="w-10 h-10" />
              </div>
              <h2 class="text-4xl font-bold text-slate-900">Create Account</h2>
              <p class="text-slate-600">Register as a new healthcare staff member</p>
            </div>

            <!-- Form Card -->
            <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 p-8 border border-white/20">
              <form @submit.prevent="handleRegister" class="space-y-5">
                <!-- Role Selection -->
                <div class="space-y-2">
                  <label class="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-2">
                    <Briefcase class="w-4 h-4" />
                    Select Your Role
                  </label>
                  <div class="grid grid-cols-2 gap-3">
                    <button
                      v-for="role in roles"
                      :key="role.value"
                      type="button"
                      @click="formData.role = role.value"
                      class="p-3 rounded-xl border-2 transition-all duration-300 text-left"
                      :class="[
                        formData.role === role.value
                          ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      ]"
                    >
                      <div class="flex items-center gap-2">
                        <span class="text-2xl">{{ role.icon }}</span>
                        <span class="font-semibold text-sm" :class="formData.role === role.value ? 'text-blue-700' : 'text-slate-700'">
                          {{ role.label }}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                <!-- Full Name -->
                <FormInput
                  v-model="formData.fullName"
                  label="Full Name"
                  type="text"
                  :icon="User"
                  placeholder="Dr. John Smith"
                  :error="errors.fullName"
                  autocomplete="name"
                />

                <!-- Email -->
                <FormInput
                  v-model="formData.email"
                  label="Email Address"
                  type="email"
                  :icon="Mail"
                  placeholder="john.smith@hospital.com"
                  :error="errors.email"
                  autocomplete="email"
                />

                <!-- Mobile -->
                <FormInput
                  v-model="formData.mobile"
                  label="Mobile Number"
                  type="tel"
                  :icon="Phone"
                  placeholder="9876543210"
                  :error="errors.mobile"
                  autocomplete="tel"
                />

                <!-- Department (Optional) -->
                <FormInput
                  v-model="formData.department"
                  label="Department (Optional)"
                  type="text"
                  :icon="Building"
                  placeholder="Cardiology, Emergency, etc."
                  :error="errors.department"
                />

                <!-- Password -->
                <FormInput
                  v-model="formData.password"
                  label="Password"
                  type="password"
                  :icon="Lock"
                  placeholder="Minimum 6 characters"
                  :error="errors.password"
                  autocomplete="new-password"
                />

                <!-- Confirm Password -->
                <FormInput
                  v-model="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  :icon="Lock"
                  placeholder="Re-enter your password"
                  :error="errors.confirmPassword"
                  autocomplete="new-password"
                />

                <!-- Register Button -->
                <FormButton
                  type="submit"
                  :loading="loading"
                  variant="primary"
                  size="lg"
                  class="w-full mt-6"
                >
                  <span v-if="!loading" class="flex items-center gap-2">
                    Create Account
                    <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </FormButton>
              </form>

              <!-- Divider -->
              <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-slate-200"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-4 bg-white text-slate-500 font-medium">Already registered?</span>
                </div>
              </div>

              <!-- Login Link -->
              <button
                @click="goToLogin"
                type="button"
                class="w-full py-3.5 px-6 rounded-xl border-2 border-slate-200 hover:border-blue-500 text-slate-700 hover:text-blue-700 font-semibold transition-all duration-300 hover:bg-blue-50 flex items-center justify-center gap-2"
              >
                Sign in to your account
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s infinite;
}
</style>
             <div class="relative">
               <input 
                 v-model="formData.fullName"
                 type="text" 
                 required
                 class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                 placeholder="e.g. Dr. Rajesh Koothrappali"
               />
               <User class="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
             </div>
          </div>

          <!-- Email -->
          <div class="space-y-1">
            <label class="text-sm font-medium text-slate-700">Email</label>
            <div class="relative">
              <input 
                v-model="formData.email"
                type="email" 
                required
                class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="name@hospital.com"
              />
              <Mail class="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <!-- Mobile -->
          <div class="space-y-1">
            <label class="text-sm font-medium text-slate-700">Mobile Number</label>
            <div class="relative">
              <input 
                v-model="formData.mobile"
                type="tel" 
                required
                class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="9876543210"
              />
              <Phone class="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <!-- Department (Conditional Logic could be added here) -->
          <div class="space-y-1" v-if="formData.role === 'DOCTOR' || formData.role === 'NURSE'">
            <label class="text-sm font-medium text-slate-700">Department</label>
            <div class="relative">
              <input 
                v-model="formData.department"
                type="text" 
                class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Cardiology, Ortho..."
              />
              <Building class="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <!-- Password -->
          <div class="space-y-1">
            <label class="text-sm font-medium text-slate-700">Password</label>
            <div class="relative">
              <input 
                v-model="formData.password"
                type="password" 
                required
                class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="••••••••"
              />
              <Lock class="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
            <span v-else>Register Staff</span>
          </button>

          <p class="text-center text-sm text-slate-500 mt-4">
            Already have an account? 
            <router-link to="/login" class="text-blue-600 font-semibold hover:text-blue-700">Login here</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
