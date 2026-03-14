# Google Ads + GBP Entegre Strateji — Uygulama Planı

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Web sitesini Google Ads kampanyaları ve Google Business Profile ile tam entegre çalışacak şekilde hazırlamak — GTM, GA4, dönüşüm izleme, telefon/WhatsApp/form tracking ve reklam landing page optimizasyonu.

**Architecture:** GTM container üzerinden tüm izleme yönetilir. Analytics service mevcut ama aktif değil — gerçek ID'lerle aktifleştirilecek. Telefon/WhatsApp/form tıklamaları GTM event olarak izlenecek, Google Ads conversion tag'leri GTM üzerinden tetiklenecek.

**Tech Stack:** Angular 18, Google Tag Manager (GTM-WTVF5SJ5), GA4 (G-FJW4LXJ4T8), Google Ads (AW-1330325749), TypeScript, SCSS

**Design Doc:** `docs/plans/2026-02-27-google-ads-gbp-strategy-design.md`

---

## Task 1: GTM ve GA4 Script'lerini index.html'e Ekle

**Files:**
- Modify: `src/index.html`

**Step 1: GTM head script'ini ekle**

`src/index.html` dosyasında `<head>` tagının hemen altına (mevcut `<meta charset>` satırından önce) GTM snippet'ini ekle:

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WTVF5SJ5');</script>
<!-- End Google Tag Manager -->
```

**Step 2: GTM noscript body tag'ini ekle**

`<body>` tagının hemen altına:

```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WTVF5SJ5"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager -->
```

**Step 3: Build'in çalıştığını doğrula**

Run: `npm run build 2>&1 | tail -20`
Expected: Build successful, no errors

**Step 4: Commit**

```bash
git add src/index.html
git commit -m "feat: add GTM container script to index.html"
```

---

## Task 2: Analytics Service'i Aktifleştir — Gerçek ID'leri Yerleştir

**Files:**
- Modify: `src/app/core/services/analytics.service.ts` (Lines 114, 122, 145)
- Modify: `src/app/app.config.ts`

**Step 1: GA4 placeholder ID'sini gerçek ID ile değiştir**

`src/app/core/services/analytics.service.ts` dosyasında:
- Line ~114: `G-XXXXXXXXXX` → `G-FJW4LXJ4T8`
- Line ~122: `G-XXXXXXXXXX` → `G-FJW4LXJ4T8`
- Line ~145: `CLARITY_PROJECT_ID` → gerçek Clarity ID (veya kaldır)

**Step 2: AnalyticsService'i app providers'a ekle**

`src/app/app.config.ts` dosyasında providers dizisine `AnalyticsService` ekle:

```typescript
import { AnalyticsService } from './core/services/analytics.service';

// providers dizisine ekle:
{
  provide: APP_INITIALIZER,
  useFactory: (analytics: AnalyticsService) => () => analytics.initialize(),
  deps: [AnalyticsService],
  multi: true
}
```

Not: Eğer service `APP_INITIALIZER` yerine constructor'da otomatik başlıyorsa, sadece `provideAppInitializer` veya `providers` dizisine eklenmesi yeterli. Mevcut service koduna göre ayarla.

**Step 3: Build'in çalıştığını doğrula**

Run: `npm run build 2>&1 | tail -20`
Expected: Build successful

**Step 4: Dev server'da GA4 network request'ini doğrula**

Run: `npm start`
Browser DevTools > Network tab > "collect" veya "gtag" filtrele
Expected: GA4'e page_view eventi gönderiliyor

**Step 5: Commit**

```bash
git add src/app/core/services/analytics.service.ts src/app/app.config.ts
git commit -m "feat: activate analytics service with real GA4 ID"
```

---

## Task 3: Telefon Tıklama Dönüşüm İzleme

**Files:**
- Modify: `src/app/components/header/header.component.html` (Line 6)
- Modify: `src/app/components/footer/footer.html` (Line 87)
- Modify: `src/app/pages/contact/contact.html` (Lines 108-109)
- Modify: `src/app/components/contact-cta/contact-cta.component.html`

**Step 1: Header telefon linkine data-track attribute ekle**

`src/app/components/header/header.component.html` (Line 6):
```html
<a [href]="'tel:' + contactInfo.phone" class="utility-link"
   data-track="phone_click" data-track-category="conversion" data-track-label="header">
