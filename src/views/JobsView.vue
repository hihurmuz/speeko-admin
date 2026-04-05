<template>
  <div class="space-y-4">

    <!-- Özet Kartlar -->
    <div class="grid grid-cols-4 gap-4">
      <div class="card">
        <p class="text-xs text-gray-500 mb-1">Aktif</p>
        <p class="text-2xl font-bold text-white">{{ activeCnt }}</p>
        <div class="mt-2 flex gap-1">
          <span v-for="_ in activeCnt" :key="_"
            class="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse"></span>
        </div>
      </div>
      <div class="card">
        <p class="text-xs text-gray-500 mb-1">Kuyrukta</p>
        <p class="text-2xl font-bold text-white">{{ queueCnt }}</p>
        <p class="text-xs text-gray-600 mt-2">Bekliyor</p>
      </div>
      <div class="card">
        <p class="text-xs text-gray-500 mb-1">Tamamlanan (bugün)</p>
        <p class="text-2xl font-bold text-white">{{ completedCnt }}</p>
        <p class="text-xs text-gray-600 mt-2">Başarılı</p>
      </div>
      <div class="card">
        <p class="text-xs text-gray-500 mb-1">Hata</p>
        <p class="text-2xl font-bold text-red-400">{{ errorCnt }}</p>
        <p class="text-xs text-gray-600 mt-2">Başarısız</p>
      </div>
    </div>

    <!-- Filtreler -->
    <div class="flex items-center gap-2">
      <button v-for="f in statusFilters" :key="f.key"
        @click="activeFilter = f.key"
        class="text-xs px-3 py-2 rounded-lg border transition-colors"
        :class="activeFilter === f.key
          ? 'bg-brand-500/10 border-brand-500/30 text-brand-400'
          : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-gray-200'">
        {{ f.label }}
      </button>
      <button @click="refresh" class="ml-auto text-xs px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors flex items-center gap-1.5">
        <svg class="w-3 h-3" :class="refreshing ? 'animate-spin' : ''" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        Yenile
      </button>
    </div>

    <!-- Job Tablosu -->
    <div class="card overflow-hidden p-0">
      <table class="w-full">
        <thead>
          <tr class="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-800 bg-gray-900/50">
            <th class="text-left px-5 py-3 font-medium">Job ID</th>
            <th class="text-left px-5 py-3 font-medium">Tür</th>
            <th class="text-left px-5 py-3 font-medium">Kullanıcı</th>
            <th class="text-left px-5 py-3 font-medium">Durum</th>
            <th class="text-right px-5 py-3 font-medium">Boyut</th>
            <th class="text-right px-5 py-3 font-medium">Süre</th>
            <th class="text-right px-5 py-3 font-medium">Başlangıç</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="job in filteredJobs" :key="job.id">
            <tr class="border-b border-gray-800 hover:bg-gray-800/40 transition-colors cursor-pointer"
              @click="toggleExpand(job.id)">
              <td class="px-5 py-3.5">
                <span class="text-xs font-mono text-gray-400">{{ job.id }}</span>
              </td>
              <td class="px-5 py-3.5">
                <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                  :class="job.type === 'TTS' ? 'bg-brand-500/10 text-brand-400' : 'bg-purple-500/10 text-purple-400'">
                  {{ job.type }}
                </span>
              </td>
              <td class="px-5 py-3.5 text-sm text-gray-300">{{ job.user }}</td>
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    :class="dotClass(job.status)"></span>
                  <span class="text-xs font-medium" :class="statusTextClass(job.status)">
                    {{ statusLabel(job.status) }}
                  </span>
                  <span v-if="job.status === 'processing'" class="text-xs text-gray-600">
                    Sıra: #{{ job.queue }}
                  </span>
                </div>
              </td>
              <td class="px-5 py-3.5 text-right text-xs font-mono text-gray-500">
                {{ (job.chars / 1000).toFixed(1) }}K kar.
              </td>
              <td class="px-5 py-3.5 text-right text-xs font-mono text-gray-500">
                {{ job.duration ?? '—' }}
              </td>
              <td class="px-5 py-3.5 text-right text-xs text-gray-600">{{ job.started }}</td>
            </tr>
            <!-- Hata detay satırı -->
            <tr v-if="job.status === 'error' && expandedId === job.id"
              class="bg-red-950/20 border-b border-red-900/20">
              <td colspan="7" class="px-5 py-3">
                <div class="flex items-start gap-2">
                  <svg class="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span class="text-xs text-red-300">{{ job.error }}</span>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <div v-if="filteredJobs.length === 0" class="py-12 text-center text-gray-600 text-sm">
        Bu filtrede job bulunamadı
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { jobs as mockJobs } from '@/data/mock.js'

const jobList     = ref([...mockJobs])
const activeFilter = ref('all')
const expandedId  = ref(null)
const refreshing  = ref(false)

const statusFilters = [
  { key: 'all',        label: 'Tümü' },
  { key: 'processing', label: 'İşleniyor' },
  { key: 'completed',  label: 'Tamamlanan' },
  { key: 'error',      label: 'Hata' }
]

const filteredJobs = computed(() => {
  if (activeFilter.value === 'all') return jobList.value
  return jobList.value.filter(j => j.status === activeFilter.value)
})

const activeCnt    = computed(() => jobList.value.filter(j => j.status === 'processing').length)
const queueCnt     = computed(() => jobList.value.filter(j => j.queue != null).length)
const completedCnt = computed(() => jobList.value.filter(j => j.status === 'completed').length)
const errorCnt     = computed(() => jobList.value.filter(j => j.status === 'error').length)

function toggleExpand(id) {
  expandedId.value = expandedId.value === id ? null : id
}

function dotClass(s) {
  return {
    processing: 'bg-brand-500 animate-pulse',
    completed:  'bg-green-500',
    error:      'bg-red-500'
  }[s] ?? 'bg-gray-500'
}
function statusTextClass(s) {
  return {
    processing: 'text-brand-400',
    completed:  'text-green-400',
    error:      'text-red-400'
  }[s] ?? 'text-gray-400'
}
function statusLabel(s) {
  return { processing: 'İşleniyor', completed: 'Tamamlandı', error: 'Hata' }[s] ?? s
}

async function refresh() {
  refreshing.value = true
  await new Promise(r => setTimeout(r, 800))
  refreshing.value = false
}
</script>
