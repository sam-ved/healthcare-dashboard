<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import { getUserRole } from '@/utils/auth'

const role = getUserRole() as 'NURSE' | 'WARDBOY'
</script>

<template>
  <Sidebar :role="role">
    <router-view />
  </Sidebar>
</template>
