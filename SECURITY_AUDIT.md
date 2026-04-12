# Speeko Admin — Güvenlik Denetim Raporu

**Tarih:** 9 Nisan 2026  
**Denetçi:** Claude Code (Otomatik Analiz)  
**Proje:** speeko-admin (Vue 3 + Vite)

---

## Özet

| Severity | Adet |
|----------|------|
| CRITICAL | 1 |
| HIGH | 5 |
| MEDIUM | 8 |
| **Toplam** | **14** |

---

## 1. Client-Side Credential Validation — CRITICAL

**Dosya:** `src/views/LoginView.vue` (satır ~74)

```javascript
const secret = import.meta.env.VITE_ADMIN_SECRET ?? 'admin'
if (password.value === secret) {
  localStorage.setItem('admin_token', 'mock_token')
  router.push('/')
}
```

**Sorun:**
- Şifre doğrulaması tamamen tarayıcıda (client-side) yapılıyor.
- DevTools → Sources veya Network sekmesinden `VITE_ADMIN_SECRET` değeri okunabilir.
- Fallback değer `'admin'` olarak hardcoded.
- Oluşturulan token `'mock_token'` — tüm kullanıcılar aynı token.

**Öneri:** Kimlik doğrulama tamamen backend'e taşınmalı. Frontend yalnızca backend'den dönen JWT/session token'ı saklamalı.

---

## 2. Hardcoded Fallback Secret — HIGH

**Dosya:** `src/views/LoginView.vue` (satır ~74)

```javascript
const secret = import.meta.env.VITE_ADMIN_SECRET ?? 'admin'
```

**Sorun:** Ortam değişkeni tanımlı değilse şifre `'admin'` olarak varsayılıyor.

**Öneri:** Ortam değişkeni yoksa uygulamanın başlatılmasını engelleyin:

```javascript
const secret = import.meta.env.VITE_ADMIN_SECRET
if (!secret) throw new Error('VITE_ADMIN_SECRET is not set')
```

---

## 3. Zayıf Router Auth Guard — HIGH

**Dosya:** `src/router/index.js` (satır ~20-24)

```javascript
router.beforeEach((to) => {
  const isLoggedIn = !!localStorage.getItem('admin_token')
  if (!to.meta.public && !isLoggedIn) return { name: 'login' }
})
```

**Sorun:**
- Token'ın varlığı kontrol ediliyor, geçerliliği değil.
- Süre dolmuş veya sahte bir token ile giriş yapılabilir.
- `localStorage.setItem('admin_token', 'anything')` komutuyla route bypass mümkün.

**Öneri:** Token doğrulaması backend'de yapılmalı; her sayfa yüklemesinde `/admin/me` gibi bir endpoint çağrılarak token geçerliliği doğrulanmalı.

---

## 4. Token localStorage'da Saklanıyor — HIGH

**Dosya:** `src/api/client.js` (satır ~6)

```javascript
const token = localStorage.getItem('admin_token')
```

**Sorun:** localStorage, XSS saldırılarına karşı korumasızdır. Tek bir XSS açığı tüm admin token'ını ele geçirebilir.

**Öneri:** Token'lar `httpOnly` cookie ile saklanmalı (backend tarafından set edilmeli). Bu, JavaScript'in token'a erişmesini engeller.

---

## 5. HTTP Kullanımı / HTTPS Zorunlu Değil — HIGH

**Dosya:** `src/api/client.js` (satır ~3)

```javascript
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'
```

**Sorun:** Fallback URL `http://` ile başlıyor. Production'da da HTTP kullanılırsa Man-in-the-Middle (MITM) saldırısına açık olunur; token ve veri düz metin olarak iletilir.

**Öneri:**

```javascript
const BASE_URL = import.meta.env.VITE_API_BASE_URL
if (!BASE_URL) throw new Error('VITE_API_BASE_URL must be set')
// Production build'de HTTPS zorunlu olmalı
```

---

## 6. Güvenlik Header'ları Eksik — HIGH

**Sorun:** Aşağıdaki kritik HTTP güvenlik header'ları uygulanmıyor:

| Header | Risk |
|--------|------|
| `Content-Security-Policy` | XSS, injection |
| `X-Frame-Options` | Clickjacking |
| `X-Content-Type-Options` | MIME sniffing |
| `Strict-Transport-Security` | HTTPS zorunu |

**Öneri (Nginx örneği):**
```nginx
add_header X-Frame-Options "DENY";
add_header X-Content-Type-Options "nosniff";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'";
```

---

## 7. Session Yönetimi Eksiklikleri — HIGH

**Dosya:** `src/views/LoginView.vue` (satır ~77)

```javascript
localStorage.setItem('admin_token', 'mock_token')
```

**Sorun:**
- Token'ın son kullanma süresi (expiry) yok.
- Oturum zaman aşımı (idle timeout) yok.
- Token yenileme (refresh) mekanizması yok.
- Çoklu cihaz oturumu yönetimi yok.

**Öneri:** JWT token'da `exp` claim'i kullanılmalı, her talep öncesi token geçerlilik süresi kontrol edilmeli.

---

## 8. Güvenlik Açığı Olan Bağımlılık (esbuild/Vite) — MEDIUM

**`npm audit` çıktısı:**

```
esbuild <=0.24.2  —  Moderate
  Dev server'a cross-origin istek gönderilmesine izin veriyor.
  https://github.com/advisories/GHSA-67mh-4wv8-2f99
Etkilenen: vite <=6.4.1
```

