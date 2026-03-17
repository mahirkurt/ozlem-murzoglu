# Sayfa Envanteri ve Mimari Harita

**Tarih:** 2026-03-16
**Son Güncelleme:** 2026-03-16 (tüm eylem planı uygulandı)
**Proje:** Dr. Özlem Murzoğlu — Pediatri Kliniği Web Sitesi
**Durum:** Güncel — build ve i18n doğrulaması başarılı

---

## 1. AKTİF SAYFALAR (Route Tanımlı)

### 1.1 Ana Sayfalar

| # | Sayfa | Route | Component | Header | Footer |
|---|-------|-------|-----------|--------|--------|
| 1 | **Ana Sayfa** | `/` | `HomeComponent` | Logo | — |
| 2 | **Hakkımızda** | `/hakkimizda` | `AboutComponent` | ✓ | ✓ |
| 3 | **Dr. Özlem Murzoğlu** | `/hakkimizda/dr-ozlem-murzoglu` | `DrOzlemMurzogluComponent` | ✓ (alt menü) | — |
| 4 | **Kliniğimiz** | `/hakkimizda/klinigimiz` | `KlinigimizComponent` | ✓ (alt menü) | — |
| 5 | **Klinik Tasarımı** | `/hakkimizda/klinik-tasarimi` | `KlinikTasarimiComponent` | — | — |
| 6 | **S.S.S.** | `/hakkimizda/sss` | `FaqComponent` | ✓ (alt menü) | ✓ |
| 7 | **Hizmetlerimiz** | `/hizmetlerimiz` | `ServicesComponent` | ✓ | ✓ |
| 8 | **Laboratuvar ve Görüntüleme** | `/hizmetlerimiz/laboratuvar-goruntuleme` | `LaboratuvarGoruntulemeComponent` | ✓ (alt menü) | ✓ |
| 9 | **Triple P** | `/hizmetlerimiz/triple-p` | `TriplePComponent` | ✓ (alt menü) | ✓ |
| 10 | **Sağlıklı Uykular** | `/hizmetlerimiz/saglikli-uykular` | `SaglikliUykularComponent` | ✓ (alt menü) | ✓ |
| 11 | **Bright Futures Program** | `/hizmetlerimiz/bright-futures-program` | `BrightFuturesProgramComponent` | ✓ (alt menü) | ✓ |
| 12 | **SOS Feeding** | `/hizmetlerimiz/sos-feeding` | `SosFeedingComponent` | ✓ (alt menü) | ✓ |
| 13 | **Blog** | `/blog` | `BlogComponent` | — | ✓ |
| 14 | **Blog Makale** | `/blog/:slug` | `BlogArticleComponent` | — (dinamik) | — |
| 15 | **Saygıyla** | `/saygiyla` | `SaygiylaComponent` | ✓ | — |
| 16 | **Kaynaklar** | `/kaynaklar` | `ResourcesComponent` | ✓ | ✓ |
| 17 | **BF Yolculuğu** | `/kaynaklar/bright-futures-yolculugu` | `BrightFuturesJourneyComponent` | — | — |
| 18 | **Randevu** | `/randevu` | `AppointmentComponent` | CTA butonu | ✓ |
| 19 | **İletişim** | `/iletisim` | `ContactComponent` | ✓ | ✓ |
| 20 | **Gizlilik Politikası** | `/legal/privacy` | `PrivacyComponent` | — | ✓ |
| 21 | **Kullanım Koşulları** | `/legal/terms` | `TermsComponent` | — | ✓ |
| 22 | **KVKK** | `/legal/kvkk` | `KvkkComponent` | — | ✓ |
| 23 | **404 Sayfa Bulunamadı** | `**` (catch-all) | `NotFoundComponent` | — | — |

### 1.2 Saygıyla Alt Sayfaları

