<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: string
  size?: 'sm' | 'md' | 'lg'
}>()

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5'
}

const statusConfig = computed(() => {
  const status = props.status.toUpperCase()
  
  switch (status) {
    case 'ADMITTED':
      return {
        label: 'Admitted',
        classes: 'bg-amber-50 text-amber-700 border-amber-200'
      }
    case 'DISCHARGED':
      return {
        label: 'Discharged',
        classes: 'bg-emerald-50 text-emerald-700 border-emerald-200'
      }
    case 'SURGERY_SCHEDULED':
    case 'IN_SURGERY':
      return {
        label: status === 'IN_SURGERY' ? 'In Surgery' : 'Surgery Scheduled',
        classes: 'bg-rose-50 text-rose-700 border-rose-200'
      }
    case 'CHECKUP_PENDING':
      return {
        label: 'Pending',
        classes: 'bg-blue-50 text-blue-700 border-blue-200'
      }
    case 'UNDER_OBSERVATION':
      return {
        label: 'Under Observation',
        classes: 'bg-purple-50 text-purple-700 border-purple-200'
      }
    default:
      return {
        label: status,
        classes: 'bg-slate-50 text-slate-700 border-slate-200'
      }
  }
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center font-medium rounded-full border',
      sizeClasses[size || 'md'],
      statusConfig.classes
    ]"
  >
    {{ statusConfig.label }}
  </span>
</template>
