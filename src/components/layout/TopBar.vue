<template>
  <header class="fixed top-0 right-0 left-60 z-40 h-14 bg-gray-950/80 backdrop-blur border-b border-gray-800 flex items-center justify-between px-6">
    <div>
      <h1 class="text-sm font-semibold text-white">{{ title }}</h1>
      <p class="text-xs text-gray-500">{{ subtitle }}</p>
    </div>
    <div class="flex items-center gap-3">
      <!-- Canlı durum -->
      <div class="flex items-center gap-1.5 text-xs text-green-400">
        <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
        Sistem Aktif
      </div>
      <!-- Saat -->
      <div class="text-xs text-gray-500 font-mono">{{ currentTime }}</div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentTime = ref('')

const pageMeta = {
  '/':       { title: 'Dashboard',      subtitle: 'Gelir ve kullanım özeti' },
  '/users':  { title: 'Kullanıcılar',   subtitle: 'Kullanıcı yönetimi' },
  '/jobs':   { title: 'Job Monitörü',   subtitle: 'Aktif ve tamamlanan işler' },
  '/system': { title: 'Sistem Sağlığı', subtitle: 'Sunucu ve servis durumu' }
}

const title    = computed(() => pageMeta[route.path]?.title    ?? 'Admin')
const subtitle = computed(() => pageMeta[route.path]?.subtitle ?? '')

let timer
function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

onMounted(() => { updateTime(); timer = setInterval(updateTime, 1000) })
onUnmounted(() => clearInterval(timer))
</script>