```

**Step 2: Footer telefon linkine data-track ekle**

`src/app/components/footer/footer.html` (Line 87):
```html
<a [href]="'tel:' + contactInfo.phone" class="contact-row"
   data-track="phone_click" data-track-category="conversion" data-track-label="footer">
```

**Step 3: Contact page telefon linklerine data-track ekle**

`src/app/pages/contact/contact.html` (Lines 108-109):
```html
<a href="tel:{{contactInfo.phone}}" class="info-link"
   data-track="phone_click" data-track-category="conversion" data-track-label="contact_clinic">
<a href="tel:{{contactInfo.mobilePhone}}" class="info-link"
   data-track="phone_click" data-track-category="conversion" data-track-label="contact_mobile">
```

**Step 4: Contact CTA bileşenine data-track ekle**

`src/app/components/contact-cta/contact-cta.component.html` — telefon linkine aynı pattern:
```html
data-track="phone_click" data-track-category="conversion" data-track-label="cta_section"
```

**Step 5: Build doğrulama**

Run: `npm run build 2>&1 | tail -20`
Expected: Build successful

**Step 6: Commit**

```bash
git add src/app/components/header/header.component.html \
        src/app/components/footer/footer.html \
        src/app/pages/contact/contact.html \
        src/app/components/contact-cta/contact-cta.component.html
git commit -m "feat: add phone click tracking with data-track attributes"
```

---

## Task 4: WhatsApp Tıklama Dönüşüm İzleme

**Files:**
- Modify: `src/app/components/whatsapp-button/whatsapp-button.ts`
- Modify: `src/app/components/header/header.component.html` (Line 11)
- Modify: `src/app/components/contact-cta/contact-cta.component.html`

**Step 1: WhatsApp floating button'a data-track ekle**

`src/app/components/whatsapp-button/whatsapp-button.ts` — template'deki ana `<a>` tagına:
```html
data-track="whatsapp_click" data-track-category="conversion" data-track-label="floating_button"
```

**Step 2: Header WhatsApp linkine data-track ekle**

`src/app/components/header/header.component.html` (Line 11):
```html
data-track="whatsapp_click" data-track-category="conversion" data-track-label="header"
```

**Step 3: Contact CTA WhatsApp linkine data-track ekle**

`src/app/components/contact-cta/contact-cta.component.html` — WhatsApp butonuna:
```html
data-track="whatsapp_click" data-track-category="conversion" data-track-label="cta_section"
```

**Step 4: Build doğrulama**

Run: `npm run build 2>&1 | tail -20`
Expected: Build successful

**Step 5: Commit**

```bash
git add src/app/components/whatsapp-button/whatsapp-button.ts \
        src/app/components/header/header.component.html \
        src/app/components/contact-cta/contact-cta.component.html
git commit -m "feat: add WhatsApp click tracking with data-track attributes"
```

---

## Task 5: Form Gönderim Dönüşüm İzleme

**Files:**
- Modify: `src/app/pages/contact/contact.html` (Line 23 — form tag)
- Modify: `src/app/pages/contact/contact.ts` (Lines 61-71 — onSubmit)

**Step 1: Form element'ine name attribute ekle**

`src/app/pages/contact/contact.html` — form tagına:
```html
<form ... name="contact_form">
```

**Step 2: onSubmit metoduna dataLayer push ekle**

`src/app/pages/contact/contact.ts` — `onSubmit()` metoduna (mevcut alert'ten önce):

```typescript
// Push conversion event to dataLayer
if (typeof window !== 'undefined' && (window as any).dataLayer) {
  (window as any).dataLayer.push({
    event: 'form_submission',
    form_name: 'contact_form',
    conversion_type: 'lead'
  });
}
```

**Step 3: Build doğrulama**

Run: `npm run build 2>&1 | tail -20`
Expected: Build successful

**Step 4: Commit**

```bash
git add src/app/pages/contact/contact.html src/app/pages/contact/contact.ts
git commit -m "feat: add contact form submission conversion tracking"
```

---

## Task 6: WhatsApp Numarası Tutarlılığı Düzeltmesi

**Files:**
- Modify: `src/app/components/contact-cta/contact-cta.component.html` (Line 21 — yanlış numara)
- Modify: `src/app/components/appointment-widget/appointment-widget.component.ts` (Lines 43, 58)

**Step 1: Contact CTA'daki placeholder numarayı düzelt**

`src/app/components/contact-cta/contact-cta.component.html` Line 21:
- Bul: `905300000000` (placeholder)
- Değiştir: `905466884483` (gerçek WhatsApp numarası)

**Step 2: Appointment widget numaralarını doğrula ve düzelt**

`src/app/components/appointment-widget/appointment-widget.component.ts`:
- Line 43: WhatsApp numarasını `905466884483` olarak doğrula
- Line 58: Telefon numarasını `+902166884483` olarak doğrula

**Step 3: Tüm tel: ve WhatsApp linklerinin tutarlılığını kontrol et**

Run: `grep -rn "tel:" src/app/ --include="*.html" --include="*.ts" | grep -v node_modules`
Run: `grep -rn "wa.me\|whatsapp" src/app/ --include="*.html" --include="*.ts" | grep -v node_modules`

Expected: Tüm numaralar tutarlı:
- Klinik: `+902166884483`
- Mobil/WhatsApp: `+905466884483`

**Step 4: Commit**

```bash
git add src/app/components/contact-cta/contact-cta.component.html \
        src/app/components/appointment-widget/appointment-widget.component.ts
