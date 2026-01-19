<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'

interface Props {
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit'
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  variant: 'primary',
  size: 'md',
  type: 'button'
})
</script>

<template>
  <button
    :type="type"
    :disabled="loading"
    class="relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
    :class="[
      // Variant Styles
      variant === 'primary' && 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-lg shadow-teal-600/30 hover:shadow-xl hover:shadow-teal-600/40 hover:-translate-y-0.5',
      variant === 'secondary' && 'bg-slate-100 hover:bg-slate-200 text-slate-700',
      variant === 'outline' && 'border-2 border-slate-200 hover:border-teal-500 hover:bg-teal-50 text-slate-700 hover:text-teal-700',
      
      // Size Styles
      size === 'sm' && 'px-4 py-2 text-sm',
      size === 'md' && 'px-6 py-3.5 text-base',
      size === 'lg' && 'px-8 py-4 text-lg'
    ]"
  >
    <!-- Background Animation -->
    <span 
      v-if="variant === 'primary'"
      class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
    />

    <!-- Loading Spinner -->
    <Loader2 
      v-if="loading" 
      class="w-5 h-5 animate-spin"
      :class="{ 'absolute': $slots.default }"
    />

    <!-- Content -->
    <span 
      class="relative flex items-center gap-2"
      :class="{ 'invisible': loading && $slots.default }"
    >
      <slot />
    </span>
  </button>
</template>
