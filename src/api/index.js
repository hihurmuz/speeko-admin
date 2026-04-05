// Gerçek API'ye geçince mock.js yerine bu dosyadaki fonksiyonlar kullanılır.
// Her view import'unu burada değiştirmek yeterli olur.
import { api } from './client.js'

// --- Auth ---
export const login = (password) =>
  api.post('/admin/login', { password })

// --- Dashboard ---
export const getStats        = () => api.get('/admin/stats')
export const getDailyRevenue = () => api.get('/admin/stats/daily')

// --- Kullanıcılar ---
export const getUsers        = ()          => api.get('/admin/users')
export const banUser         = (id)        => api.patch(`/admin/users/${id}/ban`)
export const unbanUser       = (id)        => api.patch(`/admin/users/${id}/unban`)
export const addCredit       = (id, amt)   => api.post(`/admin/users/${id}/credit`, { amount: amt })
export const subtractCredit  = (id, amt)   => api.post(`/admin/users/${id}/credit`, { amount: -amt })
export const addNote         = (id, note)  => api.post(`/admin/users/${id}/notes`, { note })
export const deleteNote      = (id, idx)   => api.delete(`/admin/users/${id}/notes/${idx}`)

// --- Jobs ---
export const getJobs         = () => api.get('/admin/jobs')

// --- Sistem ---
export const getSystemMetrics = () => api.get('/admin/system')
