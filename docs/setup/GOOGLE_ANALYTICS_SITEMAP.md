# Google Analytics Site Haritası - ozlemmurzoglu.com

## 📊 Analytics Yapısı ve Sayfa Hiyerarşisi

### 1. Ana Sayfalar (Primary Pages)
```
/ (Ana Sayfa)
├── /hakkimizda (Hakkımızda)
├── /hizmetlerimiz (Hizmetlerimiz)
├── /kaynaklar (Kaynaklar/Bilgi Merkezi)
├── /blog (Blog)
├── /iletisim (İletişim)
└── /saygiyla (Saygıyla)
```

### 2. Hizmetler Alt Sayfaları (Services Sub-pages)
```
/hizmetlerimiz
├── /hizmetlerimiz/bebek-kontrolu
├── /hizmetlerimiz/cocuk-muayene
├── /hizmetlerimiz/gelisim-takibi
├── /hizmetlerimiz/asi-takibi
├── /hizmetlerimiz/triple-p
├── /hizmetlerimiz/bright-futures
├── /hizmetlerimiz/laboratuvar-goruntuleme
└── /hizmetlerimiz/uzaktan-danismanlik
```

### 3. Kaynaklar/Bilgi Merkezi (Resources)
```
/kaynaklar
├── /kaynaklar/gelisim-rehberleri
│   ├── /kaynaklar/gelisim-rehberleri/[age-groups]
│   └── (0-36 ay arası yaş grupları)
├── /kaynaklar/asilar
│   ├── /kaynaklar/asilar/asi-takvimi
│   └── /kaynaklar/asilar/hpv-asi-bilgi
├── /kaynaklar/hastaliklar
│   ├── /kaynaklar/hastaliklar/[disease-topics]
│   └── (Çeşitli hastalık konuları)
├── /kaynaklar/beslenme
│   ├── /kaynaklar/beslenme/anne-sutu
│   └── /kaynaklar/beslenme/ek-gida
└── /kaynaklar/guvenlik
    └── /kaynaklar/guvenlik/yangin-guvenlik
```

### 4. Blog Sayfaları
```
/blog
├── /blog/page/[number] (Sayfalama)
├── /blog/[blog-post-slug] (Blog yazıları)
└── /blog/kategori/[category] (Kategoriler)
```

### 5. Legal/Yasal Sayfalar
```
/legal
├── /legal/kvkk
├── /legal/privacy
└── /legal/terms
```

---

## 📈 Google Analytics Tracking Plan

### A. Sayfa Görüntüleme Takibi (Page Views)
| Sayfa Tipi | GA4 Event | Parametreler |
|------------|-----------|--------------|
| Ana Sayfa | page_view | page_location, page_title |
| Hizmet Sayfası | page_view | service_type, page_location |
| Blog Yazısı | page_view | content_type: "blog", author, category |
| Kaynak Sayfası | page_view | resource_type, age_group |

### B. Kullanıcı Etkileşimleri (User Interactions)
| Etkileşim | GA4 Event | Parametreler |
|-----------|-----------|--------------|
| Telefon Tıklama | contact_click | contact_type: "phone" |
| WhatsApp Tıklama | contact_click | contact_type: "whatsapp" |
| Harita Tıklama | contact_click | contact_type: "maps" |
| Form Gönderimi | form_submit | form_name: "appointment" |
| PDF İndirme | file_download | file_name, file_type |
| Video İzleme | video_view | video_title, video_duration |

### C. E-ticaret Benzeri Takip (Enhanced Conversions)
| Olay | GA4 Event | Amaç |
|------|-----------|------|
| Hizmet Görüntüleme | view_item | Hizmet detay sayfası görüntüleme |
| Randevu Başlatma | begin_checkout | Randevu formu açma |
| Randevu Tamamlama | purchase | Randevu onayı |

### D. Özel Boyutlar (Custom Dimensions)
- **user_type**: new_patient / returning_patient
- **content_language**: tr / en
- **service_interest**: Görüntülenen hizmet türü
- **age_group_interest**: İlgilenilen yaş grubu içeriği

### E. Özel Metrikler (Custom Metrics)
- **scroll_depth**: Sayfa kaydırma derinliği (%)
- **time_on_content**: İçerikte geçirilen süre
- **form_interaction_time**: Form doldurma süresi

---

## 🎯 Conversion Goals (Dönüşüm Hedefleri)

