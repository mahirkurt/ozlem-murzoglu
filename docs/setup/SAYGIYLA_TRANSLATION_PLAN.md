# Saygıyla Bölümü Çeviri Sorunları ve Çözüm Planı

## 🔍 Tespit Edilen Sorunlar

### 1. Ana Sayfa (saygiyla.html)
✅ **ÇÖZÜLDÜ:**
- Featured section başlıkları (satır 102-103)
- Timeline section başlıkları (satır 145-146)
- "Hikayesini Oku" ve "Detaylar" linkleri

### 2. Alt Sayfalar
**Durum:** Çoğu alt sayfa sabit Türkçe metinler içeriyor

| Sayfa | Çeviri Kullanımı | Durum |
|-------|------------------|--------|
| Atatürk | ✅ 63 çeviri | Tamamlandı |
| Jonas Salk | ❌ 1 çeviri | Düzeltilmeli |
| Louis Pasteur | ❌ 1 çeviri | Düzeltilmeli |
| Virginia Apgar | ❌ 1 çeviri | Düzeltilmeli |
| İhsan Doğramacı | ❌ 1 çeviri | Düzeltilmeli |
| Türkan Saylan | ❌ 1 çeviri | Düzeltilmeli |
| Malala Yousafzai | ❌ 1 çeviri | Düzeltilmeli |
| Ursula Le Guin | ❌ 1 çeviri | Düzeltilmeli |
| Anılar | ✅ 3 çeviri | Kontrol edilmeli |
| Teşekkürler | ✅ 4 çeviri | Kontrol edilmeli |

## 📋 Çözüm Stratejisi

### Aşama 1: Çeviri Anahtarları Oluşturma
Her alt sayfa için gerekli çeviri anahtarlarını tanımla:
- Hero section (başlık, alt başlık, tarih)
- Biography section
- Contributions
- Legacy
- Quotes

### Aşama 2: JSON Dosyalarını Güncelleme
- `en.json` ve `tr.json` dosyalarına tüm anahtarları ekle
- Her öncü için ayrı bir alt nesne oluştur

### Aşama 3: Component Güncellemeleri
- Her alt sayfanın HTML dosyasını güncelle
- Sabit metinleri çeviri pipe'ları ile değiştir
- TranslateModule import edildiğinden emin ol

### Aşama 4: Test ve Doğrulama
- Her sayfayı hem TR hem EN modda test et
- Screenshot'lar al
- Eksik çevirileri tespit et

## 🛠️ Uygulama Adımları

### 1. Jonas Salk Sayfası Örnek Düzeltme

**Mevcut Durum:**
```html
<h1 class="hero-title">Dr. Jonas Salk</h1>
<p class="hero-subtitle">Güneşi Patentlemeyen Adam</p>
```

**Düzeltilmiş Hali:**
```html
<h1 class="hero-title">{{ 'SAYGIYLA.PIONEERS.JONAS_SALK.NAME' | translate }}</h1>
<p class="hero-subtitle">{{ 'SAYGIYLA.PIONEERS.JONAS_SALK.SUBTITLE' | translate }}</p>
```

### 2. Çeviri Anahtarları Şablonu

```json
"JONAS_SALK": {
  "NAME": "Dr. Jonas Salk",
  "SUBTITLE": "The Man Who Didn't Patent the Sun",
  "LIFESPAN": "1914 - 1995",
  "NATIONALITY": "American",
  "SECTION_INTRO": "Introduction",
  "INTRO_TEXT": "...",
  "SECTION_POLIO": "The Fight Against Polio",
  "POLIO_P1": "...",
  "QUOTE_PATENT": "Can you patent the sun?",
  // ... diğer anahtarlar
}
```

## 📊 Öncelik Sırası

1. **Yüksek Öncelik:** Jonas Salk, Louis Pasteur, Virginia Apgar (Tıp öncüleri)
2. **Orta Öncelik:** İhsan Doğramacı, Türkan Saylan, Malala Yousafzai
3. **Düşük Öncelik:** Ursula Le Guin, Anılar, Teşekkürler

## ✅ Tamamlanan İşler

- [x] Ana sayfa çeviri sorunları düzeltildi
- [x] Eksik çeviri anahtarları eklendi (FEATURED_STORIES_TITLE, TIMELINE_TITLE, vb.)
- [x] Atatürk sayfası tamamen çevrildi
- [ ] Diğer alt sayfalar beklemede

## 🚀 Sonraki Adımlar

1. Her alt sayfa için detaylı içerik analizi
2. Çeviri anahtarlarının toplu oluşturulması
3. Batch güncelleme scripti yazılması
4. Test otomasyonu kurulması