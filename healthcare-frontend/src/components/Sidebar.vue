<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { LayoutDashboard, Users, Stethoscope, Bed, LogOut, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { getEmployee, clearAuth } from '@/utils/auth'
import Avatar from './Avatar.vue'

// ... Keep existing logic (props, router, computed navItems) ...
// Ensure you copy the previous logic for 'navigationItems' here

const props = defineProps<{ role: string }>()
const router = useRouter()
const route = useRoute()
const isCollapsed = ref(false)
const employee = computed(() => getEmployee())

// Navigation Item Logic (Simplified for brevity, use your full logic)
const navigationItems = computed(() => {
  if (props.role === 'DOCTOR') return [
      { name: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
      { name: 'Patient Queue', path: '/doctor/queue', icon: Users }
  ]
  if (props.role === 'NURSE' || props.role === 'RECEPTIONIST') return [
      { name: 'Overview', path: '/reception/dashboard', icon: LayoutDashboard },
      { name: 'Patient Entry', path: '/reception/patient-entry', icon: Users },
      { name: 'Ward Mgmt', path: '/reception/ward-management', icon: Bed }
  ]
  return []
})

const isActive = (path: string) => route.path === path
const handleLogout = () => { clearAuth(); router.push('/login') }
</script>

<template>
  <aside 
    class="h-screen bg-white border-r border-slate-200 flex flex-col transition-all duration-300 relative z-20"
    :class="isCollapsed ? 'w-20' : 'w-72'"
    v-motion
    :initial="{ x: -100, opacity: 0 }"
    :enter="{ x: 0, opacity: 1, transition: { duration: 500, type: 'spring' } }"
  >
    <button 
      @click="isCollapsed = !isCollapsed"
      class="absolute -right-3 top-8 bg-white border border-slate-200 rounded-full p-1 shadow-sm text-slate-500 hover:text-teal-600 transition-colors"
    >
      <ChevronRight v-if="isCollapsed" class="w-4 h-4" />
      <ChevronLeft v-else class="w-4 h-4" />
    </button>

    <div class="p-6 flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 shrink-0">
        <Stethoscope class="w-6 h-6" />
      </div>
      <div v-if="!isCollapsed" v-motion-fade>
        <h1 class="font-bold text-slate-900 text-lg leading-tight">Growth<br/>Catalysts</h1>
      </div>
    </div>

    <div class="flex-1 px-4 space-y-2 mt-4">
      <router-link
        v-for="item in navigationItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden"
        :class="isActive(item.path) ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'"
      >
        <div v-if="isActive(item.path)" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-teal-400 rounded-r-full"></div>

        <component :is="item.icon" class="w-5 h-5 shrink-0" :class="isActive(item.path) ? 'text-teal-400' : ''" />
        
        <span v-if="!isCollapsed" class="font-medium text-sm whitespace-nowrap">{{ item.name }}</span>
      </router-link>
    </div>

    <div class="p-4 border-t border-slate-100">
      <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
        <Avatar :name="employee?.fullName" class="shrink-0" />
        <div v-if="!isCollapsed" class="min-w-0 flex flex-col justify-center">
          <p class="text-sm font-bold text-slate-900 truncate leading-tight">{{ employee?.fullName }}</p>
          <p class="text-xs text-slate-500 truncate capitalize mt-0.5">{{ employee?.role?.toLowerCase() }}</p>
        </div>
        <button v-if="!isCollapsed" @click="handleLogout" class="ml-auto text-slate-400 hover:text-rose-500 transition-colors">
          <LogOut class="w-4 h-4" />
        </button>
      </div>
    </div>
  </aside>
</template>