| # | Kişi | Route | Component |
|---|------|-------|-----------|
| 1 | Mustafa Kemal Atatürk | `/saygiyla/ataturk` | `AtaturkComponent` |
| 2 | Prof. Dr. İhsan Doğramacı | `/saygiyla/ihsan-dogramaci` | `IhsanDogramaciComponent` |
| 3 | Dr. Jonas Salk | `/saygiyla/jonas-salk` | `JonasSalkComponent` |
| 4 | Louis Pasteur | `/saygiyla/louis-pasteur` | `LouisPasteurComponent` |
| 5 | Malala Yousafzai | `/saygiyla/malala-yousafzai` | `MalalaYousafzaiComponent` |
| 6 | Nils Rosén von Rosenstein | `/saygiyla/nils-rosen` | `NilsRosenComponent` |
| 7 | Prof. Dr. Türkan Saylan | `/saygiyla/turkan-saylan` | `TurkanSaylanComponent` |
| 8 | Ursula K. Le Guin | `/saygiyla/ursula-leguin` | `UrsulaLeguinComponent` |
| 9 | Virginia Apgar | `/saygiyla/virginia-apgar` | `VirginiaApgarComponent` |
| 10 | Waldo Nelson | `/saygiyla/waldo-nelson` | `WaldoNelsonComponent` |

### 1.3 Kaynak Kategori Sayfaları (Otomatik Üretilen)

| # | Kategori | Route | i18n Anahtarı | Doküman |
|---|----------|-------|---------------|---------|
| 1 | Bright Futures (Aile) | `/kaynaklar/bright-futures-aile` | `RESOURCES.CATEGORIES.BRIGHT_FUTURES_FAMILY` | 24 |
| 2 | Bright Futures (Çocuk) | `/kaynaklar/bright-futures-cocuk` | `RESOURCES.CATEGORIES.BRIGHT_FUTURES_CHILD` | 13 |
| 3 | Aşılar | `/kaynaklar/asilar` | `RESOURCES.CATEGORIES.VACCINES` | 7 |
| 4 | Gebelik Dönemi | `/kaynaklar/gebelik-donemi` | `RESOURCES.CATEGORIES.PREGNANCY` | 5 |
| 5 | Gelişim Rehberleri | `/kaynaklar/gelisim-rehberleri` | `RESOURCES.CATEGORIES.DEVELOPMENT` | 13 |
| 6 | Hastalıklar | `/kaynaklar/hastaliklar` | `RESOURCES.CATEGORIES.DISEASES` | 9 |
| 7 | Oyuncaklar | `/kaynaklar/oyuncaklar` | `RESOURCES.CATEGORIES.TOYS` | 4 |
| 8 | Aile Medya Planı | `/kaynaklar/aile-medya-plani` | `RESOURCES.CATEGORIES.MEDIA_PLAN` | 10 |
| 9 | Genel Bilgiler | `/kaynaklar/genel-bilgiler` | `RESOURCES.CATEGORIES.GENERAL_INFO` | 26 |
| 10 | CDC Büyüme Eğrileri | `/kaynaklar/cdc-buyume-egrileri` | `RESOURCES.CATEGORIES.CDC_GROWTH` | 0 * |
| 11 | WHO Büyüme Eğrileri | `/kaynaklar/who-buyume-egrileri` | `RESOURCES.CATEGORIES.WHO_GROWTH` | 0 * |

\* CDC/WHO kategorileri route tanımlı fakat henüz içerik yok. `ResourcesComponent` `documentCount > 0` filtresiyle bunları otomatik gizler.

**Toplam kaynak dokümanı: 111**

### 1.4 Redirect (Yönlendirme) Rotaları

