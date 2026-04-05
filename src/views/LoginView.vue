<template>
  <div class="min-h-screen bg-gray-950 flex items-center justify-center p-4">
    <div class="w-full max-w-sm">

      <!-- Logo -->
      <div class="flex items-center gap-3 justify-center mb-8">
        <div class="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">S</div>
        <div>
          <div class="text-white font-semibold">Speeko</div>
          <div class="text-gray-500 text-xs">Admin Panel</div>
        </div>
      </div>

      <!-- Kart -->
      <div class="card">
        <h2 class="text-white font-semibold text-lg mb-1">Giriş Yap</h2>
        <p class="text-gray-500 text-sm mb-6">Yetkili erişim gerekli</p>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-xs text-gray-400 mb-1.5">Admin Şifresi</label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="input w-full"
              autocomplete="current-password"
              :disabled="loading"
              required
            />
          </div>

          <div v-if="error" class="flex items-center gap-2 bg-red-950/40 border border-red-900/40 rounded-lg px-3 py-2.5">
            <svg class="w-4 h-4 text-red-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span class="text-sm text-red-400">{{ error }}</span>
          </div>

          <button type="submit" class="btn-primary w-full py-2.5 flex items-center justify-center gap-2" :disabled="loading">
            <svg v-if="loading" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            {{ loading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
          </button>
        </form>
      </div>

      <p class="text-center text-xs text-gray-700 mt-6">admin.speeko.io</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router   = useRouter()
const password = ref('')
const loading  = ref(false)
const error    = ref('')

async function handleLogin() {
  error.value   = ''
  loading.value = true

  // Gerçek API hazır olunca:
  // const { token } = await login(password.value)
  // localStorage.setItem('admin_token', token)

  // Şimdilik: .env'deki VITE_ADMIN_SECRET ile karşılaştır
  await new Promise(r => setTimeout(r, 600))
  const secret = import.meta.env.VITE_ADMIN_SECRET ?? 'admin'

  if (password.value === secret) {
    localStorage.setItem('admin_token', 'mock_token')
    router.push('/')
  } else {
    error.value = 'Şifre hatalı'
  }

  loading.value = false
}
</script>
