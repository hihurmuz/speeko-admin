<template>
  <div class="space-y-6">

    <!-- Stat Kartlar -->
    <div class="grid grid-cols-4 gap-4">
      <div class="card">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">MRR</p>
            <p class="text-2xl font-bold text-white">${{ fmt(stats.mrr) }}</p>
          </div>
          <span class="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-medium mt-1">
            +{{ stats.mrrGrowth }}%
          </span>
        </div>
        <p class="text-xs text-gray-600 mt-2">Monthly Recurring Revenue</p>
      </div>

      <div class="card">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">ARR</p>
            <p class="text-2xl font-bold text-white">${{ fmt(stats.arr) }}</p>
          </div>
          <span class="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-medium mt-1">
            +{{ stats.arrGrowth }}%
          </span>
        </div>
        <p class="text-xs text-gray-600 mt-2">Annual Recurring Revenue</p>
      </div>

      <div class="card">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Aktif Kullanıcı</p>
            <p class="text-2xl font-bold text-white">{{ stats.activeUsers }}</p>
          </div>
          <span class="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-medium mt-1">
            +{{ stats.newUsersThisMonth }} bu ay
          </span>
        </div>
        <p class="text-xs text-gray-600 mt-2">Churn: {{ stats.churnRate }}%</p>
      </div>

      <div class="card">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Toplam Gelir</p>
            <p class="text-2xl font-bold text-white">${{ fmt(stats.totalRevenue) }}</p>
          </div>
        </div>
        <p class="text-xs text-gray-600 mt-2">Tüm zamanlar</p>
      </div>
    </div>

    <!-- Grafik + Pasta -->
    <div class="grid grid-cols-3 gap-4">

      <!-- Günlük Gelir Grafiği -->
      <div class="card col-span-2">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-white">Günlük Gelir (Son 11 Gün)</h3>
          <span class="text-xs text-gray-500">USD</span>
        </div>
        <div class="relative h-48">
          <svg viewBox="0 0 500 160" class="w-full h-full" preserveAspectRatio="none">
            <!-- Grid lines -->
            <line v-for="y in [0,40,80,120,160]" :key="y" x1="0" :y1="y" x2="500" :y2="y"
              stroke="#1f2937" stroke-width="1"/>
            <!-- Area fill -->
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#4f6ef7" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="#4f6ef7" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <path :d="areaPath" fill="url(#chartGrad)"/>
            <!-- Line -->
            <polyline :points="linePoints" fill="none" stroke="#4f6ef7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <!-- Dots -->
            <circle v-for="(p, i) in chartPoints" :key="i" :cx="p.x" :cy="p.y" r="3"
              fill="#4f6ef7" stroke="#0d1117" stroke-width="2"/>
          </svg>
          <!-- X labels -->
          <div class="flex justify-between px-1 mt-1">
            <span v-for="(d, i) in dailyRevenue" :key="i"
              class="text-[10px] text-gray-600"
              :class="i % 2 === 0 ? '' : 'invisible'">
              {{ d.date }}
            </span>
          </div>
        </div>
      </div>

      <!-- TTS vs Video Pie -->
      <div class="card flex flex-col">
        <h3 class="text-sm font-semibold text-white mb-4">Gelir Dağılımı</h3>
        <div class="flex-1 flex flex-col items-center justify-center gap-4">
          <div class="relative w-32 h-32">
            <svg viewBox="0 0 36 36" class="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#1f2937" stroke-width="4"/>
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#4f6ef7" stroke-width="4"
                :stroke-dasharray="`${ttsPercent} ${100 - ttsPercent}`" stroke-dashoffset="0"/>
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#10b981" stroke-width="4"
                :stroke-dasharray="`${videoPercent} ${100 - videoPercent}`"
                :stroke-dashoffset="`${-(ttsPercent)}`"/>
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <div class="text-base font-bold text-white">${{ fmt(stats.mrr) }}</div>
                <div class="text-[10px] text-gray-500">MRR</div>
              </div>
            </div>
          </div>
          <div class="space-y-2 w-full">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full bg-brand-500"></div>
                <span class="text-xs text-gray-400">TTS</span>
              </div>
              <span class="text-xs font-medium text-white">${{ fmt(usage.ttsRevenue) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <span class="text-xs text-gray-400">Video</span>
              </div>
              <span class="text-xs font-medium text-white">${{ fmt(usage.videoRevenue) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Son İşlemler -->
    <div class="card">
      <h3 class="text-sm font-semibold text-white mb-4">Son İşlemler</h3>
      <table class="w-full">
        <thead>
          <tr class="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-800">
            <th class="text-left pb-3 font-medium">Kullanıcı</th>
            <th class="text-left pb-3 font-medium">Tür</th>
            <th class="text-left pb-3 font-medium">Kullanım</th>
            <th class="text-right pb-3 font-medium">Tutar</th>
            <th class="text-right pb-3 font-medium">Zaman</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tx in transactions" :key="tx.id" class="table-row">
            <td class="py-3 text-sm text-gray-200">{{ tx.user }}</td>
            <td class="py-3">
              <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                :class="tx.type === 'TTS' ? 'bg-brand-500/10 text-brand-400' : 'bg-emerald-500/10 text-emerald-400'">
                {{ tx.type }}
              </span>
            </td>
            <td class="py-3 text-xs text-gray-500 font-mono">
              {{ tx.type === 'TTS' ? fmtChars(tx.chars) : fmtSecs(tx.secs) }}
            </td>
            <td class="py-3 text-right text-sm font-medium text-white">${{ tx.amount.toFixed(2) }}</td>
            <td class="py-3 text-right text-xs text-gray-600">{{ tx.time }}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { revenueStats, dailyRevenue, usageBreakdown, recentTransactions } from '@/data/mock.js'

const stats        = revenueStats
const dailyRev     = dailyRevenue
const usage        = usageBreakdown
const transactions = recentTransactions

function fmt(n)       { return n.toLocaleString('en-US') }
function fmtChars(n)  { return (n / 1000).toFixed(0) + 'K kar.' }
function fmtSecs(n)   { return n + ' sn' }

// Pie chart percentages
const total      = computed(() => usage.ttsRevenue + usage.videoRevenue)
const ttsPercent   = computed(() => (usage.ttsRevenue / total.value) * 100)
const videoPercent = computed(() => (usage.videoRevenue / total.value) * 100)

// Line chart
const maxVal = computed(() => Math.max(...dailyRev.map(d => d.amount)))
const chartPoints = computed(() => {
  const W = 500, H = 140, pad = 10
  return dailyRev.map((d, i) => ({
    x: pad + (i / (dailyRev.length - 1)) * (W - pad * 2),
    y: H - (d.amount / maxVal.value) * (H - pad) - pad
  }))
})
const linePoints = computed(() => chartPoints.value.map(p => `${p.x},${p.y}`).join(' '))
const areaPath   = computed(() => {
  const pts = chartPoints.value
  const first = pts[0], last = pts[pts.length - 1]
  return `M${first.x},${first.y} ` + pts.slice(1).map(p => `L${p.x},${p.y}`).join(' ')
    + ` L${last.x},160 L${first.x},160 Z`
})
</script>