| Kaynak | Hedef | Amaç |
|--------|-------|------|
| `/home` | `/` | İngilizce uyumluluk |
| `/anasayfa` | `/` | Türkçe uyumluluk |
| `/anasayfa/:slug` | `/` | Eski linkler |
| `/sss` | `/hakkimizda/sss` | Eski URL koruması |
| `/hizmetlerimiz/asi-takibi` | `/hizmetlerimiz` | Kaldırılan alt sayfa |
| `/hizmetlerimiz/gelisim-takibi` | `/hizmetlerimiz` | Kaldırılan alt sayfa |
| `/hizmetlerimiz/gelisim-degerlendirmesi` | `/hizmetlerimiz` | Kaldırılan alt sayfa |
| `/bilgi-merkezi` | `/kaynaklar` | Eski URL yapısı |
| `/bilgi-merkezi/:category` | `/kaynaklar/:category` | Eski URL yapısı |
| `/bilgi-merkezi/:category/:doc` | `/kaynaklar/:category/:doc` | Eski URL yapısı |
| `/yasal/gizlilik` | `/legal/privacy` | Türkçe→İngilizce path |
| `/yasal/kullanim-kosullari` | `/legal/terms` | Türkçe→İngilizce path |
| `/yasal/kvkk` | `/legal/kvkk` | Türkçe→İngilizce path |

### 1.5 Route Sayı Özeti

| Kategori | Sayı |
|----------|------|
| Ana sayfalar | 23 |
| Saygıyla alt sayfaları | 10 |
| Kaynak kategori sayfaları | 11 |
| Kaynak doküman sayfaları | 111 |
| Redirect rotaları | 13 |
| **Toplam route** | **168** |

---

## 2. MENÜ YAPISI

### 2.1 Header Navigasyon

**Kaynak:** `src/app/components/header/header.component.ts`

```
├── Hakkımızda (/hakkimizda)
│   ├── Dr. Özlem Murzoğlu (/hakkimizda/dr-ozlem-murzoglu)
│   ├── Kliniğimiz (/hakkimizda/klinigimiz)
│   └── S.S.S. (/hakkimizda/sss)
├── Hizmetlerimiz (/hizmetlerimiz)
│   ├── Laboratuvar ve Görüntüleme (/hizmetlerimiz/laboratuvar-goruntuleme)
│   ├── Triple P (/hizmetlerimiz/triple-p)
│   ├── Sağlıklı Uykular (/hizmetlerimiz/saglikli-uykular)
│   ├── Bright Futures Programı (/hizmetlerimiz/bright-futures-program)
│   └── SOS Beslenme Yaklaşımı (/hizmetlerimiz/sos-feeding)
├── Kaynaklar (/kaynaklar)
│   ├── Tüm Kaynaklar (/kaynaklar)
│   ├── Aşılar (/kaynaklar/asilar)
│   ├── Gelişim Rehberleri (/kaynaklar/gelisim-rehberleri)
│   ├── Genel Bilgiler (/kaynaklar/genel-bilgiler)
│   └── Aile Medya Planı (/kaynaklar/aile-medya-plani)
├── Saygıyla (/saygiyla)
├── İletişim (/iletisim)
└── [Randevu Al] → Appointment Modal (CTA butonu)
```

### 2.2 Footer Navigasyon

**Kaynak:** `src/app/components/footer/footer.ts`

```
Hızlı Linkler:
├── Ana Sayfa (/)
├── Hakkımızda (/hakkimizda)
├── Hizmetlerimiz (/hizmetlerimiz)
├── Kaynaklar (/kaynaklar)
├── S.S.S. (/hakkimizda/sss)
├── İletişim (/iletisim)
├── Randevu (/randevu)
└── Blog (/blog)

Hizmetlerimiz:
├── Bright Futures® Programı (/hizmetlerimiz/bright-futures-program)
├── Triple P (/hizmetlerimiz/triple-p)
├── Sağlıklı Uykular™ (/hizmetlerimiz/saglikli-uykular)
├── Laboratuvar ve Görüntüleme (/hizmetlerimiz/laboratuvar-goruntuleme)
└── SOS Beslenme Yaklaşımı (/hizmetlerimiz/sos-feeding)

Yasal:
├── Gizlilik Politikası (/legal/privacy)
├── Kullanım Koşulları (/legal/terms)
└── KVKK (/legal/kvkk)
```

### 2.3 Menüde Yer Almayan Sayfalar

