<script setup lang="ts">
import { computed } from 'vue';
import { useMotion } from '@vueuse/motion';
import type { Component } from 'vue';

interface Props {
  title: string;
  value: string | number;
  icon: Component;
  trend?: string;
  trendUp?: boolean;
  color?: 'medical' | 'blue' | 'purple' | 'amber' | 'rose';
  delay?: number;
}

const props = withDefaults(defineProps<Props>(), {
  color: 'medical',
  delay: 0
});

const colorClasses = computed(() => {
  const colors = {
    medical: 'bg-medical-100 text-medical-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    amber: 'bg-amber-100 text-amber-700',
    rose: 'bg-rose-100 text-rose-700'
  };
  return colors[props.color];
});

const trendClasses = computed(() => {
  return props.trendUp ? 'text-emerald-600' : 'text-rose-600';
});
</script>

<template>
  <div
    v-motion
    :initial="{ opacity: 0, y: 20 }"
    :enter="{ 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: delay * 100
      }
    }"
    class="group relative bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
  >
    <!-- Icon Badge -->
    <div 
      class="absolute -top-3 left-6 p-3 rounded-lg shadow-lg"
      :class="colorClasses"
    >
      <component :is="icon" class="w-5 h-5" />
    </div>

    <!-- Content -->
    <div class="mt-4">
      <p class="text-sm font-medium text-slate-600 mb-1">{{ title }}</p>
      <div class="flex items-baseline gap-2">
        <h3 class="text-3xl font-bold text-slate-900 tracking-tight">
          {{ value }}
        </h3>
        <span 
          v-if="trend" 
          class="text-xs font-semibold flex items-center gap-0.5"
          :class="trendClasses"
        >
          <svg 
            v-if="trendUp" 
            class="w-3 h-3" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <svg 
            v-else 
            class="w-3 h-3" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          {{ trend }}
        </span>
      </div>
    </div>

    <!-- Hover indicator -->
    <div class="absolute inset-0 border-2 border-transparent group-hover:border-medical-400/30 rounded-xl transition-colors duration-300"></div>
  </div>
</template>
