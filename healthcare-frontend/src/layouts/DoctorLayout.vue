<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import ChatWidget from '@/components/ChatWidget.vue'
</script>

<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden">
    <Sidebar role="DOCTOR" />
    <main class="flex-1 overflow-auto">
      <div class="p-8 max-w-7xl mx-auto min-h-full">
         <router-view />
      </div>
    </main>
    <ChatWidget />
  </div>
</template>