### Birincil Hedefler
1. **Telefon Araması** - Tel link tıklama
2. **WhatsApp Mesajı** - WhatsApp link tıklama
3. **Randevu Formu** - Form gönderimi
4. **Konum Görüntüleme** - Google Maps tıklama

### İkincil Hedefler
1. **Bilgi İndirme** - PDF/Doküman indirme
2. **Blog Okuma** - 3+ dakika okuma süresi
3. **Hizmet Araştırma** - 3+ hizmet sayfası görüntüleme
4. **Sosyal Medya** - Sosyal medya link tıklamaları

---

## 📱 Mobil vs Desktop Segmentasyonu

### Mobil Özel Takipler
- Click-to-call buton tıklamaları
- Swipe/scroll davranışları
- Mobil form doldurma oranları

### Desktop Özel Takipler
- Detaylı içerik okuma süreleri
- Mouse hover etkileşimleri
- Çoklu sekme kullanımı

---

## 🔄 Kullanıcı Yolculuğu (User Journey)

### Tipik Hasta Yolculuğu
```
1. Giriş Noktası
   ├── Organik Arama (%40)
   ├── Google My Business (%30)
   ├── Sosyal Medya (%20)
   └── Direkt (%10)

2. İlk Etkileşim
   ├── Ana Sayfa → Hakkımızda
   ├── Hizmetler → Spesifik Hizmet
   └── Blog → İlgili İçerik

3. Araştırma Aşaması
   ├── 2-3 Hizmet sayfası görüntüleme
   ├── Doktor bilgisi okuma
   └── Konum/İletişim kontrol

4. Dönüşüm
   ├── Telefon araması (%50)
   ├── WhatsApp mesajı (%30)
   ├── Form doldurma (%15)
   └── Harita yönlendirme (%5)
```

---

## 📊 Dashboard Yapısı

### Ana Dashboard Metrikleri
- Toplam ziyaretçi sayısı
- Benzersiz kullanıcı sayısı
- Sayfa görüntüleme
- Ortalama oturum süresi
- Bounce rate
- Dönüşüm oranı

### Özel Raporlar
1. **Hizmet Performansı** - Hangi hizmetler daha çok ilgi görüyor
2. **İçerik Etkileşimi** - Blog ve kaynak sayfası performansı
3. **Dönüşüm Hunisi** - Ziyaretçiden hastaya dönüşüm
4. **Kaynak/Ortam Analizi** - Trafiğin nereden geldiği

---

## 🏷️ UTM Parametreleri

### Sosyal Medya
```
?utm_source=instagram&utm_medium=social&utm_campaign=saglik_bilgileri
?utm_source=facebook&utm_medium=social&utm_campaign=hasta_hikayeleri
```

### Google My Business
```
?utm_source=gmb&utm_medium=organic&utm_campaign=local_listing
```

### E-posta Kampanyaları
```
?utm_source=email&utm_medium=newsletter&utm_campaign=asi_hatirlatma
```

---

## 📅 Raporlama Takvimi

### Günlük
- Ziyaretçi trafiği
- Dönüşüm sayıları
- Site hataları

### Haftalık
- Hizmet sayfası performansı
- Blog etkileşimleri
- Kaynak analizi

### Aylık
- Kapsamlı performans raporu
- Dönüşüm optimizasyon önerileri
- İçerik stratejisi güncellemesi

---

## 🔧 Teknik Implementasyon

### Google Tag Manager Konteyneri
- Container ID: GTM-WTVF5SJ5
- GA4 Measurement ID: G-FJW4LXJ4T8

### Aktif Tag'ler
1. GA4 Configuration
2. GA4 Page View
3. GA4 Scroll Tracking
4. GA4 Contact Clicks
5. GA4 Form Submission
6. Cookiebot CMP

### Data Layer Yapısı
```javascript
dataLayer.push({
  'event': 'page_view',
  'page_data': {
    'page_type': 'service',
    'service_name': 'bebek-kontrolu',
    'content_language': 'tr'
  },
  'user_data': {
    'user_type': 'new_visitor'
  }
});
```

---

## ✅ Kontrol Listesi

- [x] Google Analytics kurulumu
- [x] Google Tag Manager entegrasyonu
- [x] Cookiebot CMP (KVKK uyumluluğu)
- [x] Temel event tracking
- [ ] Enhanced ecommerce tracking
- [ ] Server-side tracking
- [ ] Google Analytics 4 audience oluşturma
- [ ] Custom alerts kurulumu

---

*Son Güncelleme: 2025-09-03*