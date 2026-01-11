<script setup lang="ts">
import { computed } from 'vue';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface Props {
  name?: string;
  src?: string;
  size?: Size;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
});

const initials = computed(() => {
  if (!props.name) return '?';
  const parts = props.name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
});

const sizeClasses = computed(() => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl'
  };
  return sizes[props.size];
});

const gradientClass = computed(() => {
  if (!props.name) return 'bg-gradient-to-br from-slate-400 to-slate-600';
  
  const gradients = [
    'bg-gradient-to-br from-medical-400 to-medical-600',
    'bg-gradient-to-br from-blue-400 to-blue-600',
    'bg-gradient-to-br from-purple-400 to-purple-600',
    'bg-gradient-to-br from-amber-400 to-amber-600',
    'bg-gradient-to-br from-rose-400 to-rose-600',
    'bg-gradient-to-br from-indigo-400 to-indigo-600',
    'bg-gradient-to-br from-pink-400 to-pink-600',
    'bg-gradient-to-br from-cyan-400 to-cyan-600',
  ];
  
  const charCode = props.name.charCodeAt(0);
  return gradients[charCode % gradients.length];
});
</script>

<template>
  <div 
    class="relative inline-flex items-center justify-center rounded-full font-semibold text-white ring-2 ring-white shadow-sm"
    :class="[sizeClasses, gradientClass]"
  >
    <img 
      v-if="src" 
      :src="src" 
      :alt="name" 
      class="w-full h-full rounded-full object-cover"
    />
    <span v-else>{{ initials }}</span>
  </div>
</template>
