# Google Marketing Plan — Anahtar Kelime Stratejisi (v2)

> Amaç: Ataşehir merkezli pediatri aramalarında organik görünürlüğü, kaliteli trafiği ve randevu dönüşümünü sürdürülebilir şekilde artırmak.

---

## 1) Hızlı Özet

### Mevcut konumlandırma
Site, "Ataşehir çocuk doktoru" odağıyla konumlanıyor; sosyal pediatri, çocuk gelişimi, Bright Futures ve Triple P gibi güçlü farklılaştırıcı uzmanlık başlıklarına sahip.

### Rekabet resmi
- Doğrudan eşleşme avantajına sahip alan adları mevcut.
- Bölgesel klinikler aynı lokal niyeti hedefliyor.
- Zincir hastaneler yüksek domain otoritesiyle üst sıralarda baskın.

### Stratejik sonuç
Tek sayfalık "genel pediatri" yaklaşımı yetersiz. Çözüm: niyet-temelli katmanlı anahtar kelime mimarisi + net URL eşleme + sürekli ölçüm döngüsü.

---

## 2) Okunabilirlik ve Bakım Standartları

Bu doküman artık operasyonel bir plan olarak yönetilir. Dağınık liste yerine kayıt-temelli sistem kullanılır.

### 2.1 Zorunlu kayıt şeması
Her anahtar kelime aşağıdaki alanlarla kayıt altına alınır:

| Alan | Zorunlu | Açıklama |
|---|---|---|
| `id` | Evet | Benzersiz anahtar kelime kimliği (ör. KW-L1-001) |
| `keyword` | Evet | Hedef sorgu |
| `layer` | Evet | 1-5 arası katman |
| `intent` | Evet | Transactional / Commercial / Informational |
| `location` | Evet | Ataşehir / Komşu ilçe / İstanbul geneli |
| `target_url` | Evet | Tek hedef URL (cannibalization önleme) |
| `primary_or_secondary` | Evet | Primary / Secondary |
| `status` | Evet | Backlog / In Progress / Published / Refresh |
| `owner` | Evet | İçerik sorumlusu |
| `last_review` | Evet | Son gözden geçirme tarihi |

### 2.2 Adlandırma kuralı
- Katman 1: `KW-L1-###`
- Katman 2: `KW-L2-###`
- Katman 3: `KW-L3-###`
- Katman 4: `KW-L4-###`
- Katman 5: `KW-L5-###`

### 2.3 Örnek kayıt

```yaml
id: KW-L1-001
keyword: çocuk doktoru ataşehir
layer: 1
intent: Transactional
location: Ataşehir
target_url: /
primary_or_secondary: Primary
status: Published
owner: seo-team
last_review: 2026-03-14
```

---

## 3) 5 Katmanlı Anahtar Kelime Mimarisi

### Katman 1 — Çekirdek Lokal Terimler (Money Keywords)
Doğrudan randevu niyeti. En yüksek öncelik.

- `çocuk doktoru ataşehir`
- `ataşehir çocuk doktoru`
- `ataşehir pediatrist`
- `çocuk doktoru ataşehir randevu`
- `bebek doktoru ataşehir`
- `çocuk sağlığı uzmanı ataşehir`
- `özel çocuk doktoru ataşehir`
- `çocuk doktoru küçükbakkalköy`
- `çocuk doktoru kadıköy yakını`

Branded koruma:
- `dr özlem murzoğlu`
- `özlem murzoğlu pediatri`
- `özlem murzoğlu çocuk doktoru`

### Katman 2 — Hizmet Bazlı Terimler
Hizmet sayfaları için ticari niyet.

**Aşılama:**
- `çocuk aşı takvimi 2026`
- `bebek aşıları ataşehir`
- `aşı randevu istanbul`
- `6 aylık bebek aşıları hangileri`

**Yenidoğan/bebek takibi:**
- `yenidoğan muayene ataşehir`
- `bebek gelişim takibi`
- `sağlam çocuk kontrolü`
- `yenidoğan tarama testleri`

**Sosyal pediatri/gelişim:**
- `çocuk gelişim uzmanı ataşehir`
- `sosyal pediatri istanbul`
- `çocuk gelişim testi`
- `çocuk davranış problemleri uzman`

**Uyku danışmanlığı:**
- `bebek uyku danışmanlığı istanbul`
- `bebek uyku eğitimi`
- `bebek gece uyumama sorunu`

**Ebeveynlik programları:**
- `Triple P ebeveynlik programı istanbul`
- `olumlu ebeveynlik eğitimi`
- `Bright Futures çocuk takibi`