| Sayfa | Route | Neden Menüde Yok? |
|-------|-------|-------------------|
| Klinik Tasarımı | `/hakkimizda/klinik-tasarimi` | Henüz menüye eklenmedi — about sayfasından erişilebilir |
| BF Yolculuğu | `/kaynaklar/bright-futures-yolculugu` | Bright Futures program sayfasından erişilebilir |
| Blog Makale | `/blog/:slug` | Blog listesinden dinamik erişim |
| Saygıyla Alt Sayfaları | `/saygiyla/*` | Ana Saygıyla sayfasından kart bazlı erişim |
| 404 | `**` | Catch-all, menüde yer almaz |

---

## 3. SAYFA BAĞLANTI HARİTASI

```
                            ┌──────────┐
                            │ Ana Sayfa │
                            │    /      │
                            └────┬─────┘
         ┌──────────┬───────────┼───────────┬───────────┬──────────┐
         ▼          ▼           ▼           ▼           ▼          ▼
   ┌──────────┐ ┌─────────┐ ┌────────┐ ┌─────────┐ ┌────────┐ ┌──────┐
   │Hakkımızda│ │Hizmet-  │ │Kaynak- │ │ Saygıyla│ │İletişim│ │ Blog │
   │/hakkimiz.│ │lerimiz  │ │lar     │ │/saygiyla│ │/iletisi│ │/blog │
   └──┬───────┘ └──┬──────┘ └──┬─────┘ └──┬──────┘ └────────┘ └──┬───┘
      │            │           │           │                       │
 ┌────┼─────┐ ┌────┼─────┐    │      10 pioneer               ┌──▼──────┐
 ▼    ▼     ▼ ▼    ▼     ▼    │      alt sayfası              │/blog/:sl│
Dr. Klinik SSS Lab  BF  SOS   │                               └─────────┘
Özl.-imiz     Gör.  Prg Feed  │
    Kln.      TriP  Uyku       │
    Tas.                       │
                          ┌────┼────────────┐
                          ▼    ▼            ▼
                    11 kategori  BF       111 doküman
                    index pg.  Yolculuğu  sayfası
                                │
                          ┌─────┼─────────────────┐
                          ▼     ▼                  ▼
                    ┌──────────┐ ┌──────────┐ ┌──────────┐
                    │ Randevu  │ │  Legal   │ │   404    │
                    │ /randevu │ │ /legal/* │ │   /**    │
                    └──────────┘ └──┬──┬──┬─┘ └──────────┘
                                    │  │  │
                                 Priv Terms KVKK
```

---

## 4. UYGULANAN DEĞİŞİKLİKLER (2026-03-16)

Bu doküman ilk oluşturulduğunda tespit edilen tüm sorunlar aynı oturumda çözüldü:

### Öncelik 1 — Path Tutarlılığı (Tamamlandı)
- [x] Header kaynak alt menüsü `/bilgi-merkezi/` → `/kaynaklar/` olarak güncellendi
- [x] Footer linkleri `/bilgi-merkezi` → `/kaynaklar`, `/sss` → `/hakkimizda/sss`
- [x] Bright Futures Journey'deki 40+ link `/bilgi-merkezi/` → `/kaynaklar/`
- [x] About sayfasında `href` → `routerLink` (SPA uyumluluğu)
- [x] BF Journey'deki 37 kırık slug düzeltildi (Türkçe karakter encoding uyumsuzluğu: `icin→in`, `yas→ya`, `cocuk→ocuk`, `hakkinda→hakk-nda`, `genc→gen`, vb.)
- [x] Dokümanı mevcut olmayan 2 link kaldırıldı (16 yaş aile, 18-21 yaş aile)

### Öncelik 2 — Yetim Component Temizliği (Tamamlandı)
- [x] `pages/articles/` silindi
- [x] `pages/favorites/` silindi
- [x] `pages/kategori/` silindi
- [x] `pages/kaynaklar/` silindi (ResourcesComponent aktif)
- [x] `pages/dokuman-viewer/` silindi
- [x] `pages/about/dr-ozlem/` silindi (dr-ozlem-murzoglu aktif)

