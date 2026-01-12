import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { isAuthenticated, getUserRole } from '@/utils/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    redirect: () => {
      if (!isAuthenticated()) return '/login'
      const role = getUserRole()
      if (role === 'DOCTOR') return '/doctor/dashboard'
      if (role === 'NURSE' || role === 'WARDBOY' || role === 'RECEPTIONIST') return '/reception/dashboard'
      if (role === 'ADMIN') return '/admin/analytics'
      return '/login'
    }
  },
  {
    path: '/doctor',
    component: () => import('@/layouts/DoctorLayout.vue'),
    meta: { requiresAuth: true, allowedRoles: ['DOCTOR'] },
    children: [
      {
        path: 'dashboard',
        name: 'DoctorDashboard',
        component: () => import('@/views/doctor/Dashboard.vue')
      },
      {
        path: 'queue',
        name: 'DoctorQueue',
        component: () => import('@/views/doctor/Queue.vue')
      },
      {
        path: 'consultation/:visitId',
        name: 'Consultation',
        component: () => import('@/views/doctor/Consultation.vue')
      },
      {
        path: 'patient/:id',
        name: 'PatientExaminer',
        component: () => import('@/views/doctor/PatientExaminer.vue')
      }
    ]
  },
  {
    path: '/reception',
    component: () => import('@/layouts/ReceptionLayout.vue'),
    meta: { requiresAuth: true, allowedRoles: ['NURSE', 'WARDBOY', 'RECEPTIONIST'] },
    children: [
      {
        path: 'dashboard',
        name: 'ReceptionDashboard',
        component: () => import('@/views/reception/Dashboard.vue')
      },
      {
        path: 'patient-entry',
        name: 'PatientEntry',
        component: () => import('@/views/reception/PatientEntry.vue')
      },
      {
        path: 'ward-management',
        name: 'WardManagement',
        component: () => import('@/views/reception/WardManagement.vue')
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, allowedRoles: ['ADMIN'] },
    children: [
      {
        path: 'analytics',
        name: 'AdminAnalytics',
        component: () => import('@/views/admin/Analytics.vue')
      },
      {
        path: 'staff',
        name: 'StaffManagement',
        component: () => import('@/views/admin/StaffManagement.vue')
      }
    ]
  },
  {
    path: '/',
    redirect: () => {
      if (!isAuthenticated()) return '/login'
      const role = getUserRole()
      if (role === 'DOCTOR') return '/doctor/dashboard'
      if (role === 'NURSE' || role === 'WARDBOY' || role === 'RECEPTIONIST') return '/reception/dashboard'
      if (role === 'ADMIN') return '/admin/analytics'
      return '/login'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, _, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const authenticated = isAuthenticated()

  if (requiresAuth && !authenticated) {
    next('/login')
    return
  }

  if (to.path === '/login' && authenticated) {
    const role = getUserRole()
    if (role === 'DOCTOR') next('/doctor/dashboard')
    else if (role === 'NURSE' || role === 'WARDBOY' || role === 'RECEPTIONIST') next('/reception/dashboard')
    else if (role === 'ADMIN') next('/admin/analytics')
    else next()
    return
  }

  // Check role-based access
  const allowedRoles = to.matched
    .filter(record => record.meta.allowedRoles)
    .flatMap(record => record.meta.allowedRoles as string[])

  if (allowedRoles.length > 0) {
    const userRole = getUserRole()
    if (!userRole || !allowedRoles.includes(userRole)) {
      next('/login')
      return
    }
  }

  next()
})

export default router