**Alerji ve beslenme:**
- `çocuklarda besin alerjisi`
- `bebek alerji testi ataşehir`
- `ek gıdaya geçiş danışmanlığı`

### Katman 3 — Uzun Kuyruk ve Bilgilendirici Terimler (Blog)
E-E-A-T ve YMYL güven sinyallerini güçlendirir.

**Acil/Kriz:**
- `bebek ateşi kaç derece tehlikeli`
- `çocukta kusma ishal ne yapmalı`
- `bebek döküntüsü ne anlama gelir`
- `çocuk nöbet geçirdi ne yapmalıyım`

**Mevsimsel:**
- `çocuklarda grip belirtileri tedavisi`
- `bahar alerjisi çocuklarda`
- `okula başlayan çocuk sürekli hasta`
- `güneş çarpması çocuklarda belirtileri`

**Gelişim:**
- `2 yaşında çocuk konuşmuyor ne yapmalı`
- `bebek boy kilo persentil hesaplama`
- `çocuklarda büyüme geriliği belirtileri`
- `çocukta dikkat eksikliği belirtileri`

**Beslenme/günlük bakım:**
- `6 aylık bebeğe hangi ek gıdalar verilir`
- `bebek emzik bırakma yaşı`
- `çocuklarda demir eksikliği belirtileri`
- `bebek diş çıkarma belirtileri ne yapılır`

### Katman 4 — Mahalle ve Komşu Bölge Genişlemesi
Local Pack kapsama alanını büyütmek için:

- `çocuk doktoru kadıköy`
- `bebek doktoru ümraniye`
- `çocuk doktoru maltepe`
- `pediatrist sancaktepe`
- `çocuk doktoru anadolu yakası`
- `çocuk doktoru içerenköy`
- `çocuk doktoru kayışdağı`

### Katman 5 — Rakip Boşluk (Content Gap)
Rakiplerin zayıf olduğu, uzmanlığa tam oturan nişler:

- `sosyal pediatri nedir`
- `Triple P ebeveynlik programı nedir`
- `Bright Futures çocuk sağlığı programı`
- `montessori çocuk kliniği`
- `emzirme danışmanlığı ataşehir`
- `çocuk uyku danışmanı istanbul`

---

## 4) Önceliklendirme Modeli (Performans Optimizasyonu)

Dağınık karar vermek yerine skor tabanlı model kullanılır.

### 4.1 Priority Score formülü

```text
Priority Score (0-100) =
0.35 * IntentScore +
0.25 * BusinessFitScore +
0.20 * LocalRelevanceScore +
0.15 * (100 - DifficultyScore) +
0.05 * SeasonalityBoost
```

### 4.2 Skor yorumlama
- `P0 (80-100)`: İlk 2 hafta yayınlanır.
- `P1 (60-79)`: 30 gün içinde yayınlanır.
- `P2 (40-59)`: İçerik takvimine alınır.
- `<40`: Backlog veya iptal.

### 4.3 Performans döngüsü
- Haftalık: Query ve page performans taraması.
- İki haftada bir: Düşük CTR sayfalarında başlık/meta revizyonu.
- Aylık: En düşük performanslı 10 URL için içerik yenileme.

---

## 5) Sayfa-Kelime Eşleme Kuralı (Cannibalization Önleme)

Her URL yalnızca 1 birincil anahtar kelime hedefler.

| URL | Primary | Secondary (2-3) |
|---|---|---|
| `/` | çocuk doktoru ataşehir | ataşehir çocuk doktoru, ataşehir pediatrist |
| `/hakkimizda` | dr özlem murzoğlu | özlem murzoğlu pediatri, özlem murzoğlu çocuk doktoru |
| `/hizmetler/asilar` | çocuk aşı takvimi 2026 | bebek aşıları ataşehir, aşı randevu istanbul |
| `/hizmetler/yenidogan-takibi` | yenidoğan muayene ataşehir | bebek gelişim takibi, sağlam çocuk kontrolü |
| `/hizmetler/sosyal-pediatri` | sosyal pediatri istanbul | çocuk gelişim uzmanı ataşehir, çocuk gelişim testi |
| `/hizmetler/uyku-danismanligi` | bebek uyku danışmanlığı istanbul | bebek uyku eğitimi, bebek gece uyumama sorunu |

---

## 6) Best Practices ve Tekrarlanabilir Patternler

### 6.1 Başlık ve meta patterni
- Title: 50-60 karakter, birincil terim solda.
- Meta description: 140-155 karakter, problem + çözüm + güven + CTA.