### Öncelik 3 — Eksik Route'lar (Tamamlandı)
- [x] `/hakkimizda/klinik-tasarimi` route'u eklendi
- [x] `/kaynaklar/bright-futures-yolculugu` route'u eklendi
- [x] 10 Saygıyla alt sayfa route'u eklendi (`/saygiyla/ataturk`, vb.)
- [x] Catch-all `**` artık `NotFoundComponent`'e yönlendiriyor (gerçek 404 sayfası)

### Öncelik 4 — Menü İyileştirmeleri (Tamamlandı)
- [x] SOS Feeding header hizmetler alt menüsüne eklendi
- [x] Blog footer'a eklendi
- [x] Footer'dan redirect-only linkler kaldırıldı (`asi-takibi`, `gelisim-degerlendirmesi`)
- [x] Footer'a SOS Feeding eklendi
- [x] Header Saygıyla dropdown'u kaldırıldı (yanlış kişileri listeliyordu)
- [x] Kullanılmayan i18n key'leri temizlendi (`NAV_CLINIC_DESIGN`, `NAV_INSPIRING`, `NAV_MEMORIES`, `NAV_THANKS`)
- [x] `FOOTER.INFO_CENTER` label'ı "Kaynaklar" / "Resources" olarak güncellendi
- [x] `FOOTER.SOS_FEEDING` key'i TR ve EN'ye eklendi
- [x] Header'dan boş CDC Büyüme Eğrileri kategorisi kaldırıldı
- [x] BrightFuturesJourneyComponent'e eksik `TranslateModule` import'u eklendi

### Öncelik 5 — İçerik Boşlukları
- [x] CDC/WHO kategorileri `documentCount > 0` filtresiyle zaten otomatik gizleniyor — aksiyon gerekmedi

### Öncelik 6 — MD3 Non-Home Template Uygulaması (Tamamlandı)
- [x] App shell seviyesinde home dışı tüm route'lara `standard-page` + expressive level sınıfı uygulandı
- [x] Envanterdeki tüm UI sayfa ailelerinin kök/main wrapper'larına `standard-page-main` uygulandı
- [x] Shared non-home template stilleri global stylesheet'e bağlandı
- [x] Route bazlı expressive seviye haritası tanımlandı:
  - `minimum`: `/legal/*`, `/kaynaklar`, `/kaynaklar/*`, `/blog/:slug`
  - `moderate`: diğer tüm aktif içerik sayfaları (home hariç)

**Kapsam doğrulaması (envantere karşılık):**
- Ana sayfalar: Home hariç 22/22 sayfa standarda bağlı
- Saygıyla alt sayfaları: 10/10 sayfa standarda bağlı
- Kaynak kategori sayfaları: 11/11 sayfa standarda bağlı
- Kaynak doküman sayfaları: 111/111 sayfa standarda bağlı (`resource-page standard-page-main`)
- Blog makale route'u: 1/1 standarda bağlı (`article-content standard-page-main`)
- 404 sayfası: standarda bağlı (`not-found-page standard-page-main`)
- Redirect route'ları: UI template içermediği için kapsam dışı

---

## 5. NOTLAR

- **Kaynak route'ları otomatik üretilir:** `resource-routes.ts` dosyasını elle düzenlemeyin, `node tools/process-documents.mjs` kullanın.
- **Redirect route'ları korunuyor:** Eski `/bilgi-merkezi/` ve `/yasal/` URL'leri hâlâ çalışır. SEO ve eski bookmark'lar için bu redirect'ler kaldırılmamalı.
- **`FOOTER.ARTICLES` ve `FOOTER.VACCINATION` i18n key'leri** henüz JSON'larda mevcut ama hiçbir component'te kullanılmıyor. Bir sonraki `npm run i18n:clean` çalıştırmasında otomatik temizlenecek.
