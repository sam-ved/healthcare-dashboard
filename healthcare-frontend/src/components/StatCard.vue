<script setup lang="ts">
import { useTransition, TransitionPresets } from '@vueuse/core'
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  title: string
  value: number
  icon: any
  color: string // e.g. 'teal', 'indigo', 'rose'
}>()

// Animate the number counting up
const number = ref(0)
const output = useTransition(number, {
  duration: 1500,
  transition: TransitionPresets.easeOutExpo,
})

onMounted(() => {
  // Delay slightly so it counts up after page load
  setTimeout(() => {
    number.value = props.value
  }, 200)
})

// Map color prop to Tailwind classes
const colors: Record<string, string> = {
  teal: 'bg-teal-50 text-teal-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  rose: 'bg-rose-50 text-rose-600',
  amber: 'bg-amber-50 text-amber-600'
}
</script>

<template>
  <div 
    class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300"
    v-motion
    :initial="{ opacity: 0, y: 20 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
  >
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm font-medium text-slate-500 mb-1">{{ title }}</p>
        <h3 class="text-3xl font-bold text-slate-900">
          {{ Math.round(output) }}
        </h3>
      </div>
      <div :class="`p-3 rounded-xl ${colors[color] || colors.teal}`">
        <component :is="icon" class="w-6 h-6" />
      </div>
    </div>
  </div>
</template>