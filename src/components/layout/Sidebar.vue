<template>
  <aside class="fixed inset-y-0 left-0 z-50 w-60 bg-gray-900 border-r border-gray-800 flex flex-col">
    <!-- Logo -->
    <div class="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
      <div class="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
      <div>
        <div class="text-white font-semibold text-sm">Speeko</div>
        <div class="text-gray-500 text-xs">Admin Panel</div>
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group"
        :class="isActive(item.path)
          ? 'bg-brand-500/10 text-brand-400 font-medium'
          : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'"
      >
        <component :is="item.icon" class="w-4 h-4 flex-shrink-0" />
        <span>{{ item.label }}</span>
        <span
          v-if="item.badge"
          class="ml-auto text-xs px-1.5 py-0.5 rounded-full"
          :class="item.badgeType === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-gray-700 text-gray-300'"
        >{{ item.badge }}</span>
      </router-link>
    </nav>

    <!-- Footer -->
    <div class="px-4 py-4 border-t border-gray-800">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium text-gray-300">A</div>
        <div class="flex-1 min-w-0">
          <div class="text-sm text-gray-200 truncate">Admin</div>
          <div class="text-xs text-gray-500">admin.speeko.io</div>
        </div>
        <div class="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { jobs } from '@/data/mock.js'

const route = useRoute()

function isActive(path) {
  return path === '/' ? route.path === '/' : route.path.startsWith(path)
}

// Inline SVG icon components
const IconDashboard = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>`
}
const IconUsers = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
    <path stroke-linecap="round" stroke-linejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/><path stroke-linecap="round" stroke-linejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>`
}
const IconJobs = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
  </svg>`
}
const IconSystem = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
    <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7"/>
  </svg>`
}

const activeJobCount = computed(() => jobs.filter(j => j.status === 'processing').length)

const navItems = computed(() => [
  { path: '/',       label: 'Dashboard',    icon: IconDashboard },
  { path: '/users',  label: 'Kullanıcılar', icon: IconUsers },
  { path: '/jobs',   label: 'Job Monitörü', icon: IconJobs,
    badge: activeJobCount.value > 0 ? String(activeJobCount.value) : null, badgeType: 'normal' },
  { path: '/system', label: 'Sistem Sağlığı', icon: IconSystem }
])
</script>
