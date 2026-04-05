<template>
  <div class="min-h-screen bg-gray-950">
    <!-- Login sayfasında sidebar/topbar gösterme -->
    <template v-if="isLoggedIn">
      <Sidebar />
      <TopBar />
      <main class="ml-60 pt-14 min-h-screen">
        <div class="p-6">
          <router-view />
        </div>
      </main>
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/layout/Sidebar.vue'
import TopBar  from '@/components/layout/TopBar.vue'

const route     = useRoute()
const isLoggedIn = computed(() => route.name !== 'login')
</script>
