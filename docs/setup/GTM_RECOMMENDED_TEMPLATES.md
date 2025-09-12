# Google Tag Manager - Önerilen Etiket Şablonları

## 🏥 Sağlık/Klinik Sitesi İçin Kritik Etiketler

### 1. ✅ **Google Analytics: GA4 Configuration** (ZORUNLU)
- **Neden:** Tüm analytics takibinin temeli
- **Measurement ID:** G-FJW4LXJ4T8
- **Trigger:** All Pages

### 2. ✅ **Google Analytics: GA4 Event** (ZORUNLU)
- **Kullanım Alanları:**
  - Randevu butonu tıklamaları
  - Telefon/WhatsApp tıklamaları
  - Form gönderimi
  - PDF indirmeleri (bilgi formları)

### 3. 📞 **Google Ads Conversion Tracking**
- **Neden:** Google Ads kullanıyorsanız veya kullanacaksanız
- **Kullanım:** Randevu alımı, telefon araması gibi dönüşümleri takip

### 4. 🎯 **Google Ads Remarketing**
- **Neden:** Siteyi ziyaret edenlere tekrar reklam göstermek için
- **Özellikle:** Hizmetler sayfasını görüntüleyenler için

### 5. 📱 **Facebook Pixel** (Meta Pixel)
- **Neden:** Facebook/Instagram reklamları için
- **Takip Edilecekler:**
  - PageView
  - ViewContent (hizmet sayfaları)
  - Contact (iletişim)
  - Lead (randevu talebi)

### 6. 🔍 **Google Site Search**
- **Neden:** Site içi aramalar varsa kullanıcı davranışını anlamak için

### 7. 📊 **Scroll Depth**
- **Neden:** İçerik okunma oranlarını ölçmek
- **Özellikle:** Blog yazıları ve bilgi sayfaları için

### 8. ⏱️ **Timer Trigger**
- **Neden:** Sayfada geçirilen süreyi ölçmek
- **Kullanım:** Kaliteli ziyaretçileri anlamak

---

## 🚀 Kurulum Öncelik Sırası

### Faz 1: Temel Takip (Hemen Kurulması Gerekenler)
1. **GA4 Configuration**
2. **GA4 Event - Page View**
3. **GA4 Event - Contact Click** (telefon/whatsapp)
4. **GA4 Event - Scroll Depth**

### Faz 2: Dönüşüm Takibi (1-2 Hafta İçinde)
5. **GA4 Event - Form Submit**
6. **GA4 Event - Appointment Button Click**
7. **Google Ads Conversion** (reklam veriyorsanız)

### Faz 3: Gelişmiş Takip (1 Ay İçinde)
8. **Facebook Pixel**
9. **Google Ads Remarketing**
10. **Enhanced Conversions**

---

## 📋 Özel Sağlık Sektörü Etiketleri

### Randevu Sistemi Takibi
```javascript
// Custom HTML Tag örneği
<script>
  dataLayer.push({
    'event': 'appointment_interaction',
    'appointment_type': 'online',
    'appointment_action': 'view_calendar',
    'service_category': 'pediatri'
  });
</script>
```

### Hizmet Sayfası Görüntüleme
```javascript
// Hangi hizmetin görüntülendiğini takip
<script>
  dataLayer.push({
    'event': 'service_view',
    'service_name': '{{Page Path}}',
    'service_category': 'muayene'
  });
</script>
```

### Doktor Bilgisi Görüntüleme
```javascript
<script>
  dataLayer.push({
    'event': 'doctor_info_view',
    'section': 'hakkimizda',
    'content_depth': '{{Scroll Depth}}'
  });
</script>
```

---

## 🎯 Dönüşüm Hedefleri

### Birincil Dönüşümler (Primary Conversions)
1. **Telefon Araması** - Tel link tıklama
2. **WhatsApp Mesajı** - WhatsApp link tıklama
3. **Randevu Formu** - Form gönderimi
4. **Harita Yönlendirme** - Google Maps tıklama

### İkincil Dönüşümler (Secondary Conversions)
5. **Bilgi İndirme** - PDF/Doküman indirme
6. **Video İzleme** - Eğitim videoları (varsa)
7. **Blog Okuma** - 75%+ scroll depth
8. **Sosyal Medya** - Sosyal link tıklamaları

---

## 🔧 Teknik Etiketler

### Site Performansı
- **Core Web Vitals** - Sayfa hızı metrikleri
- **404 Error Tracking** - Hatalı sayfa takibi
- **JavaScript Error Tracking** - Site hatalarını takip

### Güvenlik ve Uyumluluk
- **Cookie Consent** - KVKK uyumluluğu için
- **User ID Tracking** - Giriş yapan kullanıcılar için (opsiyonel)

---

## 📱 Mobil Özel Etiketler

### Click-to-Call (Mobilde Arama)
- Mobil cihazlarda doğrudan arama takibi
- Butt dial önleme için confirmation eventi

### App Download Tracking
- Mobil uygulama varsa indirme takibi

---

## ⚡ Hızlı Kurulum Şablonları

GTM'de **"Gallery"** bölümünden hazır şablonlar:

1. **"Google Analytics 4"** - Temel GA4 kurulumu
2. **"Conversion Linker"** - Google Ads için gerekli
3. **"Facebook Pixel"** - Meta reklamları için
4. **"Scroll Tracking"** - Sayfa kaydırma takibi
5. **"YouTube Video Tracking"** - Video metrikleri

---

## 🚨 Önemli Notlar

1. **KVKK Uyumluluğu:** Cookie consent olmadan tracking yapmayın
2. **Site Hızı:** Çok fazla tag site hızını etkileyebilir
3. **Test:** Her tag'i önce Preview mode'da test edin
4. **Dokümantasyon:** Her tag için not ekleyin

---

## 📊 Başarı Metrikleri

Tag'lerinizin başarısını ölçmek için:
- **Bounce Rate:** < %40 hedefleyin
- **Session Duration:** > 2 dakika
- **Pages/Session:** > 3 sayfa
- **Contact Rate:** %2-5 arası
- **Scroll Depth:** Blog için %50+

---

## 🎓 Eğitim Kaynakları

- [GA4 Event Builder](https://ga-dev-tools.google/ga4/event-builder/)
- [GTM Templates Gallery](https://tagmanager.google.com/gallery/)
- [Google Analytics Academy](https://analytics.google.com/analytics/academy/)