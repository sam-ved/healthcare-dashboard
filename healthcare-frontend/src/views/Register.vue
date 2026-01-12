<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerEmployee } from '@/api'
import type { RegisterEmployeeData } from '@/types'
import { UserPlus, User, Mail, Phone, Lock, Building, ShieldCheck } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const router = useRouter()
const loading = ref(false)
const formData = ref<RegisterEmployeeData>({
  fullName: '',
  email: '',
  mobile: '',
  password: '',
  role: 'DOCTOR',
  department: ''
})

const generatedId = ref<string | null>(null)

const handleRegister = async () => {
  loading.value = true
  try {
    const response = await registerEmployee(formData.value)
    // Assuming API returns { token, employee: { employeeId, ... } }
    generatedId.value = response.employee.employeeId
    toast.success('Registration successful!')
  } catch (error: any) {
    console.error(error)
    toast.error(error.response?.data?.message || 'Registration failed')
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
      
      <!-- Success View -->
      <div v-if="generatedId" class="text-center space-y-6">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck class="w-10 h-10 text-green-600" />
        </div>
        <h2 class="text-2xl font-bold text-slate-900">Registration Complete!</h2>
        <p class="text-slate-600">Your account has been created successfully.</p>
        
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p class="text-sm text-blue-800 mb-1">Your Unique Employee ID</p>
          <p class="text-2xl font-mono font-bold text-blue-900 tracking-wider">{{ generatedId }}</p>
          <p class="text-xs text-blue-600 mt-2">Please save this ID for login.</p>
        </div>

        <button 
          @click="goToLogin"
          class="w-full bg-medical-600 hover:bg-medical-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
        >
          Proceed to Login
        </button>
      </div>

      <!-- Registration Form -->
      <div v-else>
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus class="w-8 h-8 text-blue-600" />
          </div>
          <h1 class="text-2xl font-bold text-slate-900">Staff Registration</h1>
          <p class="text-slate-600 mt-2">Create new employee account</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          
          <!-- Role Selection -->
          <div class="space-y-1">
            <label class="text-sm font-medium text-slate-700">Role</label>
            <div class="relative">
              <select 
                v-model="formData.role"
                class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none"
              >
                <option value="DOCTOR">Doctor</option>
                <option value="NURSE">Nurse</option>
                <option value="WARDBOY">Wardboy</option>
                <option value="RECEPTIONIST">Receptionist</option>
                <option value="ADMIN">Admin</option>
              </select>
              <ShieldCheck class="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <!-- Full Name -->
          <div class="space-y-1">
             <label class="text-sm font-medium text-slate-700">Full Name</label>
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