```text
Title: [Primary Keyword] | Uzm. Dr. Özlem Murzoğlu
Meta: [Semptom/İhtiyaç] için [hizmet yaklaşımı]. [Uzmanlık/güven sinyali]. [Randevu CTA].
```

### 6.2 İçerik patterni (YMYL güvenli)
- H1 tekil ve primary ile uyumlu.
- İlk 120 kelimede uzmanlık ve kapsam sınırı net.
- "Ne zaman doktora başvurulmalı?" bölümü zorunlu.
- En az 3 FAQ ve FAQ schema.
- Her yazıda hekim byline + güncellenme tarihi.

### 6.3 Internal linking patterni
- Her blog yazısı en az 2 hizmet sayfasına bağlanır.
- Her hizmet sayfası ilgili 2 blog yazısına bağlanır.
- Anchor text, hedef sorguyla semantik uyumlu seçilir.

---

## 7) Hata Yönetimi ve Edge Case Planı

| Senaryo | Risk | Tespit sinyali | Aksiyon |
|---|---|---|---|
| Keyword cannibalization | Yanlış URL sıralanır | Aynı sorguda birden çok URL dalgalanır | Primary eşlemeyi tek URL'e indir, diğerlerinde canonical/içerik yeniden yazım uygula |
| Sıfır hacim görünen ama niyetli sorgular | Fırsat kaçırma | Keyword tool düşük hacim, GSC'de impression var | Hacim yerine niyet + dönüşüm potansiyeli ile P1/P2 test yayını yap |
| Mevsimsel ani sıçrama | Geç tepki | Haftalık trend artışı > %30 | İçerik güncellemesini 72 saat içinde öne çek |
| Zincir hastane baskısı | İlk sayfaya çıkamama | Head terimde uzun süre 2. sayfa altı | Long-tail + mahalle varyantına pivot et |
| Yanlış coğrafi trafik | Düşük dönüşüm | Şehir dağılımında hedef dışı artış | Başlık/meta ve içerikte lokasyon sinyalini güçlendir |
| YMYL güven riski | Güven kaybı ve SEO riski | Kaynaksız iddia, belirsiz tedavi dili | Medikal doğrulama checklist'i olmadan yayınlama |
| Düşük CTR (yüksek impression) | Görünürlük var, trafik yok | CTR eşik altı (örn. <%2) | Title/meta A-B varyantı, 14 gün test döngüsü |
| İçerik eskimesi | Otorite kaybı | Son güncelleme > 180 gün | İçerik refresh kuyruğuna al, tarih ve byline güncelle |

---

## 8) Uygulama Yol Haritası

### Faz 1 (Hafta 1-2)
- URL-primary eşleme tablosunu kesinleştir.
- Katman 1 ve Katman 2 için kritik sayfaları optimize et.
- Title/meta pattern standardını tüm hedef sayfalarda uygula.

### Faz 2 (Ay 1-2)
- Katman 3 için aylık 4-6 içerik üret.
- Her içerikte FAQ schema + internal link standardı uygula.
- E-E-A-T unsurlarını (byline, uzmanlık, güncelleme tarihi) zorunlu kıl.

### Faz 3 (Ay 3-6)
- GSC verisiyle CTR düşük sayfaları optimize et.
- People Also Ask odaklı içerik kümeleri aç.
- Kazanan başlık/meta patternlerini standartlaştır.

---

## 9) Ölçüm, Araçlar ve Operasyon Sıklığı

| Araç | Kullanım amacı | Çalışma sıklığı |
|---|---|---|
| Google Search Console | Query, impression, CTR, position takibi | Haftalık |
| Google Ads Keyword Planner | Hacim ve rekabet tahmini | Aylık |
| Google Trends | Mevsimsellik ve konu dalgası | Haftalık |
| Ubersuggest/Ahrefs | Rakip boşluk ve zorluk analizi | Aylık |

---

## 10) Yayın Öncesi Kalite Kontrol Listesi

- Primary keyword tek URL'e atanmış mı?
- Title ve meta karakter sınırları uygun mu?
- İçerik niyeti hedef sorguyla uyumlu mu?
- Medikal içerikte kaynak/doğruluk kontrolü yapıldı mı?
- En az 2 internal link eklendi mi?
- FAQ schema doğrulandı mı?
- Lokasyon sinyali (Ataşehir/komşu semt) net mi?

---

## 11) Beklenen Etki

Bu sürüm, anahtar kelime stratejisini liste odaklı bir metinden; ölçülebilir, bakım yapılabilir ve hata toleranslı bir SEO işletim sistemine dönüştürür. Böylece hem görünürlük hem de randevuya dönüşen trafik kalitesi artar.
