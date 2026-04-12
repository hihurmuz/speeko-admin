# Speeko Admin — Kapsamlı Özellik Yol Haritası

> **Bağlam:** Speeko, TTS (Text-to-Speech) ve Video üretimi sunan bir SaaS platformu.  
> Ödeme modeli PAYG (pay-as-you-go), kullanıcılar kredi satın alıp harcıyor.  
> Backend: Python API + PostgreSQL + Redis + Kokoro Worker + ffmpeg Worker + Stripe.  
> Bu belge, admin panelinde olabilecek **her özelliği** kategoriler halinde listeler.

---

## İçindekiler

1. [Analitik & İş Zekası](#1-analitik--iş-zekası)
2. [Kullanıcı Yönetimi (Derinleştirilmiş)](#2-kullanıcı-yönetimi-derinleştirilmiş)
3. [Finansal Yönetim](#3-finansal-yönetim)
4. [Ürün & İçerik Yönetimi](#4-ürün--içerik-yönetimi)
5. [İletişim & Pazarlama](#5-i̇letişim--pazarlama)
6. [Altyapı & DevOps](#6-altyapı--devops)
7. [Destek & CRM](#7-destek--crm)
8. [Güvenlik & Uyumluluk](#8-güvenlik--uyumluluk)
9. [API & Geliştirici Araçları](#9-api--geliştirici-araçları)
10. [Raporlama & Dışa Aktarım](#10-raporlama--dışa-aktarım)
11. [Kalite & AI/ML İzleme](#11-kalite--aiml-i̇zleme)
12. [Entegrasyonlar](#12-entegrasyonlar)

---

## 1. Analitik & İş Zekası

### 1.1 Gelir Analitiği

| Özellik | Açıklama |
|---------|----------|
| **MRR / ARR takibi** | Mevcut. Ek olarak: geçmiş trendler, tahmin eğrisi |
| **Net Revenue Retention (NRR)** | Mevcut müşterilerin genişleme geliri − churn = NRR |
| **Expansion Revenue** | Kredi yenileyen kullanıcıların ek harcama trendi |
| **Gelir öngörü modeli** | Mevcut büyüme oranına göre 30/60/90 günlük tahmin |
| **Kullanım başı maliyet (Unit Economics)** | Her TTS karakteri ve video saniyesi için maliyet vs gelir kırılımı |
| **Gross Margin hesaplama** | Kokoro + ffmpeg + Hetzner + Stripe kesintisi çıkarıldıktan sonra kalan margin |
| **Fatura cirosu vs tahsilat farkı** | Stripe başarısız ödeme kaynaklı gelir kaybı |
| **Ülke / coğrafya bazında gelir** | Hangi ülkeden ne kadar gelir geliyor |
| **Günlük / saatlik gelir ısı haritası** | Haftanın hangi günü, günün hangi saati en yüksek gelir |
| **Gelir kaynağı kırılımı** | TTS vs Video — karakter bazında değil, gerçek karlılık bazında |
| **Mevsimsellik analizi** | Yıllık döngüler, kampanya etkisi |

### 1.2 Kullanıcı Büyüme Analitiği

| Özellik | Açıklama |
|---------|----------|
| **Cohort analizi** | Kayıt ayına göre kullanıcı gruplarının zamanla tutulması (retention heatmap) |
| **Trial → Ödeme dönüşüm hunisi** | Trial başladı → ilk ödeme → 2. ödeme → düzenli kullanıcı |
| **Kayıt kaynağı tracking** | UTM parametreleri, referrer analizi — hangi kanal en iyi kullanıcıyı getiriyor |
| **Churn tahmini (Predictive Churn)** | 30 günde kredi bitecek ve yenilemeyecek kullanıcıları önceden işaretle |
| **Kullanıcı sağlık skoru** | Kullanım sıklığı + harcama + destek ticket sayısı → skor |
| **DAU / WAU / MAU** | Aktif kullanıcı günlük/haftalık/aylık trend |
| **Kullanıcı başına ortalama gelir (ARPU)** | Segment bazında: trial / aktif / enterprise |
| **Yaşam boyu değer (LTV)** | Churn oranına göre hesaplanan ortalama müşteri değeri |
| **LTV : CAC oranı** | Müşteri edinme maliyetine karşı yaşam boyu değer |
| **Aktivasyon metriği** | Kayıt sonrası ilk 7 günde ilk üretim yapıldı mı? |
| **Feature adoption** | TTS mi, video mu daha çok kullanılıyor; yeni sesler ne kadar benimseniyor |
| **Viral katsayısı** | Referans programı varsa her kullanıcı kaç yeni kullanıcı getiriyor |

### 1.3 Operasyonel Analitik

| Özellik | Açıklama |
|---------|----------|
| **Job başarı oranı trendi** | Günlük completed / error / timeout dağılımı |
| **Ortalama job süresi** | TTS ve Video için P50 / P95 / P99 işlem süresi |
| **Queue bekleme süresi trendi** | Worker kapasitesi yeterli mi? |
| **API endpoint bazında latency** | Her endpoint için P50/P99 ayrı ayrı |
| **Hata sınıflandırması** | Model timeout mu, limit mi, kullanıcı hatası mı, sistem hatası mı? |
| **Kullanıcı başına günlük istek sayısı dağılımı** | Normal kullanım vs abuse tespiti |
| **Peak saatlerde kapasite kullanımı** | Hangi saatlerde worker'lar doluyor |

---

## 2. Kullanıcı Yönetimi (Derinleştirilmiş)

### 2.1 Kullanıcı Detay Sayfası

Şu an: Liste görünümü. Eksik: Her kullanıcı için tam profil sayfası.

| Özellik | Açıklama |
|---------|----------|
| **Tam profil sayfası** | `/admin/users/:id` — tüm veriler tek sayfada |
| **Kullanım geçmişi** | Kullanıcının tüm job'ları zaman sırasıyla, filtrelenebilir |
| **Ödeme geçmişi** | Tüm Stripe charge'lar, başarılı/başarısız, refund'lar |
| **Kredi yükleme geçmişi** | Admin tarafından eklenen krediler dahil tüm kredi hareketleri |
| **Giriş geçmişi** | IP, tarayıcı, zaman damgası — coğrafi konum işaretli |
| **API anahtarları** | Kullanıcının aktif API key'leri, son kullanım zamanı, iptal butonu |
| **Kullanıcı aktivite zaman çizelgesi** | Kayıt → ilk job → ilk ödeme → destek ticket → ban gibi tüm olaylar |
| **İletişim geçmişi** | Admin tarafından gönderilen e-postalar, sistem bildirimleri |
| **Cihaz ve tarayıcı geçmişi** | Hangi cihazlardan giriş yapıyor |
| **Başarısız ödeme geçmişi** | Kart reddi detayları, hata kodları |
| **Referans bilgisi** | Bu kullanıcıyı kim davet etti, kaç kişiyi davet etti |
| **Risk skoru detayı** | Skoru oluşturan faktörler, tarihsel trend |

### 2.2 Kullanıcı Aksiyonları

| Özellik | Açıklama |
|---------|----------|
| **Kullanıcı olarak giriş (Impersonation)** | Admin, o kullanıcı olarak UI'yı test edebilir (audit loglanır) |
| **Toplu işlemler** | Seçili kullanıcılara toplu kredi ekle, toplu e-posta gönder, toplu etiket ekle |
| **Özel fiyatlandırma** | Belirli bir kullanıcıya karakter başına özel fiyat tanımlama |
| **Rate limit override** | Kullanıcının limit üzerinde istek yapmasına izin ver |
| **IP kara liste / beyaz liste** | Kullanıcıya özel IP kısıtlaması |
| **Geçici hesap dondurma** | Ban değil, belirli süre askıya alma |
| **Zorunlu şifre sıfırlama** | Şüpheli aktivite sonrası kullanıcıyı çıkış yapmaya zorla |
| **E-posta doğrulama sıfırlama** | E-posta değişikliği veya doğrulama yeniden gönder |
| **Kullanıcı birleştirme** | Duplicate hesapları tespit et ve birleştir |
| **Hesap silme (GDPR)** | Tüm veriyi sil, audit log tut |
| **GDPR veri dışa aktarımı** | Kullanıcının tüm verisini JSON/ZIP olarak indir |
| **Kullanıcıya not sabitleme** | Önemli notları "pin" ile üste sabitle |
| **Etiketleme (Tags)** | "vip", "risk", "enterprise-lead", "refunded" gibi etiketler |
| **Segment atama** | Kullanıcıyı ilgili pazarlama segmentine manuel ekle |

### 2.3 Kullanıcı Segmentasyonu

| Özellik | Açıklama |
|---------|----------|
| **Dinamik segment oluşturma** | "30 gün içinde giriş yapmamış ve kredi > $5 olanlar" gibi kurallar |
| **Segment bazında raporlama** | Her segmentin gelir, kullanım, churn metrikleri |
| **Segment bazında kampanya** | Segmente özel e-posta veya bildirim gönderme |
| **Segment evrimi** | Kullanıcıların segmentler arası geçişi (trial → aktif → dormant → churn) |

---

## 3. Finansal Yönetim

### 3.1 İşlem Yönetimi

| Özellik | Açıklama |
|---------|----------|
| **Gelişmiş işlem listesi** | Tarih aralığı, kullanıcı, tür, tutar, durum filtreli; sayfalama |
| **İşlem detay sayfası** | Stripe charge ID, ham API yanıtı, kullanıma karşılık gelen job'lar |
| **İade (Refund) işlemi** | Doğrudan admin panelinden Stripe refund başlatma, sebep notu |
| **Kısmi iade** | Belirtilen miktarı iade et |
| **Anlaşmazlık (Dispute) yönetimi** | Stripe dispute geldiğinde admin'e uyarı, yanıt hazırlama |
| **Başarısız ödeme takibi** | Kart reddi sebepleri, yeniden deneme zamanlaması |
| **Manuel kredi işlemi log'u** | Kim, ne zaman, neden kredi ekledi/çıkardı — tam audit |

### 3.2 Fiyatlandırma Yönetimi

| Özellik | Açıklama |
|---------|----------|
| **Global fiyat konfigürasyonu** | TTS için $X / 1000 karakter, Video için $Y / saniye — UI'dan düzenle |
| **Ses modeli bazında fiyatlandırma** | Farklı Kokoro modelleri (premium sesler) farklı fiyat |
| **Video kalite bazında fiyatlandırma** | 720p vs 1080p vs 4K farklı fiyatlandırma |
| **Kredi paketi yönetimi** | "$10 → 10K kredi", "$50 → 55K kredi" gibi paketleri UI'dan düzenle |
| **İndirim kodu yönetimi** | Kupon oluştur, kullanım limiti, son kullanma tarihi, indirim tipi |
| **Ücretsiz kredi kampanyası** | Belirli segmente otomatik ücretsiz kredi yükle |
| **Deneme süresi konfigürasyonu** | Trial kullanıcıya verilen ücretsiz kredi miktarı ve süresi |
| **Enterprise özel fiyat** | Belirli kullanıcıya veya domain'e özel fiyat anlaşması |

### 3.3 Finansal Raporlama

| Özellik | Açıklama |
|---------|----------|
| **Stripe mutabakatı** | Stripe payout'ları ile iç veritabanı arasındaki fark raporu |
| **Vergi raporu** | Ülke bazında vergi bilgisi, KDV/GST takibi |
| **Nakit akışı tahmini** | Mevcut kredi bakiyelerine dayalı beklenen tahsilat |
| **Gelir tanıma raporu** | Yüklenen kredi vs harcanan kredi (deferred revenue tracking) |
| **Alacak yaşlandırma raporu** | Ödenmemiş / eksik tahsil edilmiş tutarlar |
| **Maliyet izleme** | Hetzner + Stripe + Kokoro API + diğer hizmetler için aylık maliyet |
| **Brüt kar marjı** | Gelir − doğrudan maliyet (işlem başı) |
| **Yatırımcı özeti** | MRR, ARR, Kullanıcı sayısı, Churn, LTV tek sayfalık rapor |

---

## 4. Ürün & İçerik Yönetimi

### 4.1 Ses Yönetimi

| Özellik | Açıklama |
|---------|----------|
| **Ses modeli listesi** | Mevcut tüm Kokoro sesleri, dil, cinsiyet, kalite puanı |
| **Yeni ses ekleme** | Ses ID, isim, dil, fiyat katsayısı, önizleme dosyası |
| **Ses devre dışı bırakma** | Belirli sesi geçici veya kalıcı devre dışı bırak |
| **Ses kullanım istatistikleri** | Hangi ses ne kadar kullanılıyor, geliri ne kadar |
| **Ses kalite metrikleri** | Hata oranı, ortalama işlem süresi, kullanıcı şikayeti sayısı |
| **Ses önizleme** | Admin panelinde örnek metinle test sentezi çal |
| **Ses gruplaması** | Kategoriler: Haber, Podcast, E-öğrenme, Çocuk vb. |

### 4.2 Video Şablon Yönetimi

| Özellik | Açıklama |
|---------|----------|
| **Şablon listesi** | Mevcut video şablonları, kullanım sayısı, başarı oranı |
| **Şablon ekleme/güncelleme** | ffmpeg pipeline parametrelerini UI'dan düzenle |
| **Şablon test etme** | Örnek medya ile şablonu test çalıştır |
| **Filigran (Watermark) yönetimi** | Trial kullanıcılar için filigran var/yok, logo yükle |
| **Video kalite seçeneği yönetimi** | 720p/1080p/4K seçeneklerini aç/kapat, fiyatlandır |

### 4.3 Özellik Bayrakları (Feature Flags)

| Özellik | Açıklama |
|---------|----------|
| **Global özellik bayrakları** | Belirli bir özelliği tüm kullanıcılar için aç/kapat |
| **Kullanıcı bazında özellik** | Belirli kullanıcıya erken erişim ver |
| **Segment bazında özellik** | Beta kullanıcıları için yeni özelliği aşamalı aç |
| **A/B test konfigürasyonu** | Hangi kullanıcılar A grubunda, hangileri B grubunda |
| **A/B test sonuçları** | Dönüşüm oranı, gelir etkisi, istatistiksel anlamlılık |
| **Kill switch** | Kritik hata durumunda tek tuşla özelliği tüm kullanıcılar için kapat |

### 4.4 Rate Limit & Kota Yönetimi

| Özellik | Açıklama |
|---------|----------|
| **Global rate limit konfigürasyonu** | Dakika/saat/gün başına maksimum istek sayısı |
| **Plan bazında kota** | Trial: günlük 5K karakter, Ücretli: sınırsız gibi |
| **Eşzamanlı job limiti** | Kullanıcı başına aynı anda kaç job çalışabilir |
| **Maksimum job boyutu** | Tek seferlik maksimum karakter/saniye limiti |
| **Limit ihlali log'u** | Kim, ne zaman, kaç kez limiti aştı |

### 4.5 Sistem Duyuru & Bakım

| Özellik | Açıklama |
|---------|----------|
| **Bakım modu** | Tüm API'yi geçici kapat, kullanıcılara banner göster |
| **Planlı bakım duyurusu** | "X tarihinde Y-Z saatleri arası bakım var" bildirimi |
| **Banner/uyarı yönetimi** | Kullanıcı UI'sında gösterilecek genel duyuru banner'ı |
| **Değişiklik günlüğü (Changelog)** | Yeni özellik duyuruları, kullanıcılara sunulacak notlar |

---

## 5. İletişim & Pazarlama

### 5.1 E-posta Yönetimi

| Özellik | Açıklama |
|---------|----------|
| **Tekil kullanıcıya e-posta** | Admin panelinden doğrudan bir kullanıcıya e-posta yaz ve gönder |
| **Toplu e-posta (Broadcast)** | Tüm aktif kullanıcılara veya belirli segmente e-posta |
| **E-posta şablon yönetimi** | Hoşgeldin, Kredi bitti, Trial bitiyor gibi şablonları düzenle |
| **E-posta gönderim geçmişi** | Hangi kullanıcıya ne zaman ne gönderildi |
| **Açılma / tıklama oranları** | E-posta kampanya analitiği |
| **Abonelik yönetimi** | Kullanıcının hangi e-posta türlerine abone olduğu / olmadığı |
| **Bounced e-posta takibi** | Ulaşmayan e-postalar, invalid adresler |
| **Otomatik e-posta kuralları** | "Kredi $5'ın altına düşünce uyarı gönder" gibi tetikleyiciler |

### 5.2 Bildirim Merkezi

| Özellik | Açıklama |
|---------|----------|
| **Uygulama içi bildirim** | Kullanıcı UI'sında gösterilecek bildirim oluştur |
| **Hedefli bildirim** | Belirli segment veya kullanıcıya özel bildirim |
| **Bildirim zamanlama** | İleri tarihli bildirim planla |
| **Bildirim analitik** | Görüntülenme, tıklanma, kapatılma oranları |

### 5.3 Referans & Büyüme Programı

| Özellik | Açıklama |
|---------|----------|
| **Referans kodu yönetimi** | Kişiselleştirilmiş referans kodları oluştur |
| **Referans ödül konfigürasyonu** | Kim davet eder, ne kadar kredi kazanır |
| **Referans performans raporu** | Hangi kullanıcı kaç kişi getirdi, toplam gelir etkisi |
| **Etkileyici (Influencer) hesapları** | Özel yüksek ödüllü referans programı segmenti |

---

## 6. Altyapı & DevOps

### 6.1 Job & Queue Yönetimi (Derinleştirilmiş)

| Özellik | Açıklama |
|---------|----------|
| **Gelişmiş job filtresi** | Kullanıcı, tarih, tür, durum, süre kombinasyonu |
| **Job detay sayfası** | Giriş parametreleri, çıktı dosyası, işlem logu, hata stack trace |
| **Job iptal etme** | İşlemdeki job'u durdur, kullanıcıya kredi iade et |
| **Job yeniden kuyruğa alma** | Hata veren job'u tek tuşla yeniden başlat |
| **Job önceliklendirme** | Belirli job'u kuyruğun önüne al (acil destek durumu) |
| **Toplu job temizleme** | X günden eski tamamlanmış job'ları arşivle |
| **Queue derinliği uyarısı** | Queue N iş geçerse admin'e Slack/e-posta bildir |
| **Worker bazında iş dağılımı** | Hangi worker kaç job işledi, kaçı hata verdi |

### 6.2 Log Yönetimi

| Özellik | Açıklama |
|---------|----------|
| **Canlı log akışı** | API loglarını gerçek zamanlı izle (WebSocket tabanlı) |
| **Log arama** | Zaman aralığı, log seviyesi, kullanıcı ID, endpoint bazında arama |
| **Hata log merkezi** | Tüm stack trace'ler, tekrar eden hata gruplandırması |
| **Yavaş sorgu log'u** | N ms üzerindeki veritabanı sorguları |
| **Erişim log'u** | Her API isteği, IP, user-agent, yanıt süresi |
| **Log dışa aktarımı** | Belirli zaman aralığının loglarını CSV/JSON olarak indir |

### 6.3 Performans İzleme

| Özellik | Açıklama |
|---------|----------|
| **API latency grafikleri** | Endpoint bazında P50 / P95 / P99 zaman serisi |
| **Veritabanı metrikleri** | Bağlantı havuzu kullanımı, yavaş sorgu sayısı, replikasyon gecikmesi |
| **Redis metrikleri** | Bellek kullanımı, hit rate, evicted key sayısı |
| **Worker metrikleri** | CPU, RAM, işlem süresi, hata oranı — Kokoro ve ffmpeg ayrı ayrı |
| **Depolama kullanımı** | Üretilen dosyalar ne kadar yer kaplıyor, büyüme trendi |
| **CDN istatistikleri** | Transfer miktarı, önbellekte bulunan istek oranı, maliyet |
| **Ağ I/O** | Sunucu gelen/giden trafik |

### 6.4 Uyarı & Olay Yönetimi

| Özellik | Açıklama |
|---------|----------|
| **Uyarı kuralı oluşturma** | "CPU > %80 olursa bildir", "hata oranı > %5 olursa bildir" |
| **Bildirim kanalı seçimi** | Slack, e-posta, SMS, PagerDuty |
| **Olay geçmişi (Incident Log)** | Yaşanan olaylar, başlangıç/bitiş zamanı, etki, çözüm notu |
| **Olay sonrası rapor (Post-mortem)** | Olay detayını ve alınan dersleri not et |
| **Zamanlanmış bakım penceresi** | Bakım sırasında belirli uyarıları sustur |
| **Servis durumu sayfası** | Kamuya açık durum sayfası içeriğini buradan yönet |

### 6.5 Dağıtım & Altyapı

| Özellik | Açıklama |
|---------|----------|
| **Dağıtım geçmişi** | Son N deployment: sürüm, zamanı, kim başlattı, başarılı mı |
| **Yedek durumu** | Veritabanı yedeklerinin son başarılı zamanı, boyutu, test durumu |
| **Servis yeniden başlatma** | Belirli servisi admin panelinden yeniden başlat (dikkatli kullanım) |
| **Yapılandırma yönetimi** | Uygulama config değerlerini güvenli şekilde UI'dan güncelle |

---

## 7. Destek & CRM

### 7.1 Destek Ticket Sistemi

| Özellik | Açıklama |
|---------|----------|
| **Dahili ticket yönetimi** | Kullanıcı sorunlarını ticket olarak kaydet ve takip et |
| **Ticket durumu** | Açık / İşlemde / Beklemede / Çözüldü / Kapalı |
| **Ticket önceliği** | Düşük / Orta / Yüksek / Kritik |
| **Ticket atama** | Destek ekibi üyelerine ticket ata |
| **SLA takibi** | Yanıt süresi ve çözüm süresi hedefleri |
| **Ticket şablonları** | Sık kullanılan yanıtları hazır şablon olarak kaydet |
| **Intercom / Zendesk entegrasyonu** | Dış destek aracındaki ticket'ları kullanıcı profiliyle eşle |
| **Ticket metriği** | Ortalama yanıt süresi, çözüm süresi, müşteri memnuniyeti |

### 7.2 CRM Özellikleri

| Özellik | Açıklama |
|---------|----------|
| **Kullanıcı aktivite zaman çizelgesi** | Tüm etkileşimler (job, ödeme, destek, admin aksiyonu) tek görünümde |
| **Satış notu** | Enterprise potansiyelli kullanıcılar için satış takip notu |
| **Hatırlatma / Takip görevi** | "5 gün sonra bu kullanıcıyı ara" gibi görev oluştur |
| **Enterprise müşteri yönetimi** | Şirket bazında hesap gruplaması, birden fazla kullanıcı |
| **İletişim tercihi** | E-posta / telefon / Slack — hangi kanaldan iletişim tercih ediyor |
| **Müşteri sağlık puanı** | Tüm sinyaller (kullanım, ödeme, destek) bir araya gelince skor |
| **At-risk kullanıcı listesi** | Churn riski yüksek kullanıcılar için anlık liste ve aksiyonlar |

---

## 8. Güvenlik & Uyumluluk

### 8.1 Admin Yetki Yönetimi

| Özellik | Açıklama |
|---------|----------|
| **Rol tabanlı erişim (RBAC)** | Süper Admin / Finans / Destek / Salt Okunur roller |
| **İzin matrisi** | Her rol için hangi sayfalar ve aksiyonlar erişilebilir |
| **Admin kullanıcı yönetimi** | Admin hesabı oluştur, devre dışı bırak, rol değiştir |
| **İki faktörlü doğrulama (2FA)** | Admin girişlerinde TOTP zorunlu |
| **IP kısıtlaması** | Admin paneline yalnızca belirli IP aralıklarından erişim |
| **Oturum yönetimi** | Aktif admin oturumları, uzaktan oturum sonlandırma |
| **Oturum zaman aşımı** | N dakika hareketsizlikte otomatik çıkış |
| **SSO entegrasyonu** | Google Workspace / Okta ile tek oturum açma |

### 8.2 Audit Log

| Özellik | Açıklama |
|---------|----------|
| **Tüm admin aksiyonları log'u** | Kim, ne zaman, hangi IP'den, hangi kaynağa ne yaptı |
| **Hassas aksiyon onayı** | Büyük kredi ekleme, ban gibi aksiyonlar ikinci admin onayı gerektirir |
| **Audit log arama** | Aksiyon tipi, kullanıcı, tarih, admin kullanıcısı bazında filtreleme |
| **Audit log dışa aktarım** | Uyumluluk / hukuk için log dışa aktar |
| **Değiştirilemez log** | Audit kayıtları silinemez veya düzenlenemez |

### 8.3 Fraud & Abuse Tespiti

| Özellik | Açıklama |
|---------|----------|
| **Şüpheli aktivite uyarıları** | Anormal kullanım artışı, çok sayıda IP değişikliği |
| **Kart dolandırıcılığı tespiti** | Stripe Radar kuralları + özel tespit katmanı |
| **Hız aşımı ihlalleri** | Rate limit'i sürekli aşan kullanıcılar için otomatik flag |
| **Çoklu hesap tespiti** | Aynı IP / e-posta / ödeme yönteminden birden fazla hesap |
| **İçerik kötüye kullanım tespiti** | Abuse içerik üretimi şüphesi olan job'ları işaretle |
| **Otomatik ban kuralları** | "X dakikada Y başarısız ödeme → geçici kilitle" gibi kurallar |
| **Kara liste yönetimi** | IP, e-posta domain, kart BIN bazında kara liste |
| **Fraud risk skoru** | Kullanıcı başına fraud olasılık skoru ve bileşen detayı |

### 8.4 Uyumluluk Araçları

| Özellik | Açıklama |
|---------|----------|
| **GDPR veri silme iş akışı** | Talep al → onayla → sil → kullanıcıya yanıt ver |
| **GDPR veri dışa aktarım iş akışı** | Kullanıcının tüm verisini belirli formatta hazırla ve gönder |
| **Veri saklama politikaları** | Hangi veri ne kadar süre tutulur — otomatik temizleme |
| **Gizlilik politikası sürüm yönetimi** | Yeni politika versiyonunu log'la, kullanıcı onayını takip et |
| **Çerez (Cookie) yönetimi** | Çerez kategorileri, onay logları |
| **SOC 2 / ISO 27001 hazırlık** | Uyumluluk kontrol listesi ve kanıt toplama |

---

## 9. API & Geliştirici Araçları

### 9.1 API Yönetimi

| Özellik | Açıklama |
|---------|----------|
| **Global API anahtarı listesi** | Tüm aktif API key'ler, sahip, son kullanım |
| **API anahtarı iptal** | Tehlikeli bir key'i anında iptal et |
| **API anahtarı kısıtlama** | Belirli IP, endpoint, kullanım miktarı ile key'i sınırla |
| **Kullanıcı başına API istatistikleri** | Hangi endpoint ne kadar çağrıldı, hata oranı |
| **API sürüm yönetimi** | v1 / v2 kullanım dağılımı, eski sürüm kullanıcılarına uyarı |
| **Deprecation yönetimi** | Kullanımdan kaldırılacak endpoint'leri işaretle, kullanıcılara bildir |

### 9.2 Webhook Yönetimi

| Özellik | Açıklama |
|---------|----------|
| **Kullanıcı webhook listesi** | Tüm kayıtlı webhook'lar, URL, olaylar, durum |
| **Webhook teslimat log'u** | Her gönderim: HTTP yanıt kodu, süre, payload |
| **Başarısız webhook'ları yeniden gönder** | Belirli olay için webhook'u manuel tetikle |
| **Webhook sağlık durumu** | Son N gönderimde başarı oranı, ortalama yanıt süresi |
| **Webhook devre dışı bırakma** | Sürekli hata veren webhook'u otomatik veya manuel durdur |

### 9.3 Geliştirici Sandbox

| Özellik | Açıklama |
|---------|----------|
| **Test modu hesapları** | Gerçek ücretlendirme olmadan API testleri için sandbox kullanıcılar |
| **API playground** | Admin içinden örnek istekler gönder, yanıtı gör |
| **Örnek payload'lar** | Her endpoint için test payload şablonları |
| **Hız limiti simülasyonu** | Rate limit davranışını test et |

---

## 10. Raporlama & Dışa Aktarım

### 10.1 Özel Rapor Oluşturucu

| Özellik | Açıklama |
|---------|----------|
| **Sürükle-bırak rapor tasarımcısı** | Metrik seç, filtrele, gruplanmış rapor oluştur |
| **Kaydedilmiş raporlar** | Oluşturulan raporu adla kaydet, tekrar kullan |
| **Zamanlanmış raporlar** | Her Pazartesi saat 09:00'da bu raporu e-posta ile gönder |
| **Rapor paylaşımı** | Raporu görüntüleme bağlantısı oluştur (token korumalı) |

### 10.2 Veri Dışa Aktarım

| Özellik | Açıklama |
|---------|----------|
| **Kullanıcı listesi CSV/Excel** | Filtre uygulayarak kullanıcı listesini dışa aktar |
| **İşlem geçmişi dışa aktarım** | Tarih aralığı seçerek tüm ödemeleri dışa aktar |
| **Job geçmişi dışa aktarım** | Belirli kullanıcı veya tarih aralığı için |
| **Analitik verisi dışa aktarım** | Dashboard metriklerini ham veri olarak dışa aktar |
| **Zamanlanmış dışa aktarım** | Her ay otomatik dışa aktarım ve belirli konuma kaydet |

### 10.3 Hazır Raporlar

| Özellik | Açıklama |
|---------|----------|
| **Yönetici (Executive) özet** | Tek sayfada: MRR, büyüme, kullanıcı sayısı, önemli olaylar |
| **Yatırımcı raporu** | SaaS metrikleri: MRR, ARR, NRR, Churn, LTV, CAC |
| **Finansal özet** | Gelir, maliyet, kar marjı aylık kırılım |
| **Kullanım raporu** | TTS + Video toplam üretim hacmi, trend |
| **Destek özeti** | Ticket hacmi, çözüm süresi, memnuniyet |
| **Güvenlik özeti** | Fraud denemeleri, ban sayısı, güvenlik olayları |

---

## 11. Kalite & AI/ML İzleme

### 11.1 TTS Kalite İzleme

| Özellik | Açıklama |
|---------|----------|
| **Ses sentez hata oranı** | Model bazında başarısız sentez yüzdesi |
| **Ortalama işlem süresi** | Karakter başına milisaniye — ses modeli bazında |
| **Model sürüm takibi** | Kokoro model versiyonları, güncelleme geçmişi |
| **Kullanıcı geri bildirimi** | "Bu ses iyi değildi" raporlarını topla ve analiz et |
| **Ölçek testi** | Belirli bir modeli belirlenen metinle test et, süreyi ölç |
| **Model A/B karşılaştırma** | İki model sürümünü yan yana kıyasla |
| **Anormal çıktı tespiti** | Normalden çok farklı dosya boyutu / süresi → inceleme kuyruğu |

### 11.2 Video Kalite İzleme

| Özellik | Açıklama |
|---------|----------|
| **Render hata sınıflandırması** | ffmpeg hatalarını kategorize et: codec, bellek, timeout, input |
| **Video boyutu / süre dağılımı** | Üretilen videoların istatistiksel dağılımı |
| **Render süresi vs video süresi** | Gerçek zamanlı mı üretiyor yoksa geride mi kalıyor |
| **Çıktı kalite skoru** | Oluşturulan videonun teknik kalite metriği (bitrate, çözünürlük doğruluğu) |

### 11.3 İçerik Denetimi

| Özellik | Açıklama |
|---------|----------|
| **Şüpheli içerik kuyruğu** | Kötüye kullanım tespiti tetiklenmiş job'ları gözden geçir |
| **Anahtar kelime filtresi** | Belirli anahtar kelimeleri içeren metinleri işaretleme kuralı |
| **Manuel inceleme iş akışı** | İşaretlenen içerikleri onayla veya reddet |
| **İçerik politikası ihlal log'u** | Hangi içerik, kim tarafından, neden reddedildi |

---

## 12. Entegrasyonlar

### 12.1 Ödeme

| Entegrasyon | Özellik |
|-------------|---------|
| **Stripe Dashboard embed** | Stripe doğrudan admin panelinde açılabilir iframe |
| **Stripe Radar kuralları** | Fraud kurallarını Stripe Radar UI'sına gitmeden yönet |
| **Stripe iade hızlı aksiyonu** | Kullanıcı sayfasından tek tıkla iade başlat |

### 12.2 İletişim

| Entegrasyon | Özellik |
|-------------|---------|
| **Slack bildirimleri** | Kritik olaylar (yüksek churn, büyük hata, önemli kayıt) Slack'e gönder |
| **Intercom entegrasyonu** | Kullanıcı profil sayfasında Intercom konuşmalarını göster |
| **Zendesk entegrasyonu** | Destek ticket'larını Zendesk ile senkronize et |
| **SendGrid / Resend** | E-posta gönderim durumu ve teslimat istatistikleri |

### 12.3 Altyapı

| Entegrasyon | Özellik |
|-------------|---------|
| **Hetzner Cloud API** | Sunucu durumu, fatura, kaynak kullanımı admin içinde göster |
| **AWS S3 / Cloudflare R2** | Depolama kullanımı, maliyet, dosya yönetimi |
| **Sentry** | Uygulama hatalarını Sentry'den çekerek admin içinde göster |
| **PagerDuty** | Kritik uyarıları PagerDuty'ye ilet, olay geçmişi göster |

### 12.4 Analitik

| Entegrasyon | Özellik |
|-------------|---------|
| **Mixpanel / Amplitude** | Kullanıcı olay akışını analitik aracından çek |
| **Google Analytics** | Kayıt / dönüşüm hunisi verisini admin içinde göster |
| **Metabase / Grafana embed** | Mevcut BI araçlarının panolarını embed et |

### 12.5 Geliştirici

| Entegrasyon | Özellik |
|-------------|---------|
| **GitHub** | Son deployment'ları, açık issue'ları admin içinde göster |
| **Linear** | Kullanıcıdan gelen bug raporundan doğrudan Linear issue oluştur |
| **Postman Collection** | API tanımını dışa aktar, güncel tutulmuş koleksiyon |

---

## Öncelik Matrisi

### Hemen (Kritik Değer — Düşük Maliyet)
1. Kullanıcı detay sayfası (`/admin/users/:id`)
2. Cohort analizi (en temel SaaS metriği)
3. Job iptal + yeniden kuyruğa alma
4. Audit log (kim ne yaptı)
5. İade işlemi doğrudan panelden
6. Fiyat konfigürasyonu UI'dan

### Kısa Vade (Yüksek İş Değeri)
7. E-posta gönderimi panelden
8. Özellik bayrakları sistemi
9. Kullanıcı segmentasyonu + toplu aksiyonlar
10. RBAC — destek ve finans rolleri
11. Uyarı kuralı oluşturma
12. Churn riski listesi

### Orta Vade (Ölçek Gerektiriyor)
13. Özel rapor oluşturucu
14. A/B test altyapısı
15. Fraud tespit motoru
16. GDPR iş akışı
17. Enterprise hesap yönetimi
18. Referans programı yönetimi

### Uzun Vade (Büyüme ile Gelir)
19. LTV / CAC hesaplama motoru
20. Tahmine dayalı churn modeli
21. Otomatik e-posta kampanya motoru
22. SSO entegrasyonu
23. SOC 2 uyumluluk araçları
24. Kamuya açık durum sayfası

---

*Bu belge Speeko Admin'in potansiyel özelliklerinin kapsamlı bir envanteri olarak hazırlanmıştır. Her özelliğin implemente edilmesi gerekmez; öncelikler kullanıcı talebi, gelir etkisi ve geliştirme maliyetine göre belirlenmelidir.*
