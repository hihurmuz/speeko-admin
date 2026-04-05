// Tüm API istekleri buradan geçer.
// VITE_API_BASE_URL .env'den okunur, yoksa localhost'a düşer.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

async function request(path, options = {}) {
  const token = localStorage.getItem('admin_token')

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    },
    ...options
  })

  if (res.status === 401) {
    localStorage.removeItem('admin_token')
    window.location.href = '/login'
    return
  }

  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const api = {
  get:    (path)         => request(path),
  post:   (path, body)   => request(path, { method: 'POST',   body: JSON.stringify(body) }),
  patch:  (path, body)   => request(path, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete: (path)         => request(path, { method: 'DELETE' })
}
