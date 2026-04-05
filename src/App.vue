<template>
  <div class="min-h-screen bg-gray-950">
    <Sidebar />
    <TopBar />
    <main class="ml-60 pt-14 min-h-screen">
      <div class="p-6">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import Sidebar from '@/components/layout/Sidebar.vue'
import TopBar from '@/components/layout/TopBar.vue'
</script>