**Öneri:**
```bash
npm update vite esbuild
# veya
npm audit fix --force
```

---

## 9. Altyapı Bilgilerinin İfşası — MEDIUM

**Dosya:** `src/views/SystemView.vue` (satır ~133-143)

```javascript
const serverInfo = [
  { label: 'IP',         value: '65.21.xxx.xxx' },
  { label: 'Sunucu',     value: 'Hetzner CX32' },
  { label: 'PostgreSQL', value: '16.1' },
  { label: 'Redis',      value: '7.2.3' }
]
```

**Sorun:** Sunucu IP adresi (kısmi), hosting sağlayıcı, veritabanı versiyonları ve teknoloji stack'i frontend kaynak kodunda görünür. Saldırgan bu bilgileri hedefli saldırı için kullanabilir.

**Öneri:** Bu bilgiler yalnızca backend API üzerinden ve yetkilendirilmiş sorgulara döndürülmeli; frontend bundle'a gömülmemeli.

---

## 10. Hassas Veriler Mock Dosyasında — MEDIUM

**Dosya:** `src/data/mock.js` (satır ~33-39, 82)

```javascript
{ id: 'txn_001', user: 'alex@devtools.io', amount: 4.20 }
notes: ['API abuse — kart fraud tespit edildi, ban uygulandı']
```

**Sorun:** Gerçek görünen kullanıcı e-postaları, işlem ID'leri, tutarlar ve support notları kaynak kodunda bulunuyor. Gerçek veri ise özellikle riskli; production'a taşınmamalı.

**Öneri:** Mock veriler tamamen uydurma olmalı (örn. `user@example.com`). Support notları gibi hassas veriler hiçbir zaman frontend koduna gömülmemeli.

---

## 11. Broken Object Level Authorization (BOLA/IDOR) Riski — MEDIUM

**Dosya:** `src/api/index.js` (satır ~16-22)

```javascript
export const banUser    = (id) => api.patch(`/admin/users/${id}/ban`)
export const addCredit  = (id, amt) => api.post(`/admin/users/${id}/credit`, ...)
export const deleteNote = (id, idx) => api.delete(`/admin/users/${id}/notes/${idx}`)
```

**Sorun:** User ID doğrudan URL'ye yerleştiriliyor. Backend'de her endpoint'in admin yetkilendirmesini kontrol etmesi şart; aksi takdirde ID tahminiyle başka kullanıcıların verilerine erişilebilir.

**Öneri:** Backend'de her `/admin/*` endpoint'i token'dan admin rolü doğrulamalı. Frontend'de de girdi validasyonu eklenmeli.

---

## 12. XSS Riski (Kullanıcı Girdisi Render) — MEDIUM

**Dosya:** `src/views/UsersView.vue` (satır ~51-52, 162)

```vue
<div>{{ user.name }}</div>
<p>{{ note }}</p>
```

**Sorun:** Vue'nun `{{ }}` interpolasyonu varsayılan olarak escape eder; ancak backend veri sanitizasyonu yapmazsa veya `v-html` kullanılırsa XSS riski doğar.

**Öneri:** Backend tüm kullanıcı girdilerini sanitize etmeli. `v-html` direktifi kullanılmamalı. Gerekirse `DOMPurify` kütüphanesi eklenebilir.

---

## 13. CSRF Koruması Yok — MEDIUM

**Dosya:** `src/api/client.js`

**Sorun:** API isteklerinde CSRF token gönderilmiyor. Eğer kimlik doğrulama cookie tabanlıya geçerse CSRF saldırıları mümkün olur.

**Öneri:** Backend'den CSRF token alınmalı ve her state-changing isteğe (`POST`, `PATCH`, `DELETE`) eklenmeli.

---

## 14. 401 Sonrası Güvensiz Yönlendirme — MEDIUM

**Dosya:** `src/api/client.js` (satır ~19)

```javascript
window.location.href = '/login'
```

**Sorun:** `window.location.href` ile yapılan yönlendirme, Vue Router guard'larını bypass edebilir ve uygulama state'ini temizlemez (timer'lar, event listener'lar aktif kalabilir).

**Öneri:**
```javascript
// Router instance kullanılmalı
await router.push({ name: 'login' })
// State temizleme
localStorage.removeItem('admin_token')
```

---

## Acil Aksiyon Planı

### Hemen (Bu Gün)
- [ ] Client-side credential validation kaldır, backend auth yaz
- [ ] Hardcoded `'admin'` fallback'i kaldır
- [ ] `npm audit fix --force` çalıştır
- [ ] `http://` fallback'i kaldır, HTTPS zorunlu hale getir

### Bu Hafta
- [ ] JWT tabanlı authentication implementasyonu
- [ ] `httpOnly` cookie ile token yönetimi
- [ ] Güvenlik header'larını nginx/sunucu seviyesinde ekle
- [ ] CSRF koruması ekle

### Bu Sprint
- [ ] Token yenileme (refresh) mekanizması
- [ ] Oturum zaman aşımı (idle timeout)
- [ ] Backend authorization check'leri tüm `/admin/*` endpoint'lerde
- [ ] Proper error logging (Sentry vb.)

### Backlog
- [ ] Rate limiting (brute-force koruması)
- [ ] Tüm admin aksiyonları için audit log
- [ ] İki faktörlü kimlik doğrulama (2FA)
- [ ] Penetrasyon testi (professional)

---

*Bu rapor otomatik statik analiz ile oluşturulmuştur. Manuel penetrasyon testi ile tamamlanması önerilir.*
