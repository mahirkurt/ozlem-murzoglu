# Google Marketing Operations — Uzm. Dr. Özlem Murzoğlu

**Son güncelleme**: 2026-03-16
**Hazırlayan**: Claude Marketing Automation
**Durum**: Aktif — tüm kanallar entegre, event tracking doğrulandı

---

## İçindekiler

1. [Mimari Genel Bakış](#1-mimari-genel-bakış)
2. [Google Tag Manager (GTM)](#2-google-tag-manager-gtm)
3. [Google Analytics 4 (GA4)](#3-google-analytics-4-ga4)
4. [Google Ads](#4-google-ads)
5. [Google Search Console (GSC)](#5-google-search-console-gsc)
6. [Google Business Profile (GBP)](#6-google-business-profile-gbp)
7. [Veri Akış Diyagramı](#7-veri-akış-diyagramı)
8. [KPI ve Hedefler](#8-kpi-ve-hedefler)
9. [Bilinen Sorunlar ve Aksiyon Planı](#9-bilinen-sorunlar-ve-aksiyon-planı)
10. [Operasyon Takvimi](#10-operasyon-takvimi)
11. [CLI Araçları Referansı](#11-cli-araçları-referansı)
12. [OAuth ve Erişim](#12-oauth-ve-erişim)

---

## 1. Mimari Genel Bakış

```
┌──────────────────────────────────────────────────────────────────────┐
│                    ozlemmurzoglu.com (Angular 18)                     │
│                                                                      │
│  ┌──────────────────────┐    ┌─────────────────────────────────┐     │
│  │  AnalyticsService    │───▶│  dataLayer.push()               │     │
│  │  (core/services/)    │    │  + gtag('event', ...)           │     │
│  │                      │    └──────────┬──────────────────────┘     │
│  │  Events:             │               │                            │
│  │  • phone_click   ✅  │               ▼                            │
│  │  • whatsapp_click ✅ │    ┌─────────────────────────────────┐     │
│  │  • form_submit   ✅  │    │  GTM Container (GTM-WTVF5SJ5)  │     │
│  │  • page_view         │    │  Version 7 — 9 Tags, 8 Triggers │     │
│  │  • scroll_depth      │    └──────────┬──────────────────────┘     │
│  └──────────────────────┘               │                            │
└──────────────────────────────────────────┼────────────────────────────┘
                                          │
                    ┌─────────────────────┼──────────────────┐
                    ▼                     ▼                  ▼
         ┌─────────────────┐   ┌──────────────────┐   ┌──────────────┐
         │  GA4             │   │  Google Ads       │   │  GBP          │
         │  G-FJW4LXJ4T8   │   │  1330325749       │   │  Maps/Search  │
         │  Property:       │   │                   │   │               │
         │  414498498       │◀──│  Linked ✓         │   │  Place ID:    │
         │                  │   │                   │   │  ChIJ83R9...  │
         └────────┬─────────┘   └──────────────────┘   └──────────────┘
                  │                                           │
                  ▼                                           ▼
         ┌─────────────────┐                        ┌──────────────┐
         │  GSC             │                        │  Reviews      │
         │  Verified ✓      │                        │  Posts        │
         │  ozlemmurzoglu   │                        │  Photos       │
         │  .com            │                        │  Q&A          │
         └─────────────────┘                        └──────────────┘
```

### Hesap Kimlikleri

| Araç | ID | Tanım |
|------|----|-------|
| GTM Container | `GTM-WTVF5SJ5` (228884718) | Web container |
| GTM Account | `6311067523` | Uzm.Dr. Özlem Murzoğlu |
| GA4 Measurement ID | `G-FJW4LXJ4T8` | Web stream |
| GA4 Property | `414498498` | Analytics property |
| Google Ads Customer | `1330325749` | Reklam hesabı |
| GBP Place ID | `ChIJ83R9VUTJyhQRM2o-M-eoZyQ` | İşletme konumu |
| GSC Property | `https://ozlemmurzoglu.com` | Search Console |

---

## 2. Google Tag Manager (GTM)

### 2.1 Container Durumu

- **Container ID**: GTM-WTVF5SJ5
- **Account**: 6311067523
- **Son publish**: Version 7 — "Appointment Event Tracking" (2026-03-15)
- **Workspace**: Default Workspace (ID: 7)
- **Event tracking doğrulandı**: 2026-03-16 (Playwright ile `phone_click` ve `whatsapp_click` dataLayer push'u onaylandı)

### 2.2 Tag Envanteri

| Tag ID | Ad | Tip | Tetikleyici | Açıklama |
|--------|-----|-----|-------------|----------|
| 3 | Google etiketi G-FJW4LXJ4T8 | `googtag` | Consent Initialization | Google tag yapılandırması |
| 4 | GA4 - Configuration | `gaawe` | All Pages | GA4 temel yapılandırma |
| 6 | GA4 - Scroll Tracking | `gaawe` | Scroll Depth | Scroll derinliği izleme |
| 11 | Duration | `gaawe` | Page View | Sayfa süre takibi |
| 13 | On-Screen Duration | `gaawe` | Başlatma (init) | Ekranda görünürlük süresi |
| 14 | Google Ads Dönüşümü | `gclidw` | All Pages | Ads conversion linker (gclid) |
| 20 | GA4 - phone_click | `gaawe` | CE - phone_click | Telefon tıklama event'i → GA4 |
| 21 | GA4 - whatsapp_click | `gaawe` | CE - whatsapp_click | WhatsApp tıklama event'i → GA4 |
| 22 | GA4 - form_submit | `gaawe` | CE - form_submit | Form gönderimi event'i → GA4 |

### 2.3 Trigger Envanteri

| Trigger ID | Ad | Tip | Event Filtresi |
|------------|-----|-----|----------------|
| 7 | Page View | `pageview` | — |
| 8 | Page Click | `click` | — |
| 9 | Links | `linkClick` | — |
| 10 | Scroll Depth | `scrollDepth` | — |
| 12 | Başlatma | `init` | — |
| 17 | CE - phone_click | `customEvent` | `event == 'phone_click'` |
| 18 | CE - whatsapp_click | `customEvent` | `event == 'whatsapp_click'` |
| 19 | CE - form_submit | `customEvent` | `event == 'form_submit'` |

### 2.4 Event Akış Mekanizması (Doğrulanmış)

```
Kullanıcı CTA'ya tıklar (tel: veya wa.me link)
       │
       ▼
AnalyticsService.setupAutoTracking()
  → document click listener → anchor.href kontrol
       │
       ├── href.startsWith('tel:')     → trackPhoneConversion()
       └── href.includes('wa.me')      → trackWhatsAppConversion()
              href.includes('whatsapp')
       │
       ▼
trackConversion(type, value)
       │
       ├──▶ gtag('event', type, {category, label, value})
       │         → GA4'e doğrudan
       │
       └──▶ dataLayer.push({event: type, ...})
                 → GTM Trigger → GTM Tag → GA4'e
```

**Doğrulama sonucu** (2026-03-16 Playwright testi):
- `phone_click`: ✅ tel: link tıklandığında 2x dataLayer push (trackEvent + trackConversion)
- `whatsapp_click`: ✅ wa.me link tıklandığında dataLayer push onaylandı
- `form_submit`: ✅ form submit event listener aktif

---

## 3. Google Analytics 4 (GA4)

### 3.1 Property Bilgileri

| Alan | Değer |
|------|-------|
| Property ID | 414498498 |
| Measurement ID | G-FJW4LXJ4T8 |
| Web Stream | ozlemmurzoglu.com |
| Veri saklama | 14 ay |
| Currency | TRY |

### 3.2 Dönüşüm Event'leri

| Event | Kaynak | Değer | Durum |
|-------|--------|-------|-------|
| `phone_click` | AnalyticsService → GTM → GA4 | 150 TL | ✅ Aktif, doğrulanmış |
| `whatsapp_click` | AnalyticsService → GTM → GA4 | 75 TL | ✅ Aktif, doğrulanmış |
| `form_submit` | AnalyticsService → GTM → GA4 | 100 TL | ✅ Aktif |
| `page_view` | Otomatik | — | Aktif |
| `session_start` | Otomatik | — | Aktif |
| `scroll` | GTM Scroll Tracking | — | Aktif |

### 3.3 GA4 ↔ Google Ads Linking

- **Durum**: Linked (GA4 Admin → Google Ads Links)
- **Etki**: GA4 dönüşüm event'leri otomatik olarak Google Ads'e aktarılır
- **Import**: Ads hesabında GA4 dönüşüm aksiyonları import edilebilir

---

## 4. Google Ads

### 4.1 Hesap Yapısı

| Alan | Değer |
|------|-------|
| Customer ID | 1330325749 |
| Toplam Günlük Bütçe | 164 TL/gün (~5.000 TL/ay) |
| Aktif Kampanya | 3 |
| Toplam Anahtar Kelime | 72 (tümü phrase/exact) |
| Toplam Negatif Kelime | 108 (57 + 51) |

### 4.2 Kampanya Mimarisi (3 Katmanlı)

#### Kampanya 1: Ana Hizmet Aramaları (ID: 23637962859)

| Alan | Değer |
|------|-------|
| Tür | Search |
| Bütçe | 82 TL/gün (%50) |
| Teklif Stratejisi | **Tıklamaları Maksimize Et** (max CPC: 15 TL) |
| Durum | ENABLED |
| Reklam Sayısı | 8 (4 adgroup x 2 varyant A/B) |
| Son 30 gün | 6.834 gösterim, 96 tıklama, CTR %1,44, 532 TL |

**Reklam Grupları**:

| Adgroup ID | Ad | Anahtar Kelime | Reklam |
|------------|-----|---------------|--------|
| 191869394097 | Çocuk Doktoru | 20 (phrase/exact, yerel hedefli) | 3 RSA (orijinal x2 + yeni lokasyon vurgulu) |
| 194191989996 | Bebek Yenidoğan | 5 (phrase) | 2 RSA (orijinal + yeni Ataşehir vurgulu) |
| 193763965403 | Aşı Takibi | 8 (phrase, randevu niyetli) | 1 RSA |
| 196979151551 | Kontrol Muayene | 10 (phrase) | 2 RSA (orijinal + yeni Bright Futures vurgulu) |

**Anahtar kelime stratejisi değişiklikleri (2026-03-16)**:
- ❌ "bebek sağlığı" (broad) — kaldırıldı, bilgi amaçlı trafiğe gidiyordu
- ❌ "aşı takvimi çocuk" (phrase) — kaldırıldı, bilgi amaçlı trafiğe gidiyordu
- ✅ "aşı randevusu ataşehir", "çocuk aşısı yaptırmak", "bebek aşı doktoru", "aşı yapan pediatrist" eklendi
- ✅ 20+ yerel hedefli phrase/exact kelime eklendi (çocuk doktoru ataşehir, kadıköy, ümraniye, maltepe, üsküdar, sancaktepe, içerenköy, kayışdağı)
- ✅ Branded kelimeler eklendi (dr özlem murzoğlu, özlem murzoğlu pediatri)

#### Kampanya 2: Özel Programlar (ID: 23648002777)

| Alan | Değer |
|------|-------|
| Tür | Search |
| Bütçe | 41 TL/gün (%25) |
| Teklif Stratejisi | **Tıklamaları Maksimize Et** (max CPC: 12 TL) |
| Durum | ENABLED |
| Reklam Sayısı | 4 (3 adgroup, Uyku Eğitimi 2 varyant) |
| Son 30 gün | 4.258 gösterim, 57 tıklama, CTR %1,34, 261 TL, 1 dönüşüm |

**Reklam Grupları**:

| Adgroup ID | Ad | Anahtar Kelime | Reklam |
|------------|-----|---------------|--------|
| 200903773624 | Uyku Eğitimi | 7 (phrase, niyet-spesifik) | 2 RSA (orijinal + yeni doktor vurgulu) |
| 194807129755 | Beslenme | 5 (phrase) | 1 RSA |
| 194807136875 | Ebeveynlik | 5 (phrase) | 1 RSA (CTR %5,56 — hedef üstü) |

**Uyku Eğitimi kelime stratejisi değişiklikleri (2026-03-16)**:
- ❌ "uyku eğitimi" (broad) — kaldırıldı, müzik aramalarına gidiyordu
- ❌ "çocuk uyku problemi" (phrase) — kaldırıldı, Google müzik sorularına eşleştiriyordu
- ✅ "bebek uyumama doktor", "uyku eğitimi danışmanlık", "bebek uyku uzmanı ataşehir" eklendi
- ✅ "bebek uyku danışmanı", "bebek uyku danışmanlığı", "bebek gece uyumama sorunu" zaten mevcut

#### Kampanya 3: PMax - Yerel Görünüm (ID: 23655691328)

| Alan | Değer |
|------|-------|
| Tür | Performance Max |
| Bütçe | 41 TL/gün (%25) |
| Teklif Stratejisi | Dönüşümleri Maksimize Et |
| Durum | ENABLED |
| Varlıklar | GBP entegrasyonu, çok kanallı (Maps, Search, Display, YouTube) |
| Son 30 gün | **4.966 gösterim, 196 tıklama, CTR %3,95, CPC 0,67 TL, 1 dönüşüm** |

PMax en iyi performanslı kampanya: en yüksek CTR, en düşük CPC, tek dönüşüm getiren.

#### Kaldırılan: Performance Max - GBP (ID: 23655684155)

- 2026-03-16'da REMOVED — yanlışlıkla SEARCH olarak oluşturulmuştu, hiç gösterim almamıştı, PMax - Yerel Görünüm ile duplicate idi.

### 4.3 Teklif Stratejisi Planı

| Faz | Strateji | Koşul |
|-----|----------|-------|
| **Mevcut** | Tıklamaları Maksimize Et (Search) | 0 dönüşüm verisi — algoritma optimize edemiyordu |
| **Hedef** | Dönüşümleri Maksimize Et (Search) | 15-30 dönüşüm toplandıktan sonra geçiş yapılacak |
| PMax | Dönüşümleri Maksimize Et (sabit) | PMax her zaman bu stratejiyle çalışır |

### 4.4 Coğrafi Hedefleme

| Katman | Bölge | Teklif Ayarı |
|--------|-------|-------------|
| Birincil | Ataşehir | Baz teklif (agresif) |
| İkincil | Kadıköy, Ümraniye, Maltepe, Üsküdar | +%80 |
| Üçüncül | İstanbul Anadolu Yakası genel | +%50 |

### 4.5 Dönüşüm Aksiyonları

**Birincil (özel oluşturulan)**:

| ID | Ad | Değer | Durum |
|----|-----|-------|-------|
| 7529389429 | Telefon Araması | 150 TL | ENABLED |
| 7529391502 | WhatsApp Mesajı | 75 TL | ENABLED |
| 7529259488 | Form Gönderimi | 100 TL | ENABLED |

**Eski/Otomatik (Smart Campaign kalıntıları)**:

| ID | Ad | Durum |
|----|-----|-------|
| 1032433855 | Smart Campaign telefon tıklama | ENABLED (eski) |
| 1032509664 | Maps harita tıkla-ara | ENABLED (eski) |
| 1032509667 | Maps yol tarifi | ENABLED (eski) |
| 1031586905 | Calls from Smart Campaign Ads | ENABLED (eski) |
| 6487420999 | Kişi | ENABLED (eski) |

### 4.6 Negatif Anahtar Kelimeler

**Ana Hizmet Aramaları** (23637962859) — 57 negatif kelime:

```
3 aylık bebek gelişimi, acil, ateş nasıl düşürülür, avrupa yakası,
aylık bebek gelişimi, aşı fiyatı, aşı karşıtı, aşı nedir,
aşı yan etkileri, aşı çeşitleri, bebek gelişim tablosu, bebek gelişimi,
bebek kahvaltısı, bedava, beyaz gürültü, bitkisel, burun temizliği,
devlet hastanesi, diyetisyen, diş, doğal, evde tedavi, film, göz,
hastane, iş ilanı, kadın doğum, kahvaltı, kaç kilo, kolik, maaş,
müzik, nasıl geçer, nasıl olmalı, nasıl yapılır, ne zaman, nelerdir,
ninni, osman gönülal, oyun, pis pis, piş piş, psikolog, pış pış,
rsv virüsü, ses, staj, sünnetçi, tarif, tarifi, video, yaş aşısı,
yetişkin, öksürük nasıl geçer, ücretsiz, şarkı, şule koçaş
```

**Özel Programlar** (23648002777) — 51 negatif kelime:

```
acil, asmr, avrupa yakası, bebek ninnileri, bebek uyutma,
bebekler için, bebekleri uyutan, bedava, beya gürültü, beyaz gürültü,
beyaz ses, cocuk uyutmak, devlet hastanesi, diyetisyen, diş,
doğa sesi, dua, eee piş piş, göz, gürültü, hastane, iş ilanı,
kadın doğum, klasik müzik, kolik, lullaby, maaş, müzik, ninni,
ninni piş piş, ninniler, pis pis, piş piş, psikolog, pış pış,
rahatlatıcı, sakinleştirici, ses, staj, su sesi, sünnetçi,
uyku duası, uyku ninnileri, uyku şarkısı, uyutan, uyutan ninni,
uyutma, white noise, yetişkin, ücretsiz, şarkı
```

### 4.7 Bütçe Durumu

| Bütçe ID | Kampanya | Günlük | Durum |
|----------|----------|--------|-------|
| 15424110651 | Ana Hizmet Aramaları | 82 TL | ENABLED |
| 15437867470 | PMax - Yerel Görünüm | 41 TL | ENABLED |
| 15419268161 | Özel Programlar | 41 TL | ENABLED |

Eski/paused bütçeler 2026-03-16'da temizlendi (6 adet kaldırıldı).

### 4.8 Reklam Envanteri

**Ana Hizmet Aramaları** (8 RSA):

| ID | Adgroup | Başlıklar (özet) | CTR |
|----|---------|-------------------|-----|
| 799787659108 | Çocuk Doktoru | Ataşehir Çocuk Doktoru, Dr. Özlem Murzoğlu, Bright Futures | %1,66 |
| 799787679520 | Çocuk Doktoru | (aynı — A/B varyant) | %1,19 |
| **800458379409** | **Çocuk Doktoru** | **Çocuk Doktoru Ataşehir, Pediatrist Randevusu, Uphill Towers** | **Yeni** |
| 799788201292 | Aşı Takibi | Çocuk Aşı Takibi, AAP Standartlarında | %1,93 |
| 799788173707 | Bebek Yenidoğan | Yenidoğan Uzmanı Ataşehir, Bebek Doktoru İstanbul | %1,37 |
| **800457875217** | **Bebek Yenidoğan** | **Yenidoğan Doktoru Ataşehir, Bebek Muayene Randevusu** | **Yeni** |
| 799862702870 | Kontrol Muayene | Çocuk Sağlık Kontrolü, Gelişim Takibi İstanbul | %0,88 |
| **800458300296** | **Kontrol Muayene** | **Çocuk Gelişim Kontrolü, Bright Futures Takibi, AAP** | **Yeni** |

**Özel Programlar** (4 RSA):

| ID | Adgroup | Başlıklar (özet) | CTR |
|----|---------|-------------------|-----|
| 799753861806 | Uyku Eğitimi | Bebek Uyku Eğitimi, Sağlıklı Uykular Programı | %1,14 |
| **800458227009** | **Uyku Eğitimi** | **Bebek Uyku Danışmanlığı, Doktor Eşliğinde Program** | **Yeni** |
| 799792251790 | Beslenme | SOS Beslenme Programı, Çocuk Beslenme Terapisi | %3,32 |
| 799792265509 | Ebeveynlik | Triple P Ebeveynlik, Olumlu Ebeveynlik | **%5,56** |

---

## 5. Google Search Console (GSC)

### 5.1 Organik Performans (Son 30 Gün)

**Toplam**: ~10 tıklama, ~200 gösterim

| Sorgu | Tıklama | Gösterim | CTR | Pozisyon |
|-------|---------|----------|-----|----------|
| özlem murzoğlu (branded) | 6 | 48 | %12,5 | 1,3 |
| emzik bıraktırma | 1 | 34 | %2,9 | 13,2 |
| emziren anne alkol | 1 | 2 | %50 | 7,0 |
| emzikle uyuyan bebeğe emzik nasıl bıraktırılır | 1 | 6 | %16,7 | 8,0 |

### 5.2 SEO Teşhis

| Sorun | Detay | Çözüm |
|-------|-------|-------|
| **Yerel kelime eksikliği** | "çocuk doktoru ataşehir" hiç organik gösterim almıyor | Title/meta'da lokasyon sinyali güçlendir, LocalBusiness schema ekle |
| **Branded bağımlılık** | Trafiğin %60'ı "özlem murzoğlu" branded araması | Non-branded kelimeler için içerik üret |
| **Düşük gösterim hacmi** | Toplam ~200 gösterim/ay — çok düşük | İçerik hacmini artır, blog yazıları ekle |
| **Fırsat kelimeleri** | "emzik bıraktırma" (pos: 13) | İçerik güçlendirme ile ilk 10'a taşı |

### 5.3 Title/Meta Standardı

```
Title:  [Primary Keyword] | Uzm. Dr. Özlem Murzoğlu
Meta:   [Semptom/İhtiyaç] için [hizmet yaklaşımı]. [Uzmanlık sinyali]. [CTA].
```

---

## 6. Google Business Profile (GBP)

### 6.1 Profil Bilgileri

| Alan | Değer |
|------|-------|
| İşletme Adı | Uzm. Dr. Özlem Murzoğlu |
| Kategori | Çocuk Sağlığı ve Hastalıkları Uzmanı |
| Adres | Uphill Towers, Ataşehir/İstanbul |
| Place ID | ChIJ83R9VUTJyhQRM2o-M-eoZyQ |
| Google Ads ile bağlantı | Aktif (1330325749) |

### 6.2 Haftalık İçerik Takvimi

| Gün | Tür | Komut |
|-----|-----|-------|
| Pazartesi | Hizmet tanıtımı | `gbp-manager.mjs post --type SERVICE ...` |
| Çarşamba | Sağlık ipucu | `gbp-manager.mjs post --type TIP ...` |
| Cuma | Teklif/Etkinlik | `gbp-manager.mjs post --type OFFER ...` |

### 6.3 GBP Optimizasyon Kontrol Listesi

- [ ] En az 10 klinik fotoğrafı yükle
- [ ] 7 hizmetin tamamını GBP "Hizmetler" sekmesine ekle
- [ ] En sık sorulan 5 soruyu GBP Q&A'ya yanıtla
- [ ] İşletme açıklamasında uzmanlık alanlarını ve lokasyonu vurgula
- [ ] Haftalık post takvimini başlat

---

## 7. Veri Akış Diyagramı

### Dönüşüm İzleme Akışı (End-to-End)

```
    ┌─────────────────────────────────────────────────────────────┐
    │                     KULLANICI YOLCULUĞU                      │
    │                                                              │
    │  Google'da arar ──▶ Reklama tıklar ──▶ Siteye gelir         │
    │       │                    │                  │              │
    │       │              gclid URL'e              │              │
    │       │              eklenir                   │              │
    │       ▼                    ▼                  ▼              │
    │  ┌─────────┐      ┌────────────┐      ┌────────────┐       │
    │  │ Organik │      │ Google Ads │      │ GBP/Maps   │       │
    │  │ Search  │      │ Search/PMax│      │ Listing    │       │
    │  └────┬────┘      └─────┬──────┘      └─────┬──────┘       │
    │       └─────────────────┼────────────────────┘              │
    │                         ▼                                    │
    │              ┌─────────────────────┐                        │
    │              │  ozlemmurzoglu.com   │                        │
    │              │  Angular App        │                        │
    │              └──────────┬──────────┘                        │
    │                         │                                    │
    │              ┌──────────▼──────────┐                        │
    │              │  AnalyticsService   │                        │
    │              │  auto-tracking:     │                        │
    │              │  • tel: links  ✅   │                        │
    │              │  • wa.me links ✅   │                        │
    │              │  • form submits ✅  │                        │
    │              └──────┬─────────────┘                        │
    │                     │                                        │
    │         ┌───────────┼───────────┐                           │
    │         ▼           ▼           ▼                           │
    │    ┌─────────┐ ┌─────────┐ ┌─────────┐                    │
    │    │ gtag()  │ │dataLayer│ │ Ads     │                    │
    │    │ direct  │ │  push   │ │gtag_rep │                    │
    │    └────┬────┘ └────┬────┘ └────┬────┘                    │
    │         │           │           │                           │
    │         ▼           ▼           ▼                           │
    │    ┌─────────┐ ┌─────────┐ ┌─────────┐                    │
    │    │  GA4    │ │  GTM    │ │ Ads     │                    │
    │    │ Event   │ │ Trigger │ │ Conv.   │                    │
    │    │         │ │ → Tag   │ │ Tag     │                    │
    │    └────┬────┘ └────┬────┘ └────┬────┘                    │
    │         │           │           │                           │
    │         ▼           ▼           ▼                           │
    │    ┌──────────────────────────────────┐                     │
    │    │         GA4 Property             │                     │
    │    │     (phone_click event)          │                     │
    │    └──────────────┬──────────────────┘                     │
    │                   │ GA4-Ads link                            │
    │                   ▼                                         │
    │    ┌──────────────────────────────────┐                     │
    │    │       Google Ads Account         │                     │
    │    │    Conversion: "Telefon Aramasi" │                     │
    │    │    Değer: 150 TL                 │                     │
    │    └──────────────────────────────────┘                     │
    └─────────────────────────────────────────────────────────────┘
```

---

## 8. KPI ve Hedefler

### 8.1 Google Ads KPI'ları

| Metrik | Mevcut (30 gün) | Hedef | Durum | Yapılan |
|--------|----------------|-------|-------|---------|
| Aylık telefon araması | 0 | 30-50 | ⏳ İzleme yeni kuruldu | GTM event tracking aktif, ilk veri bekleniyor |
| CPA (telefon) | — | < 80 TL | ⏳ Veri bekleniyor | — |
| CTR (Search) | %1,4 | > %5 | ⚠️ Düşük | 4 yeni RSA oluşturuldu, A/B testi başlatıldı |
| CTR (PMax) | **%3,95** | > %3 | ✅ Hedef üstü | — |
| Impression Share | %10 | > %40 | ⚠️ Düşük | Teklif stratejisi Maximize Clicks'e çevrildi |
| Toplam maliyet | 924 TL | 3.000-5.000 TL | ⚠️ Altında | Maximize Clicks ile harcama artacak |

### 8.2 SEO/Organik KPI'ları

| Metrik | Mevcut (30 gün) | Hedef | Durum |
|--------|----------------|-------|-------|
| Organik tıklama | ~10 | > 100 | ⛔ Kritik |
| Organik gösterim | ~200 | > 2.000 | ⛔ Kritik |
| Non-branded trafik | %40 | > %70 | ⚠️ Branded bağımlı |
| "çocuk doktoru ataşehir" pozisyon | Görünmüyor | Top 10 | ⛔ İçerik/SEO gerekli |

### 8.3 GBP KPI'ları

| Metrik | Mevcut | Hedef | Durum |
|--------|--------|-------|-------|
| Haftalık post | 0 | 3 | ⛔ Başlatılmadı |
| Yorum puanı | ? | > 4,5 | Kontrol gerekli |
| Fotoğraf sayısı | ? | > 10 | Kontrol gerekli |

---

## 9. Bilinen Sorunlar ve Aksiyon Planı

### 9.1 Çözülmüş Sorunlar

| # | Sorun | Çözüm | Tarih |
|---|-------|-------|-------|
| S1 | GTM'de dönüşüm event trigger/tag yoktu | 3 trigger + 3 tag oluşturuldu, Version 7 publish | 2026-03-15 |
| S2 | Broad match kelimeler alakasız trafiğe gidiyordu | Tüm broad'lar kaldırıldı, 72 kelime phrase/exact | 2026-03-15 |
| S3 | "beyaz gürültü" / müzik aramaları bütçe yakıyordu | "çocuk uyku problemi" kaldırıldı, 51 müzik negatifi eklendi | 2026-03-16 |
| S4 | "aşı takvimi çocuk" bilgi amaçlı trafiğe gidiyordu | Kaldırıldı, yerine "aşı randevusu ataşehir" gibi niyetli kelimeler | 2026-03-16 |
| S5 | IS %10 — Maximize Conversions 0 veriyle çalışamıyordu | Maximize Clicks'e geçildi (max CPC: 15/12 TL) | 2026-03-16 |
| S6 | Eski paused bütçeler hesabı kalabalıklaştırıyordu | 6 eski bütçe kaldırıldı | 2026-03-16 |
| S7 | Duplicate PMax kampanyası (Search olarak oluşmuştu) | "Performance Max - GBP" kampanyası kaldırıldı (REMOVED) | 2026-03-16 |
| S8 | Düşük CTR reklam metinleri | 4 yeni RSA oluşturuldu (lokasyon + niyet vurgulu) | 2026-03-16 |
| S9 | Negatif kelime çakışması (aşı takvimi, gelişimi) | Çakışan 3 negatif kaldırıldı | 2026-03-16 |

### 9.2 Devam Eden İzleme Gerektiren Konular

| # | Konu | İzleme Tarihi | Aksiyon |
|---|------|---------------|---------|
| I1 | Negatif kelimeler müzik trafiğini bloke ediyor mu? | 2026-03-23 | `search-terms --days 7` çalıştır, yeni varyant varsa ekle |
| I2 | Yeni RSA'lar eski reklamlardan daha iyi CTR veriyor mu? | 2026-03-30 | `ads --campaign <ID>` ile A/B sonuçlarını karşılaştır |
| I3 | Maximize Clicks ile IS artıyor mu? | 2026-03-23 | `metrics --days 7` ile IS% kontrol et |
| I4 | İlk phone_click/whatsapp_click dönüşümü geldi mi? | 2026-03-23 | GA4 API ile event sayılarını kontrol et |
| I5 | 15-30 dönüşüm toplandığında Maximize Conversions'a geri dön | Sürekli | `conversions` ile dönüşüm sayısını takip et |

### 9.3 İyileştirme Fırsatları

| # | Fırsat | Öncelik | Tahmini Etki |
|---|--------|---------|-------------|
| F1 | LocalBusiness JSON-LD schema ekle | P0 | Organik local pack görünürlüğü |
| F2 | Hizmet sayfalarına FAQ schema ekle | P1 | Featured snippet fırsatı |
| F3 | Blog içerik üretimi başlat (ayda 4-6) | P1 | Non-branded trafik artışı |
| F4 | "emzik bıraktırma" içerik güçlendirme | P1 | Pos 13→Top 10, tıklama artışı |
| F5 | GBP haftalık post takvimi başlat | P2 | Maps görünürlüğü |

---

## 10. Operasyon Takvimi

### Günlük (Otomatik)
- AnalyticsService otomatik event tracking (phone_click, whatsapp_click, form_submit)
- GTM tag'leri GA4'e event gönderir
- Google Ads kampanyaları aktif çalışır

### Haftalık
| Gün | İşlem | Araç | Komut |
|-----|-------|------|-------|
| Pazartesi | GBP hizmet postu | gbp-manager | `post --type SERVICE` |
| Çarşamba | GBP sağlık ipucu | gbp-manager | `post --type TIP` |
| Cuma | GBP teklif/etkinlik | gbp-manager | `post --type OFFER` |
| Pazar | Haftalık performans kontrolü | ads-manager | `metrics --days 7` |

### İki Haftada Bir
| İşlem | Araç | Komut |
|-------|------|-------|
| Arama terimleri analizi | ads-manager | `search-terms --days 14` |
| Negatif kelime güncelleme | ads-manager | `negative:add --campaign <ID> --keywords="..."` |
| Negatif kelime kontrol | ads-manager | `negative:list --campaign <ID>` |
| GSC query performans taraması | GSC API | curl sorgusu |

### Aylık
| İşlem | Araç |
|-------|------|
| KPI hedef karşılaştırması | GA4 API + Ads API |
| Bütçe dağılımı değerlendirmesi | ads-manager `budget` |
| Reklam metni A/B test sonuçları | ads-manager `ads --campaign <ID>` |
| SEO içerik planı güncelleme | GOOGLE-MARKETING-PLAN.md |

---

## 11. CLI Araçları Referansı

### 11.1 ads-manager.mjs

```bash
# Çalışma dizini: /home/mahirkurt/projects/ozlem-murzoglu
node scripts/google-ads/ads-manager.mjs <komut> [seçenekler]
```

**Raporlama**:

```bash
ads-manager.mjs campaigns                       # Kampanya listesi
ads-manager.mjs campaign:details --id <ID>       # Kampanya detayları
ads-manager.mjs adgroups --campaign <ID>         # Reklam grupları
ads-manager.mjs ads --campaign <ID>              # Reklamlar
ads-manager.mjs keywords --adgroup <ID>          # Anahtar kelimeler
ads-manager.mjs metrics --days 30                # Performans metrikleri
ads-manager.mjs search-terms --days 14           # Arama terimleri raporu
ads-manager.mjs budget                           # Bütçeler
ads-manager.mjs conversions                      # Dönüşüm aksiyonları
ads-manager.mjs negative:list --campaign <ID>    # Negatif kelime listesi
```

**Yönetim**:

```bash
ads-manager.mjs campaign:enable --id <ID>
ads-manager.mjs campaign:pause --id <ID>
ads-manager.mjs campaign:set-bidding --id <ID> --strategy maximize_clicks --max-cpc 15
ads-manager.mjs budget:update --id <ID> --amount <TL>
ads-manager.mjs budget:remove --id <ID>
ads-manager.mjs keyword:add --adgroup <ID> --keyword "kelime" --match phrase
ads-manager.mjs keyword:remove --adgroup <ID> --id <keyword_ID>
ads-manager.mjs keyword:bulk-add --adgroup <ID> --keywords "kw1;kw2" --match phrase
ads-manager.mjs negative:add --campaign <ID> --keywords "a;b;c"
ads-manager.mjs negative:remove --campaign <ID> --keywords "a;b;c"
```

**Oluşturma**:

```bash
ads-manager.mjs campaign:create --name "..." --budget 50 --channel SEARCH
ads-manager.mjs adgroup:create --campaign <ID> --name "..." --cpc 5
ads-manager.mjs ad:create --adgroup <ID> --headlines "H1,H2,H3" --descriptions "D1,D2"
ads-manager.mjs conversion:create --name "..." --category PHONE_CALL --value 150
ads-manager.mjs extension:sitelinks --campaign <ID>
ads-manager.mjs extension:call --campaign <ID>
ads-manager.mjs extension:callouts --campaign <ID>
ads-manager.mjs setup:full --budget 5000
```

### 11.2 gbp-manager.mjs

```bash
node scripts/google-ads/gbp-manager.mjs <komut> [seçenekler]
```

```bash
gbp-manager.mjs info                       # İşletme bilgileri
gbp-manager.mjs reviews                    # Yorumlar
gbp-manager.mjs post --type SERVICE --title "Başlık" --body "İçerik"
gbp-manager.mjs schedule                   # İçerik takvimi
```

### 11.3 API Sorguları (curl)

```bash
# Token alma (marketing-token.json kullanarak)
TOKEN=$(curl -sS -X POST "https://oauth2.googleapis.com/token" \
  -d "client_id=<CLIENT_ID>&client_secret=<SECRET>&refresh_token=<REFRESH>&grant_type=refresh_token" \
  | python3 -c "import json,sys;print(json.load(sys.stdin)['access_token'])")

# GA4 event raporu
curl -X POST -H "Authorization: Bearer $TOKEN" \
  "https://analyticsdata.googleapis.com/v1beta/properties/414498498:runReport" \
  -d '{"dateRanges":[{"startDate":"7daysAgo","endDate":"today"}],
       "dimensions":[{"name":"eventName"}],"metrics":[{"name":"eventCount"}]}'

# GA4 Realtime
curl -X POST -H "Authorization: Bearer $TOKEN" \
  "https://analyticsdata.googleapis.com/v1beta/properties/414498498:runRealtimeReport" \
  -d '{"dimensions":[{"name":"eventName"}],"metrics":[{"name":"eventCount"}]}'

# GSC sorgu raporu
curl -X POST -H "Authorization: Bearer $TOKEN" \
  "https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fozlemmurzoglu.com/searchAnalytics/query" \
  -d '{"startDate":"2026-02-14","endDate":"2026-03-16","dimensions":["query"],"rowLimit":20}'

# GTM tag listesi
curl -H "Authorization: Bearer $TOKEN" \
  "https://tagmanager.googleapis.com/tagmanager/v2/accounts/6311067523/containers/228884718/versions:live"
```

---

## 12. OAuth ve Erişim

### 12.1 Kimlik Bilgileri

| Dosya | Scope'lar | Kullanım |
|-------|-----------|----------|
| `scripts/google-ads/google-ads-token.json` | adwords, business.manage | Ads + GBP CLI |
| `scripts/google-ads/marketing-token.json` | analytics, webmasters, tagmanager (edit+publish+containerversions), adwords, business.manage | GTM write + GA4 + GSC |
| `client_secret_google_ads.apps.googleusercontent.com.json` | — | OAuth client (installed app) |

### 12.2 Token Yenileme

```bash
node scripts/google-ads/setup-marketing-auth.mjs
# Tarayıcıda onay → callback → token kaydedilir
```

---

## Değişiklik Geçmişi

| Tarih | Değişiklik |
|-------|-----------|
| 2026-03-15 | İlk oluşturma: tüm kanalların entegre dokümantasyonu |
| 2026-03-15 | GTM: phone_click, whatsapp_click, form_submit trigger+tag eklendi, Version 7 publish |
| 2026-03-15 | Ads: "bebek sağlığı" ve "uyku eğitimi" broad kelimeler kaldırıldı |
| 2026-03-15 | Ads: 48 negatif anahtar kelime eklendi (2 kampanya) |
| 2026-03-15 | Ads: PMax - Yerel Görünüm kampanyası kuruldu ve etkinleştirildi |
| 2026-03-15 | Ads: Bütçe yeniden dağıtıldı (%50/%25/%25) |
| 2026-03-15 | Ads: Yerel hedefli phrase/exact kelimeler eklendi (20+ kelime) |
| 2026-03-15 | Auth: marketing-token.json oluşturuldu (containerversions scope dahil) |
| 2026-03-16 | Ads: 4 yeni RSA oluşturuldu (Bebek Yenidoğan, Uyku Eğitimi, Kontrol Muayene, Çocuk Doktoru) |
| 2026-03-16 | Ads: "çocuk uyku problemi" phrase kaldırıldı, niyet-spesifik kelimeler eklendi |
| 2026-03-16 | Ads: "aşı takvimi çocuk" kaldırıldı, randevu niyetli kelimeler eklendi |
| 2026-03-16 | Ads: 31 ek negatif kelime eklendi (müzik varyantları + bilgi amaçlı aşı terimleri) |
| 2026-03-16 | Ads: Çakışan 3 negatif kelime kaldırıldı (aşı takvimi, gelişimi, bebek aşı takvimi) |
| 2026-03-16 | Ads: Teklif stratejisi Maximize Conversions → Maximize Clicks (IS düşüklüğü düzeltmesi) |
| 2026-03-16 | Ads: "Performance Max - GBP" duplicate kampanyası kaldırıldı (REMOVED) |
| 2026-03-16 | Ads: 6 eski paused bütçe kaldırıldı |
| 2026-03-16 | CLI: negative:list, negative:remove, budget:remove komutları eklendi |
| 2026-03-16 | Event tracking: Playwright ile phone_click ve whatsapp_click dataLayer push doğrulandı |
| 2026-03-16 | Deploy: Firebase production deploy tamamlandı |
| 2026-03-16 | Doküman güncellendi: tüm seans değişiklikleri yansıtıldı |
