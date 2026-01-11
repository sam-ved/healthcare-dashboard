<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  Bed, 
  ClipboardList, 
  BarChart3, 
  UserCog, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-vue-next'
import { getEmployee, clearAuth } from '@/utils/auth'
import Avatar from './Avatar.vue'

interface NavItem {
  name: string
  path: string
  icon: any
}

const props = defineProps<{
  role: 'DOCTOR' | 'NURSE' | 'ADMIN' | 'WARDBOY'
}>()

const router = useRouter()
const route = useRoute()
const isCollapsed = ref(false)
const isMobileOpen = ref(false)

const employee = computed(() => getEmployee())

const navigationItems = computed((): NavItem[] => {
  if (props.role === 'DOCTOR') {
    return [
      { name: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
      { name: 'Patient Queue', path: '/doctor/queue', icon: ClipboardList },
    ]
  } else if (props.role === 'NURSE' || props.role === 'WARDBOY') {
    return [
      { name: 'Triage Dashboard', path: '/reception/dashboard', icon: LayoutDashboard },
      { name: 'Patient Entry', path: '/reception/patient-entry', icon: Users },
      { name: 'Ward Management', path: '/reception/ward-management', icon: Bed },
    ]
  } else if (props.role === 'ADMIN') {
    return [
      { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
      { name: 'Staff Management', path: '/admin/staff', icon: UserCog },
    ]
  }
  return []
})

const isActive = (path: string) => route.path === path

const handleLogout = () => {
  clearAuth()
  router.push('/login')
}

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const toggleMobileSidebar = () => {
  isMobileOpen.value = !isMobileOpen.value
}
</script>

<template>
  <div class="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
    <!-- Mobile Menu Button -->
    <button
      @click="toggleMobileSidebar"
      class="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-white/90 backdrop-blur-lg shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 border border-slate-200"
    >
      <Menu v-if="!isMobileOpen" class="w-5 h-5 text-slate-700" />
      <X v-else class="w-5 h-5 text-slate-700" />
    </button>

    <!-- Mobile Overlay -->
    <div
      v-if="isMobileOpen"
      @click="toggleMobileSidebar"
      class="lg:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30"
    />

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed lg:sticky top-0 h-screen bg-white/80 backdrop-blur-xl border-r border-slate-200 transition-all duration-300 z-40 shadow-xl',
        isCollapsed ? 'w-20' : 'w-64',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <div class="flex flex-col h-full">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-slate-200">
          <div v-if="!isCollapsed" class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-medical-500 to-medical-700 flex items-center justify-center shadow-lg">
              <Stethoscope class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-sm font-bold text-slate-900">Growth Catalysts</h1>
              <p class="text-xs text-medical-600 font-medium">Healthcare Hub</p>
            </div>
          </div>
          <button
            @click="toggleSidebar"
            class="hidden lg:block p-2 rounded-lg hover:bg-slate-100 transition-all duration-200"
          >
            <Menu class="w-4 h-4 text-slate-600" />
          </button>
        </div>

        <!-- User Info -->
        <div class="p-4 mx-4 my-4 bg-gradient-to-br from-medical-50 to-medical-100/50 rounded-xl border border-medical-200">
          <div v-if="!isCollapsed" class="space-y-2">
            <div class="flex items-center gap-3">
              <Avatar :name="employee?.fullName" size="md" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-slate-900 truncate">{{ employee?.fullName }}</p>
                <p class="text-xs text-slate-600">{{ employee?.role }}</p>
              </div>
            </div>
            <div class="text-xs text-medical-700 bg-white rounded-lg px-2.5 py-1.5 font-medium border border-medical-200">
              ID: {{ employee?.employeeId }}
            </div>
          </div>
          <div v-else class="flex justify-center">
            <Avatar :name="employee?.fullName" size="md" />
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto px-4 space-y-1">
          <router-link
            v-for="(item, index) in navigationItems"
            :key="item.path"
            :to="item.path"
            @click="isMobileOpen = false"
            :data-index="index"
            :class="[
              'group relative flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200',
              isActive(item.path)
                ? 'bg-medical-600 text-white shadow-lg shadow-medical-600/25'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            ]"
          >
            <!-- Active indicator -->
            <div 
              v-if="isActive(item.path)"
              class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
            />
            
            <component 
              :is="item.icon" 
              :class="[
                'w-5 h-5 flex-shrink-0 transition-transform duration-200',
                isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'
              ]" 
            />
            <span v-if="!isCollapsed" class="text-sm">{{ item.name }}</span>
            
            <!-- Hover glow effect -->
            <div 
              v-if="!isActive(item.path)"
              class="absolute inset-0 rounded-xl bg-gradient-to-r from-medical-500/0 via-medical-500/5 to-medical-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </router-link>
        </nav>

        <!-- Logout Button -->
        <div class="p-4 border-t border-slate-200">
          <button
            @click="handleLogout"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200',
              'text-slate-600 hover:bg-rose-50 hover:text-rose-600 group'
            ]"
          >
            <LogOut class="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
            <span v-if="!isCollapsed" class="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-auto">
      <div class="p-6 lg:p-8">
        <slot />
      </div>
    </main>
  </div>
</template>
