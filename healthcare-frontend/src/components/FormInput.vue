<script setup lang="ts">
import { ref, computed } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'

interface Props {
  modelValue: string
  label: string
  type?: 'text' | 'email' | 'password' | 'tel'
  placeholder?: string
  icon?: any
  error?: string
  autocomplete?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  error: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isFocused = ref(false)
const showPassword = ref(false)

const inputType = computed(() => {
  if (props.type === 'password' && showPassword.value) return 'text'
  return props.type
})

const hasValue = computed(() => props.modelValue.length > 0)
const isFloating = computed(() => isFocused.value || hasValue.value)

const handleInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="relative group">
    <div 
      class="relative"
      :class="{ 'has-error': error }"
    >
      <!-- Icon -->
      <component 
        v-if="icon" 
        :is="icon" 
        class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 z-10"
        :class="[
          isFocused ? 'text-teal-600' : 'text-slate-400',
          error ? 'text-red-500' : ''
        ]"
      />

      <!-- Input -->
      <input
        :type="inputType"
        :value="modelValue"
        @input="handleInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :placeholder="isFloating ? placeholder : ''"
        :autocomplete="autocomplete"
        class="w-full px-4 py-3.5 bg-white border-2 rounded-xl outline-none transition-all duration-300 peer"
        :class="[
          icon ? 'pl-12' : 'pl-4',
          type === 'password' ? 'pr-12' : 'pr-4',
          isFocused && !error ? 'border-teal-500 shadow-lg shadow-teal-500/10' : '',
          !isFocused && !error ? 'border-slate-200 hover:border-slate-300' : '',
          error ? 'border-red-500 bg-red-50/50' : ''
        ]"
      />

      <!-- Floating Label -->
      <label 
        class="absolute left-4 transition-all duration-300 pointer-events-none bg-white px-1"
        :class="[
          icon ? 'left-12' : 'left-4',
          isFloating 
            ? '-top-2.5 text-xs font-semibold' 
            : 'top-1/2 -translate-y-1/2 text-base',
          isFocused && !error ? 'text-teal-600' : 'text-slate-500',
          error ? 'text-red-600' : ''
        ]"
      >
        {{ label }}
      </label>

      <!-- Password Toggle -->
      <button
        v-if="type === 'password'"
        type="button"
        @click="showPassword = !showPassword"
        class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors z-10"
      >
        <Eye v-if="!showPassword" class="w-5 h-5" />
        <EyeOff v-else class="w-5 h-5" />
      </button>
    </div>

    <!-- Error Message -->
    <transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <p v-if="error" class="text-red-600 text-sm mt-1.5 ml-1 flex items-center gap-1">
        <span class="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
        {{ error }}
      </p>
    </transition>
  </div>
</template>

<style scoped>
.has-error input {
  animation: shake 0.4s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
</style>
