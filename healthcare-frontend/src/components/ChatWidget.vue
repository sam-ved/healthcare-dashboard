<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { MessageCircle, X, Send, Loader2, Bot, User } from 'lucide-vue-next'
import { getUserRole } from '@/utils/auth'
import axios from 'axios'

interface Message {
  id: number
  content: string
  sender: 'user' | 'assistant'
  timestamp: Date
}

const isOpen = ref(false)
const messages = ref<Message[]>([])
const inputMessage = ref('')
const loading = ref(false)
const error = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

let messageIdCounter = 0

const userRole = computed(() => getUserRole() || 'PATIENT')
const hasAuthToken = computed(() => !!localStorage.getItem('auth_token'))

const toggleChat = () => {
  isOpen.value = !isOpen.value
  error.value = ''
  
  if (isOpen.value && messages.value.length === 0) {
    // Welcome message
    addAssistantMessage('Hello! I\'m your Hospital Management System Assistant. I can help you with hospital workflows, appointments, and general information. How can I assist you today?')
  }
}

const addUserMessage = (content: string) => {
  messages.value.push({
    id: messageIdCounter++,
    content,
    sender: 'user',
    timestamp: new Date()
  })
  scrollToBottom()
}

const addAssistantMessage = (content: string) => {
  messages.value.push({
    id: messageIdCounter++,
    content,
    sender: 'assistant',
    timestamp: new Date()
  })
  scrollToBottom()
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const sendMessage = async () => {
  const message = inputMessage.value.trim()
  
  // Prevent sending if empty, already loading, or no token
  if (!message || loading.value) {
    return
  }

  if (!localStorage.getItem('auth_token')) {
    error.value = 'Please log in to use the chat.'
    return
  }
  
  if (message.length > 500) {
    error.value = 'Message too long (max 500 characters)'
    return
  }

  error.value = ''
  addUserMessage(message)
  inputMessage.value = ''
  loading.value = true

  try {
    console.log('📨 Sending chat request...')
    
    const response = await axios.post('http://localhost:3000/api/chat', {
      message,
      role: userRole.value
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000 // 15 second timeout for frontend
    })

    console.log('✅ Received response:', response.data)

    // Check if we got a proper reply
    if (response.data?.reply) {
      addAssistantMessage(response.data.reply)
    } else {
      console.error('⚠️ Invalid response format:', response.data)
      error.value = 'Invalid response from server'
      addAssistantMessage('Sorry, I received an invalid response. Please try again.')
    }
  } catch (err: any) {
    console.error('❌ Chat error:', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
      code: err.code
    })
    
    let errorMessage = 'Failed to get response. Please try again.'
    
    // Handle specific error cases
    if (err.response?.status === 429) {
      errorMessage = 'Too many requests. Please wait a moment.'
    } else if (err.response?.status === 401) {
      errorMessage = 'Session expired. Please log in again.'
      // Clear token and redirect would go here in a real app
    } else if (err.response?.status === 400) {
      errorMessage = err.response.data?.error || 'Invalid request. Please check your message.'
    } else if (err.response?.status === 504) {
      errorMessage = 'Request timeout. The AI service is taking too long to respond.'
    } else if (err.response?.status === 500) {
      errorMessage = err.response.data?.error || 'Server error. Please try again later.'
    } else if (err.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Please try again.'
    } else if (err.code === 'ECONNREFUSED') {
      errorMessage = 'Cannot connect to server. Please check your connection.'
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error
    } else if (err.message) {
      errorMessage = err.message
    }
    
    error.value = errorMessage
    console.warn(`⚠️ Displaying error to user: ${errorMessage}`)
    addAssistantMessage(`⚠️ ${errorMessage}`)
  } finally {
    loading.value = false
  }
}

const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50">
    <!-- Chat Panel -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-4"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-4"
    >
      <div
        v-if="isOpen"
        class="mb-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
      >
        <!-- Header -->
        <div class="bg-gradient-to-r from-teal-600 to-teal-700 p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Bot class="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 class="font-bold text-white">HMS Assistant</h3>
              <p class="text-xs text-teal-100">Here to help you</p>
            </div>
          </div>
          <button
            @click="toggleChat"
            class="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X class="w-5 h-5 text-white" />
          </button>
        </div>

        <!-- Messages -->
        <div
          ref="messagesContainer"
          class="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
        >
          <div
            v-for="message in messages"
            :key="message.id"
            :class="[
              'flex gap-3',
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            ]"
          >
            <!-- Avatar -->
            <div
              v-if="message.sender === 'assistant'"
              class="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md"
            >
              <Bot class="w-5 h-5 text-white" />
            </div>

            <!-- Message Bubble -->
            <div
              :class="[
                'max-w-[75%] rounded-2xl px-4 py-3 shadow-sm',
                message.sender === 'user'
                  ? 'bg-teal-600 text-white rounded-tr-sm'
                  : 'bg-white text-slate-800 rounded-tl-sm border border-slate-200'
              ]"
            >
              <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ message.content }}</p>
              <p
                :class="[
                  'text-xs mt-1',
                  message.sender === 'user' ? 'text-teal-100' : 'text-slate-400'
                ]"
              >
                {{ message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
              </p>
            </div>

            <!-- User Avatar -->
            <div
              v-if="message.sender === 'user'"
              class="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center flex-shrink-0 shadow-md"
            >
              <User class="w-5 h-5 text-white" />
            </div>
          </div>

          <!-- Loading Indicator -->
          <div v-if="loading" class="flex gap-3 justify-start">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0">
              <Loader2 class="w-5 h-5 text-white animate-spin" />
            </div>
            <div class="bg-white rounded-2xl rounded-tl-sm px-4 py-3 border border-slate-200">
              <div class="flex gap-1">
                <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <transition
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0 -translate-y-2"
          leave-active-class="transition-all duration-200"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="error" class="px-4 py-2 bg-red-50 border-t border-red-200">
            <p class="text-xs text-red-700">{{ error }}</p>
          </div>
        </transition>

        <!-- Input Area -->
        <div class="p-4 bg-white border-t border-slate-200">
          <div class="flex gap-2">
            <input
              v-model="inputMessage"
              @keypress="handleKeyPress"
              type="text"
              placeholder="Ask me anything..."
              :disabled="loading"
              class="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            />
            <button
              @click="sendMessage"
              :disabled="loading || !inputMessage.trim() || !hasAuthToken"
              title="Send message (or press Enter)"
              class="w-12 h-12 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-600/30 hover:shadow-xl hover:shadow-teal-600/40 hover:scale-105"
            >
              <Send v-if="!loading" class="w-5 h-5" />
              <Loader2 v-else class="w-5 h-5 animate-spin" />
            </button>
          </div>
          <p class="text-xs text-slate-500 mt-2 text-center">
            AI Assistant • Not for medical diagnosis
          </p>
        </div>
      </div>
    </transition>

    <!-- Floating Button -->
    <button
      @click="toggleChat"
      :class="[
        'w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110',
        isOpen
          ? 'bg-slate-700 hover:bg-slate-800'
          : 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-teal-600/50 hover:shadow-teal-600/70'
      ]"
    >
      <MessageCircle v-if="!isOpen" class="w-7 h-7 text-white" />
      <X v-else class="w-7 h-7 text-white" />
      
      <!-- Pulse animation when closed -->
      <span
        v-if="!isOpen"
        class="absolute inset-0 rounded-full bg-teal-400 animate-ping opacity-20"
      ></span>
    </button>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
