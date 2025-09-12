# Google Tag Manager - Tag Oluşturma Rehberi

## 1. GTM Paneline Giriş
1. https://tagmanager.google.com/ adresine gidin
2. **ozlemmurzoglu.com (GTM-WTVF5SJ5)** container'ını seçin

---

## 2. Önerilen Tag'ler

### A. Google Analytics 4 Configuration Tag
**Bu tag zaten kurulu olmalı, kontrol edin:**

1. **Tags** > **New** tıklayın
2. **Tag Configuration** > **Google Analytics: GA4 Configuration**
3. **Measurement ID:** G-FJW4LXJ4T8
4. **Triggering:** All Pages
5. Tag adı: "GA4 - Configuration"

### B. Page View Tracking
1. **Tags** > **New**
2. **Tag Type:** Google Analytics: GA4 Event
3. **Configuration Tag:** GA4 - Configuration (yukarıdaki tag'i seçin)
4. **Event Name:** page_view
5. **Triggering:** All Pages
6. Tag adı: "GA4 - Page View"

### C. Scroll Tracking (Sayfa Kaydırma)
1. **Tags** > **New**
2. **Tag Type:** Google Analytics: GA4 Event
3. **Event Name:** scroll
4. **Event Parameters:**
   - percent_scrolled: {{Scroll Depth Threshold}}
5. **Triggering:** Scroll Depth trigger oluşturun:
   - Vertical Scroll Depths: 25, 50, 75, 90
6. Tag adı: "GA4 - Scroll Tracking"

### D. Outbound Link Clicks (Dış Bağlantı Tıklamaları)
1. **Tags** > **New**
2. **Tag Type:** Google Analytics: GA4 Event
3. **Event Name:** click
4. **Event Parameters:**
   - link_url: {{Click URL}}
   - link_text: {{Click Text}}
   - link_domain: {{Click URL Hostname}}
5. **Triggering:** Just Links, URL does not contain ozlemmurzoglu.com
6. Tag adı: "GA4 - Outbound Links"

### E. Contact Click Tracking (İletişim Tıklamaları)
1. **Tags** > **New**
2. **Tag Type:** Google Analytics: GA4 Event
3. **Event Name:** contact_click
4. **Event Parameters:**
   - contact_type: phone/whatsapp/email
   - contact_value: {{Click URL}}
5. **Triggering:** Click - All Elements
   - Click URL contains: tel: OR mailto: OR wa.me
6. Tag adı: "GA4 - Contact Clicks"

### F. File Download Tracking
1. **Tags** > **New**
2. **Tag Type:** Google Analytics: GA4 Event
3. **Event Name:** file_download
4. **Event Parameters:**
   - file_name: {{Click URL}}
   - file_extension: pdf/doc/xls
5. **Triggering:** Click URL matches: \.(pdf|doc|docx|xls|xlsx|zip)$
6. Tag adı: "GA4 - File Downloads"

---

## 3. Conversion Tracking (Dönüşüm Takibi)

### Randevu Butonu Tıklama
1. **Tags** > **New**
2. **Tag Type:** Google Analytics: GA4 Event
3. **Event Name:** appointment_click
4. **Event Parameters:**
   - button_text: {{Click Text}}
   - page_location: {{Page Path}}
5. **Triggering:** Click Classes contains: appointment-btn
6. Tag adı: "GA4 - Appointment Click"

---

## 4. Enhanced Ecommerce (Gelişmiş E-ticaret) - Opsiyonel

### Form Submission (Form Gönderimi)
1. **Tags** > **New**
2. **Tag Type:** Google Analytics: GA4 Event
3. **Event Name:** form_submit
4. **Event Parameters:**
   - form_id: {{Form ID}}
   - form_name: contact_form
5. **Triggering:** Form Submission
6. Tag adı: "GA4 - Form Submit"

---

## 5. Variables (Değişkenler) Oluşturma

### Built-in Variables Aktifleştirme
1. **Variables** > **Configure**
2. Şunları aktifleştirin:
   - **Clicks:** All
   - **Forms:** All
   - **History:** All
   - **Pages:** All
   - **Scrolling:** All
   - **Utilities:** All
   - **Videos:** All

### Custom Variables
1. **Scroll Depth Threshold**
   - Type: Data Layer Variable
   - Name: gtm.scrollThreshold

---

## 6. Triggers (Tetikleyiciler) Oluşturma

### Scroll Depth Trigger
1. **Triggers** > **New**
2. **Type:** Scroll Depth
3. **Vertical Scroll Depths:** 25, 50, 75, 90
4. Trigger adı: "Scroll Depth - Percentage"

### Outbound Link Trigger
1. **Triggers** > **New**
2. **Type:** Click - Just Links
3. **Some Link Clicks**
4. **Click URL** does not contain "ozlemmurzoglu.com"
5. Trigger adı: "Outbound Link Clicks"

### Contact Click Trigger
1. **Triggers** > **New**
2. **Type:** Click - All Elements
3. **Some Clicks**
4. **Click URL** matches RegEx: (tel:|mailto:|wa\.me)
5. Trigger adı: "Contact Clicks"

---

## 7. Preview ve Publish

### Preview Mode
1. Sağ üstteki **Preview** butonuna tıklayın
2. Site URL'nizi girin: https://ozlemmurzoglu.com
3. Tag Assistant ile tag'lerin çalıştığını kontrol edin

### Publish
1. Test ettikten sonra **Submit** butonuna tıklayın
2. Version adı ve açıklama girin
3. **Publish** tıklayın

---

## 8. Google Analytics'te Kontrol

1. https://analytics.google.com/ gidin
2. **Realtime** > **Events** bölümünden eventleri kontrol edin
3. **DebugView** ile detaylı debugging yapabilirsiniz

---

## 9. Özel Event'ler için JavaScript Kodu

Sitenize özel event'ler eklemek isterseniz:

```javascript
// Örnek: Özel buton tıklama eventi
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  'event': 'custom_button_click',
  'button_name': 'appointment',
  'button_location': 'header'
});
```

---

## 10. Test Checklist

- [ ] GA4 Configuration tag'i aktif mi?
- [ ] Page view eventi geliyor mu?
- [ ] Scroll tracking çalışıyor mu?
- [ ] Outbound linkler takip ediliyor mu?
- [ ] Telefon/WhatsApp tıklamaları kaydediliyor mu?
- [ ] Preview mode'da tüm tag'ler tetikleniyor mu?

---

## Notlar
- Tag'leri oluşturduktan sonra mutlaka Preview mode ile test edin
- Google Analytics Realtime raporlarında event'leri kontrol edin
- İlk 24 saat içinde tüm veriler Analytics'te görünmeyebilir
- Debug için Tag Assistant Chrome eklentisini kullanabilirsiniz