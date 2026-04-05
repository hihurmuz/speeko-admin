<template>
  <div class="space-y-6">

    <!-- Özet Kartlar -->
    <div class="grid grid-cols-4 gap-4">
      <div class="card">
        <p class="text-xs text-gray-500 mb-1">Uptime</p>
        <p class="text-sm font-semibold text-white">{{ metrics.uptime }}</p>
        <div class="flex items-center gap-1.5 mt-2">
          <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          <span class="text-xs text-green-400">Çalışıyor</span>
        </div>
      </div>
      <div class="card">
        <p class="text-xs text-gray-500 mb-1">Aktif Job</p>
        <p class="text-2xl font-bold text-white">{{ metrics.activeJobs }}</p>
        <p class="text-xs text-gray-600 mt-2">Kuyrukta: {{ metrics.queuedJobs }}</p>
      </div>
      <div class="card">
        <p class="text-xs text-gray-500 mb-1">Bugün Tamamlanan</p>
        <p class="text-2xl font-bold text-white">{{ metrics.completedToday }}</p>
        <p class="text-xs text-gray-600 mt-2">Hata: {{ metrics.errorsToday }}</p>
      </div>
      <div class="card">
        <p class="text-xs text-gray-500 mb-1">API Latency</p>
        <p class="text-2xl font-bold text-white">{{ metrics.apiLatency }} <span class="text-sm font-normal text-gray-500">ms</span></p>
        <p class="text-xs text-green-400 mt-2">Normal</p>
      </div>
    </div>

    <!-- Kaynak Kullanımı -->
    <div class="grid grid-cols-3 gap-4">

      <!-- CPU -->
      <div class="card">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm font-medium text-white">CPU</p>
          <p class="text-sm font-bold" :class="gaugeColor(metrics.cpu)">{{ metrics.cpu }}%</p>
        </div>
        <div class="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-500"
            :class="gaugeBarColor(metrics.cpu)"
            :style="`width: ${metrics.cpu}%`"></div>
        </div>
        <p class="text-xs text-gray-600 mt-2">4 vCPU — CX32</p>
      </div>

      <!-- RAM -->
      <div class="card">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm font-medium text-white">RAM</p>
          <p class="text-sm font-bold" :class="gaugeColor(metrics.ram)">{{ metrics.ram }}%</p>
        </div>
        <div class="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-500"
            :class="gaugeBarColor(metrics.ram)"
            :style="`width: ${metrics.ram}%`"></div>
        </div>
        <p class="text-xs text-gray-600 mt-2">8 GB — {{ (8 * metrics.ram / 100).toFixed(1) }} GB kullanımda</p>
      </div>

      <!-- Disk -->
      <div class="card">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm font-medium text-white">Disk</p>
          <p class="text-sm font-bold" :class="gaugeColor(metrics.disk)">{{ metrics.disk }}%</p>
        </div>
        <div class="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-500"
            :class="gaugeBarColor(metrics.disk)"
            :style="`width: ${metrics.disk}%`"></div>
        </div>
        <p class="text-xs text-gray-600 mt-2">80 GB — {{ (80 * metrics.disk / 100).toFixed(0) }} GB kullanımda</p>
      </div>
    </div>

    <!-- Servisler -->
    <div class="card">
      <h3 class="text-sm font-semibold text-white mb-4">Servis Durumları</h3>
      <div class="space-y-3">
        <div v-for="svc in metrics.services" :key="svc.name"
          class="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
          <div class="flex items-center gap-3">
            <span class="w-2 h-2 rounded-full flex-shrink-0"
              :class="svc.status === 'up' ? 'bg-green-500' : 'bg-red-500'"></span>
            <span class="text-sm text-gray-200">{{ svc.name }}</span>
          </div>
          <div class="flex items-center gap-6">
            <span v-if="svc.latency != null" class="text-xs font-mono text-gray-500">
              {{ svc.latency }} ms
            </span>
            <span class="text-xs font-medium px-2 py-0.5 rounded-full"
              :class="svc.status === 'up'
                ? 'bg-green-500/10 text-green-400'
                : 'bg-red-500/10 text-red-400'">
              {{ svc.status === 'up' ? 'Çalışıyor' : 'Çöktü' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Sunucu Bilgisi -->
    <div class="card">
      <h3 class="text-sm font-semibold text-white mb-4">Sunucu Bilgisi</h3>
      <div class="grid grid-cols-3 gap-4">
        <div v-for="info in serverInfo" :key="info.label">
          <p class="text-xs text-gray-500 mb-1">{{ info.label }}</p>
          <p class="text-sm text-gray-200 font-medium">{{ info.value }}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { systemMetrics } from '@/data/mock.js'

const metrics = systemMetrics

function gaugeColor(pct) {
  if (pct >= 80) return 'text-red-400'
  if (pct >= 60) return 'text-yellow-400'
  return 'text-green-400'
}
function gaugeBarColor(pct) {
  if (pct >= 80) return 'bg-red-500'
  if (pct >= 60) return 'bg-yellow-500'
  return 'bg-green-500'
}

const serverInfo = [
  { label: 'Sunucu',       value: 'Hetzner CX32' },
  { label: 'Lokasyon',     value: 'Nuremberg, DE' },
  { label: 'İşletim Sistemi', value: 'Ubuntu 24.04 LTS' },
  { label: 'IP',           value: '65.21.xxx.xxx' },
  { label: 'Docker',       value: '24.0.7' },
  { label: 'Python',       value: '3.11.6' },
  { label: 'FastAPI',      value: '0.104.1' },
  { label: 'PostgreSQL',   value: '16.1' },
  { label: 'Redis',        value: '7.2.3' }
]
</script>
