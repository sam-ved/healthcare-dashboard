<script setup lang="ts">
import { computed } from 'vue';

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  variant?: Variant;
  size?: Size;
  dot?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  size: 'md',
  dot: false
});

const variantClasses = computed(() => {
  const variants = {
    success: 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
    warning: 'bg-amber-100 text-amber-700 ring-amber-600/20',
    danger: 'bg-rose-100 text-rose-700 ring-rose-600/20',
    info: 'bg-blue-100 text-blue-700 ring-blue-600/20',
    neutral: 'bg-slate-100 text-slate-700 ring-slate-600/20'
  };
  return variants[props.variant];
});

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };
  return sizes[props.size];
});

const dotClasses = computed(() => {
  const colors = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-blue-500',
    neutral: 'bg-slate-500'
  };
  return colors[props.variant];
});
</script>

<template>
  <span 
    class="inline-flex items-center gap-1.5 font-medium rounded-full ring-1 ring-inset transition-all"
    :class="[variantClasses, sizeClasses]"
  >
    <span 
      v-if="dot" 
      class="w-1.5 h-1.5 rounded-full animate-pulse"
      :class="dotClasses"
    ></span>
    <slot />
  </span>
</template>
