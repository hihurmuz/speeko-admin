<template>
  <div class="space-y-4">

    <!-- Üst bar: arama + filtreler -->
    <div class="flex items-center gap-3 flex-wrap">
      <div class="relative flex-1 min-w-60">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="11" cy="11" r="8"/><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35"/>
        </svg>
        <input v-model="search" type="text" placeholder="Email veya isim ara..."
          class="input w-full pl-9" />
      </div>

      <div class="flex gap-2">
        <button
          v-for="f in filters" :key="f.key"
          @click="activeFilter = f.key"
          class="text-xs px-3 py-2 rounded-lg border transition-colors"
          :class="activeFilter === f.key
            ? 'bg-brand-500/10 border-brand-500/30 text-brand-400'
            : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-gray-200'">
          {{ f.label }}
          <span class="ml-1 text-gray-600">{{ f.count }}</span>
        </button>
      </div>
    </div>

    <!-- Tablo -->
    <div class="card overflow-hidden p-0">
      <table class="w-full">
        <thead>
          <tr class="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-800 bg-gray-900/50">
            <th class="text-left px-5 py-3 font-medium">Kullanıcı</th>
            <th class="text-left px-5 py-3 font-medium">Durum</th>
            <th class="text-right px-5 py-3 font-medium">Kredi</th>
            <th class="text-right px-5 py-3 font-medium">Toplam Harcama</th>
            <th class="text-right px-5 py-3 font-medium">Son Görülme</th>
            <th class="text-right px-5 py-3 font-medium">İşlem</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id"
            class="border-b border-gray-800 hover:bg-gray-800/40 transition-colors">
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-300 flex-shrink-0">
                  {{ user.name[0] }}
                </div>
                <div>
                  <div class="text-sm text-gray-100 font-medium">{{ user.name }}</div>
                  <div class="text-xs text-gray-500">{{ user.email }}</div>
                </div>
                <div v-if="user.notes.length" class="w-1.5 h-1.5 bg-yellow-500 rounded-full" title="Not var"></div>
              </div>
            </td>
            <td class="px-5 py-3.5">
              <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                :class="statusClass(user.status)">
                {{ statusLabel(user.status) }}
              </span>
            </td>
            <td class="px-5 py-3.5 text-right text-sm font-mono"
              :class="user.credit < 5 ? 'text-orange-400' : 'text-gray-200'">
              ${{ user.credit.toFixed(2) }}
            </td>
            <td class="px-5 py-3.5 text-right text-sm text-gray-300 font-mono">
              ${{ user.totalSpent.toFixed(2) }}
            </td>
            <td class="px-5 py-3.5 text-right text-xs text-gray-500">{{ user.lastSeen }}</td>
            <td class="px-5 py-3.5 text-right">
              <div class="flex items-center justify-end gap-2">
                <button @click="openCredit(user)"
                  class="text-xs px-2.5 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors">
                  Kredi
                </button>
                <button @click="openNote(user)"
                  class="text-xs px-2.5 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors">
                  Not
                </button>
                <button
                  @click="toggleBan(user)"
                  class="text-xs px-2.5 py-1.5 rounded-md transition-colors"
                  :class="user.status === 'banned'
                    ? 'bg-green-900/40 hover:bg-green-900/60 text-green-400'
                    : 'bg-red-900/30 hover:bg-red-900/50 text-red-400'">
                  {{ user.status === 'banned' ? 'Aç' : 'Ban' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredUsers.length === 0" class="py-12 text-center text-gray-600 text-sm">
        Kullanıcı bulunamadı
      </div>
    </div>

    <!-- Kredi Modal -->
    <Teleport to="body">
      <div v-if="creditModal.open" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="creditModal.open = false"></div>
        <div class="relative bg-gray-900 border border-gray-700 rounded-2xl p-6 w-96 shadow-2xl">
          <h3 class="text-white font-semibold mb-1">Kredi Düzenle</h3>
          <p class="text-xs text-gray-500 mb-5">{{ creditModal.user?.email }}</p>

          <div class="space-y-4">
            <div>
              <label class="block text-xs text-gray-400 mb-1.5">Mevcut Kredi</label>
              <div class="text-lg font-bold text-white font-mono">${{ creditModal.user?.credit.toFixed(2) }}</div>
            </div>
            <div>
              <label class="block text-xs text-gray-400 mb-1.5">İşlem</label>
              <div class="flex gap-2">
                <button @click="creditModal.action = 'add'"
                  class="flex-1 text-sm py-2 rounded-lg border transition-colors"
                  :class="creditModal.action === 'add'
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-gray-800 border-gray-700 text-gray-400'">
                  + Ekle
                </button>
                <button @click="creditModal.action = 'sub'"
                  class="flex-1 text-sm py-2 rounded-lg border transition-colors"
                  :class="creditModal.action === 'sub'
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : 'bg-gray-800 border-gray-700 text-gray-400'">
                  − Çıkar
                </button>
              </div>
            </div>
            <div>
              <label class="block text-xs text-gray-400 mb-1.5">Miktar (USD)</label>
              <input v-model.number="creditModal.amount" type="number" min="0.01" step="0.01" placeholder="0.00"
                class="input w-full font-mono" />
            </div>
          </div>

          <div class="flex gap-3 mt-6">
            <button @click="creditModal.open = false" class="btn-secondary flex-1">İptal</button>
            <button @click="applyCredit" class="btn-primary flex-1"
              :class="creditModal.action === 'sub' ? 'bg-red-600 hover:bg-red-700' : ''">
              Uygula
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Not Modal -->
    <Teleport to="body">
      <div v-if="noteModal.open" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="noteModal.open = false"></div>
        <div class="relative bg-gray-900 border border-gray-700 rounded-2xl p-6 w-[480px] shadow-2xl">
          <h3 class="text-white font-semibold mb-1">Destek Notları</h3>
          <p class="text-xs text-gray-500 mb-5">{{ noteModal.user?.email }}</p>

          <!-- Mevcut notlar -->
          <div v-if="noteModal.user?.notes.length" class="space-y-2 mb-4 max-h-48 overflow-y-auto">
            <div v-for="(note, i) in noteModal.user.notes" :key="i"
              class="flex items-start gap-2 bg-gray-800 rounded-lg px-3 py-2.5">
              <div class="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <p class="text-sm text-gray-300 flex-1">{{ note }}</p>
              <button @click="removeNote(i)" class="text-gray-600 hover:text-red-400 transition-colors ml-2">×</button>
            </div>
          </div>
          <p v-else class="text-sm text-gray-600 mb-4">Henüz not yok.</p>

          <!-- Yeni not -->
          <textarea v-model="noteModal.text" placeholder="Yeni not ekle..."
            class="input w-full h-20 resize-none" rows="3"></textarea>

          <div class="flex gap-3 mt-4">
            <button @click="noteModal.open = false" class="btn-secondary flex-1">Kapat</button>
            <button @click="addNote" :disabled="!noteModal.text.trim()" class="btn-primary flex-1 disabled:opacity-40">
              Not Ekle
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { users as mockUsers } from '@/data/mock.js'

const userList = reactive(mockUsers.map(u => ({ ...u, notes: [...u.notes] })))

const search      = ref('')
const activeFilter = ref('all')

const filters = computed(() => [
  { key: 'all',    label: 'Tümü',   count: userList.length },
  { key: 'active', label: 'Aktif',  count: userList.filter(u => u.status === 'active').length },
  { key: 'trial',  label: 'Trial',  count: userList.filter(u => u.status === 'trial').length },
  { key: 'banned', label: 'Banlı',  count: userList.filter(u => u.status === 'banned').length }
])

const filteredUsers = computed(() => {
  let list = userList
  if (activeFilter.value !== 'all') list = list.filter(u => u.status === activeFilter.value)
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(u => u.email.toLowerCase().includes(q) || u.name.toLowerCase().includes(q))
  }
  return list
})

function statusClass(s) {
  return {
    active: 'bg-green-500/10 text-green-400',
    trial:  'bg-blue-500/10 text-blue-400',
    banned: 'bg-red-500/10 text-red-400'
  }[s] ?? 'bg-gray-700 text-gray-400'
}
function statusLabel(s) {
  return { active: 'Aktif', trial: 'Trial', banned: 'Banlı' }[s] ?? s
}

function toggleBan(user) {
  const u = userList.find(x => x.id === user.id)
  if (u) u.status = u.status === 'banned' ? 'active' : 'banned'
}

// Kredi Modal
const creditModal = reactive({ open: false, user: null, action: 'add', amount: '' })
function openCredit(user) {
  creditModal.user   = userList.find(u => u.id === user.id)
  creditModal.action = 'add'
  creditModal.amount = ''
  creditModal.open   = true
}
function applyCredit() {
  const amt = parseFloat(creditModal.amount)
  if (!amt || amt <= 0) return
  if (creditModal.action === 'add') creditModal.user.credit += amt
  else creditModal.user.credit = Math.max(0, creditModal.user.credit - amt)
  creditModal.open = false
}

// Not Modal
const noteModal = reactive({ open: false, user: null, text: '' })
function openNote(user) {
  noteModal.user = userList.find(u => u.id === user.id)
  noteModal.text = ''
  noteModal.open = true
}
function addNote() {
  if (!noteModal.text.trim()) return
  noteModal.user.notes.push(noteModal.text.trim())
  noteModal.text = ''
}
function removeNote(i) {
  noteModal.user.notes.splice(i, 1)
}
</script>