git commit -m "fix: normalize phone/WhatsApp numbers across all components"
```

---

## Task 7: Google Ads Conversion Tag Entegrasyonu (dataLayer)

**Files:**
- Modify: `src/index.html` (veya GTM container üzerinden)

**Step 1: Google Ads global site tag'ini GTM ile entegre et**

Bu adım GTM web arayüzünde yapılır (kod tarafı değil), ancak alternatif olarak doğrudan index.html'e eklenebilir.

**Seçenek A — GTM Web Arayüzü (Önerilen):**
GTM container'da (GTM-WTVF5SJ5):
1. Tags > New > Google Ads Conversion Tracking
2. Conversion ID: `1330325749` (AW-1330325749)
3. Conversion Label: Google Ads'den alınacak (kampanya oluşturulunca)
4. Trigger: Custom Event — `phone_click` OR `whatsapp_click` OR `form_submission`

**Seçenek B — Doğrudan kod (yedek):**

Eğer GTM yerine doğrudan eklemek istenirse, `src/index.html` head'e:

```html
<!-- Google Ads Global Site Tag -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-1330325749"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-1330325749');
</script>
```

**Step 2: Dönüşüm event'lerini Google Ads'e yönlendir**

GTM'de veya doğrudan kodda — her dönüşüm aksiyonu için `gtag('event', 'conversion', ...)`:

```javascript
// Phone click conversion (analytics service veya GTM trigger ile)
gtag('event', 'conversion', {
  'send_to': 'AW-1330325749/PHONE_LABEL',
  'value': 150.0,
  'currency': 'TRY'
});
```

Not: `PHONE_LABEL` değeri Google Ads'de kampanya oluşturulunca sağlanacak.

**Step 3: Commit (sadece Seçenek B uygulandıysa)**

```bash
git add src/index.html
git commit -m "feat: add Google Ads global site tag for conversion tracking"
```

---

## Task 8: Hizmet Sayfalarında CTA Görünürlüğü Artırma

**Files:**
- Modify: Tüm hizmet sayfaları (`src/app/pages/services/` altındaki component template'leri)

**Step 1: Her hizmet sayfasının sonundaki CTA bölümünü kontrol et**

Her hizmet sayfası şu elementleri içermeli:
- Telefon numarası (click-to-call, data-track ile)
- WhatsApp butonu (data-track ile)
- "Randevu Al" CTA butonu

**Step 2: Eksik CTA'ları ekle**

Mevcut `<app-contact-cta>` bileşeni kullanılabilir. Her hizmet sayfasının alt kısmında yoksa ekle:

```html
<app-contact-cta></app-contact-cta>
```

**Step 3: Build doğrulama**

Run: `npm run build 2>&1 | tail -20`

**Step 4: Commit**

```bash
git add src/app/pages/services/
git commit -m "feat: ensure CTA sections on all service pages for ad landing"
```

---

## Task 9: Landing Page için Sayfa Hızı Optimizasyonu

**Files:**
- Referans: `scripts/lighthouse-test.js`

**Step 1: Mevcut Lighthouse skorunu ölç**

Run: `node scripts/lighthouse-test.js`
Ya da: Chrome DevTools > Lighthouse > Performance audit

Expected baseline: Performance > 80, Best Practices > 90

**Step 2: Core Web Vitals kontrol**

Önemli metrikler (Google Ads Quality Score etkisi):
- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1

**Step 3: Gerekli düzeltmeleri uygula**

Yaygın sorunlar:
- Lazy loading olmayan görseller
- Render-blocking CSS/JS
- Font display swap eksikliği

**Step 4: Sonuçları dokümante et ve commit**

---

## Task 10: GBP Manager Script'ini Güncelle — İçerik Takvimi Desteği

**Files:**
- Modify: `scripts/google-ads/gbp-manager.mjs`

**Step 1: GBP post oluşturma fonksiyonu ekle**

Mevcut `gbp-manager.mjs`'e haftalık içerik takvimi desteği ekle:

```javascript
async function createPost(type, content, callToAction) {
  // type: 'SERVICE', 'TIP', 'OFFER'
  // callToAction: { actionType: 'CALL', url: 'tel:+902166884483' }
  const post = {
    languageCode: 'tr',
    summary: content,
    callToAction,
    topicType: type === 'OFFER' ? 'OFFER' : 'STANDARD'
  };
  // GBP API call
}
```

**Step 2: Haftalık post şablonları oluştur**

```javascript
const weeklyTemplates = {
  monday: { type: 'SERVICE', topic: 'hizmet tanıtımı' },
  wednesday: { type: 'TIP', topic: 'sağlık ipucu' },
  friday: { type: 'OFFER', topic: 'teklif/etkinlik' }
};
```

**Step 3: Commit**

```bash
git add scripts/google-ads/gbp-manager.mjs
git commit -m "feat: add GBP post creation and weekly content calendar support"
```

---

## Görev Özeti

| # | Görev | Öncelik | Etki |
|---|-------|---------|------|
| 1 | GTM script'ini index.html'e ekle | Kritik | Tüm izlemenin temeli |
| 2 | Analytics service'i aktifleştir | Kritik | GA4 veri toplama başlar |
| 3 | Telefon tıklama izleme | Kritik | Birincil dönüşüm metriği |
| 4 | WhatsApp tıklama izleme | Yüksek | İkincil dönüşüm metriği |
| 5 | Form gönderim izleme | Yüksek | Lead yakalama |
| 6 | Numara tutarlılığı | Yüksek | GFN entegrasyonu için gerekli |
| 7 | Google Ads conversion tag | Kritik | Kampanya optimizasyonu |
| 8 | Hizmet sayfaları CTA | Orta | Landing page kalitesi |
| 9 | Sayfa hızı optimizasyonu | Orta | Quality Score etkisi |
| 10 | GBP manager güncelleme | Düşük | İçerik takvimi otomasyonu |

---

## Google Ads Kampanya Kurulumu (Platform Tarafı — kod dışı)

Aşağıdaki adımlar Google Ads web arayüzünde yapılır:

### A. Hesap Bağlantıları
1. Google Ads (1330325749) ↔ GA4 (G-FJW4LXJ4T8) bağlantısı
2. Google Ads ↔ GBP (Place ID: ChIJ83R9VUTJyhQRM2o-M-eoZyQ) bağlantısı

### B. Dönüşüm Aksiyonları Oluştur
1. "Telefon Araması" — kategori: Phone call, değer: 150 TL
2. "WhatsApp Mesajı" — kategori: Lead, değer: 75 TL
3. "Form Gönderimi" — kategori: Lead, değer: 100 TL

### C. Kampanyalar Oluştur
Tasarım dokümanına göre 3 kampanya (bkz. `docs/plans/2026-02-27-google-ads-gbp-strategy-design.md`):
1. Ana Hizmet Aramaları (Search, bütçenin %50'si)
2. Özel Programlar (Search, bütçenin %25'i)
3. Performance Max (PMax, bütçenin %25'i — GBP entegrasyonlu)

### D. Uzantılar
- Konum uzantısı (GBP'den otomatik)
- Arama uzantısı: +90 216 688 44 83
- Site bağlantısı: Hizmetler, Hakkımızda, Randevu, İletişim
- Açıklama uzantıları: "Bright Futures® Sertifikalı", "7 Uzmanlık Alanı", "AAP Standartları"

### E. Anahtar Kelimeler ve Negatifler
Tasarım dokümanındaki Tier 1 / Tier 2 anahtar kelimeleri ve negatif listeleri uygula.
