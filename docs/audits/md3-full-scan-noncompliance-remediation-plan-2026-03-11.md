# MD3 Tam Yüzey Uyum Tespit Raporu ve Aşamalı Düzeltme Planı (2026-03-11)

## 0) Anayasa Referansı ve Denetim Çerçevesi

Bu rapor, tasarım anayasası ve belge zinciri sırasına göre hazırlanmıştır:

1. [MASTER STYLE GUIDE](../design/master-style-guide.md)
2. [MD3 Foundation Principles](../design/md3-foundation-principles.md)
3. [MD3 Token Governance](../design/md3-token-governance.md)
4. [MD3 Components Patterns](../design/md3-components-patterns.md)
5. [MD3 Motion / Shape / Accessibility](../design/md3-motion-shape-accessibility.md)
6. [MD3 Compliance Matrix](../design/md3-compliance-matrix.md)

Bu doküman, tüm sayfalarda MD3 uyumsuzluk tespitlerini ve faz bazlı düzeltme planını tek kaynaktan izlenebilir hale getirir.

---

## 1) Tarama Özeti (Toplam Görünüm)

Tarama çıktısında öne çıkan ihlal sınıfları:

- `raw-color-fn`: **500**
- `hardcoded-hex`: **362**
- `hardcoded-text`: **298**
- `raw-shadow`: **146**
- `legacy-token`: **67**
- `missing-focus-visible`: **37**
- `missing-reduced-motion`: **37**
- `hardcoded-aria/title`: **19**

> Yorum: Sistem genelinde en büyük açıklar token-bypass (ham renk/gölge) ve i18n/hardcoded metin katmanında yoğunlaşıyor.

---

## 1A) Token Çekirdeği Bulguları

### Kritik (P0)

1. [bright-futures-program.component.css](../../src/app/pages/services/bright-futures-program/bright-futures-program.component.css)
   - Çok yüksek seviyede hardcoded hex ve token override kalıntısı.
2. [triple-p.component.scss](../../src/app/pages/services/triple-p/triple-p.component.scss)
   - Yoğun ham `rgba(...)`/hex ve dekoratif yüzey karışımı.
3. [triple-p.component.css](../../src/app/pages/services/triple-p/triple-p.component.css)
   - Ek hardcoded fallback renkleri ve ham gradyanlar.
4. [bright-futures-journey.component.css](../../src/app/pages/resources/bright-futures-journey/bright-futures-journey.component.css)
   - Sayfa içinde toplu hardcoded renk seti.
5. [kategori.component.css](../../src/app/pages/kategori/kategori.component.css)
   - Legacy `--surface`, `--primary`, `--outline-*` alias kullanımı.

### Yüksek (P1)

- [saglikli-uykular.component.css](../../src/app/pages/services/saglikli-uykular/saglikli-uykular.component.css)
- [saglikli-uykular.component.scss](../../src/app/pages/services/saglikli-uykular/saglikli-uykular.component.scss)
- [laboratuvar-goruntuleme.component.scss](../../src/app/pages/services/laboratuvar-goruntuleme/laboratuvar-goruntuleme.component.scss)
- [laboratuvar-goruntuleme.component.css](../../src/app/pages/services/laboratuvar-goruntuleme/laboratuvar-goruntuleme.component.css)
- [services.scss](../../src/app/pages/services/services.scss)
- [services.css](../../src/app/pages/services/services.css)

---

## 1B) Spacing / Shape / Motion / Elevation Bulguları

### Kritik / Yüksek Gözlemler

- Ham `box-shadow` tanımları ve MD3 elevation token dışı gölge kalıpları.
- Durum geri bildiriminin state-layer yerine shadow/transform ağırlıklı kurulması.
- Bazı dosyalarda motion token disiplini yerine sabit geçiş süreleri.

### İlgili Dosyalar (Örnek)

- [service-base-styles.css](../../src/app/pages/services/service-base-styles.css)
- [sos-feeding.component.css](../../src/app/pages/services/sos-feeding/sos-feeding.component.css)
- [kaynaklar.component.css](../../src/app/pages/kaynaklar/kaynaklar.component.css)
- [resource-utilities.css](../../src/app/pages/resources/resource-utilities.css)

---

## 2) Bileşen / Yapı / i18n Bulguları

### Kritik (P0)

1. [bright-futures-journey.component.html](../../src/app/pages/resources/bright-futures-journey/bright-futures-journey.component.html)
   - Çok yüksek sayıda hardcoded görünür metin.
2. [klinik-tasarimi.component.html](../../src/app/pages/about/klinik-tasarimi/klinik-tasarimi.component.html)
   - Başlık/alt başlık/metin bloklarında hardcoded içerik yoğunluğu.

### Yüksek (P1)

Saygıyla alt sayfalarında hardcoded metin ve subtitle kaynaklı i18n sapmaları:

- [virginia-apgar.component.html](../../src/app/pages/saygiyla/virginia-apgar/virginia-apgar.component.html)
- [louis-pasteur.component.html](../../src/app/pages/saygiyla/louis-pasteur/louis-pasteur.component.html)
- [jonas-salk.component.html](../../src/app/pages/saygiyla/jonas-salk/jonas-salk.component.html)
- [turkan-saylan.component.html](../../src/app/pages/saygiyla/turkan-saylan/turkan-saylan.component.html)
- [ihsan-dogramaci.component.html](../../src/app/pages/saygiyla/ihsan-dogramaci/ihsan-dogramaci.component.html)
- [malala-yousafzai.component.html](../../src/app/pages/saygiyla/malala-yousafzai/malala-yousafzai.component.html)
- [waldo-nelson.component.html](../../src/app/pages/saygiyla/waldo-nelson/waldo-nelson.component.html)
- [ursula-leguin.component.html](../../src/app/pages/saygiyla/ursula-leguin/ursula-leguin.component.html)
- [nils-rosen.component.html](../../src/app/pages/saygiyla/nils-rosen/nils-rosen.component.html)

---

## 3A) Accessibility + Dark Mode Bulguları

### Yüksek (P1)

- `:hover` var, `:focus-visible` eksik dosyalar: **37**
- `transition/animation` var, `prefers-reduced-motion` eksik dosyalar: **37**

### Öncelikli Dosyalar

- [service-base-styles.css](../../src/app/pages/services/service-base-styles.css)
- [sos-feeding.component.css](../../src/app/pages/services/sos-feeding/sos-feeding.component.css)
- [kaynaklar.component.css](../../src/app/pages/kaynaklar/kaynaklar.component.css)
- [resource-content-styles.css](../../src/app/pages/resources/resource-content-styles.css)

---

## 3B) Final Görsel Doğrulama ve Aksiyon Çerçevesi

Hedef kabul kapıları:

1. Kritik + yüksek bulgu kapanışı tamamlanmış olacak.
2. Hardcoded hex / legacy token / raw shadow kalıntıları kapatılmış olacak.
3. Focus-visible + reduced-motion + forced-colors kapıları geçecek.
4. Dark mode’da no-pure-black ve tonal yüzey hiyerarşisi korunacak.

---

## 4) Compliance Matrix Eşlemesi (Açık / Kapalı)

### Kapalı (tamamlanan)

- Legal + Doküman Viewer + Resources kategori index dalgası (Batch 4) kapalı.
- İlgili dosyalar önceki sprintte token/i18n/a11y açısından güçlendirildi.
- Faz 1 P0 token çekirdeği dalgası kapalı: Bright Futures Program, Triple-P (CSS/SCSS), Bright Futures Journey, Kategori.
- Faz 2 servis üst dalga state-layer/elevation/motion kapanışı kapalı: Sağlıklı Uykular, Laboratuvar Görüntüleme, SOS Feeding, service-base stilleri.

### Açık (önceliklendirilmiş)

1. Playwright/Chromium doğrulama stabilizasyonu (`page.goto: Page crashed`, `networkidle` bağımlılığı, timeout) — [test-md3-compliance.spec.js](../../tests/e2e/test-md3-compliance.spec.js), [md3-visual-test.spec.js](../../tests/e2e/md3-visual-test.spec.js).
2. Kaynak yardımcı stil katmanında kalan legacy/token-bypass temizliği — [resource-content-styles.css](../../src/app/pages/resources/resource-content-styles.css), [clean-resource-styles.css](../../src/app/pages/resources/clean-resource-styles.css), [resource-utilities.css](../../src/app/pages/resources/resource-utilities.css), [base-resource-styles.css](../../src/app/pages/resources/base-resource-styles.css).
3. EN editoryal harmonizasyon backlog’u: Saygıyla içerik anahtarlarında `tr/en` birebir kalan metinlerin editoryal çeviri dalgası.

---

## 5) Aşama Aşama Düzeltme Planı

## Faz 0 — Baseline ve Kapsam Kilidi

**Süre:** 0.5 gün  
**Çıktı:** Dondurulmuş hedef dosya listesi + ölçüm baz çizgisi

- Tarama listesi bu dokümanla sabitlenir.
- P0/P1 dosya seti sprint kapsamına alınır.

## Faz 1 — Token Çekirdeği ve Legacy Alias Temizliği

**Süre:** 1.5 gün  
**Hedef:** hardcoded hex + legacy token alias kapanışı

Belge zinciri uygulama sırası (zorunlu):

1. Foundation: [md3-foundation-principles.md](../design/md3-foundation-principles.md)
2. Token governance: [md3-token-governance.md](../design/md3-token-governance.md)
3. Components patterns: [md3-components-patterns.md](../design/md3-components-patterns.md)
4. Motion/shape/a11y: [md3-motion-shape-accessibility.md](../design/md3-motion-shape-accessibility.md)
5. Matrix eşleme: [md3-compliance-matrix.md](../design/md3-compliance-matrix.md)

Öncelik dosyaları ve baseline envanteri:

| Dosya | Hex | Legacy alias | MD3 dışı box-shadow | Faz 1 eylemi |
|---|---:|---:|---:|---|
| [bright-futures-program.component.css](../../src/app/pages/services/bright-futures-program/bright-futures-program.component.css) | 199 | 0 | 34 | `:host` içi hardcoded `--md-sys-color-*` override temizliği + semantic alias katmanı + elevation token hizası |
| [triple-p.component.scss](../../src/app/pages/services/triple-p/triple-p.component.scss) | 20 | 0 | 10 | Purple/green hardcoded renklerin semantic role tokenlarına taşınması + raw shadow temizliği |
| [triple-p.component.css](../../src/app/pages/services/triple-p/triple-p.component.css) | 58 | 18 | 27 | Legacy `--shadow-*` köprüsünün kaldırılması + fallback hex’lerin tokenlara taşınması |
| [bright-futures-journey.component.css](../../src/app/pages/resources/bright-futures-journey/bright-futures-journey.component.css) | 55 | 0 | 14 | Sayfa içi amber hex setinin component-scope semantic alias katmanına geçirilmesi |
| [kategori.component.css](../../src/app/pages/kategori/kategori.component.css) | 10 | 23 | 4 | `--surface/--primary/--outline-*` aliaslarının `--md-sys-color-*` tokenlarına dönüştürülmesi |

Dosya-bazlı done kriterleri:

1. [bright-futures-journey.component.css](../../src/app/pages/resources/bright-futures-journey/bright-futures-journey.component.css)
   - `:root` içindeki hardcoded palette kaldırılacak; `:host` semantic alias katmanı kullanılacak.
   - `box-shadow` satırları `--md-sys-elevation-level*` ile hizalanacak.

2. [bright-futures-program.component.css](../../src/app/pages/services/bright-futures-program/bright-futures-program.component.css)
   - Component düzeyinde `--md-sys-color-*` hex override kalmayacak.
   - Section bazlı yüzeyler `surface-container-*` hiyerarşisine çekilecek.

3. [triple-p.component.scss](../../src/app/pages/services/triple-p/triple-p.component.scss) + [triple-p.component.css](../../src/app/pages/services/triple-p/triple-p.component.css)
   - Hardcoded purple/green palette semantic role-first token setine taşınacak.
   - `var(--shadow-sm|md|lg|xl)` kullanımı tamamen kaldırılacak.

4. [kategori.component.css](../../src/app/pages/kategori/kategori.component.css)
   - Legacy alias (`--surface`, `--primary`, `--outline-*`, `--on-*`) kullanımı sıfırlanacak.
   - Error/info badge renkleri MD3 semantic rol tokenlarıyla ifade edilecek.

Faz 1 teknik doğrulama komutları:

- `hex`: `python3` regex taramasında P0 dosyalarda `hex=0`
- `legacy`: P0 dosyalarda `var(--surface|--primary|--shadow-*)=0`
- `shadow`: P0 dosyalarda `box-shadow` için yalnız `--md-sys-elevation-level0..5`

Kapanış ölçütü:

- Hardcoded hex ve legacy token alias kalmaması.
- Yüzey ayrımı tonal-first + elevation-token-only modeliyle hizalanması.

### Faz 1 Uygulama Sonucu (2026-03-12)

Uygulama kapsamı (P0):

- [bright-futures-journey.component.css](../../src/app/pages/resources/bright-futures-journey/bright-futures-journey.component.css)
- [bright-futures-program.component.css](../../src/app/pages/services/bright-futures-program/bright-futures-program.component.css)
- [triple-p.component.scss](../../src/app/pages/services/triple-p/triple-p.component.scss)
- [triple-p.component.css](../../src/app/pages/services/triple-p/triple-p.component.css)
- [kategori.component.css](../../src/app/pages/kategori/kategori.component.css)

Sonuç özeti (baseline → kapanış):

| Dosya | Baseline | Son durum | Durum |
|---|---|---|---|
| [bright-futures-journey.component.css](../../src/app/pages/resources/bright-futures-journey/bright-futures-journey.component.css) | hex=55, legacy=0, raw shadow=14 | hex=0, legacy=0, raw shadow=0 | ✅ Kapalı |
| [bright-futures-program.component.css](../../src/app/pages/services/bright-futures-program/bright-futures-program.component.css) | hex=199, legacy=0, raw shadow=34 | hex=0, legacy=0, raw shadow=0 | ✅ Kapalı |
| [triple-p.component.scss](../../src/app/pages/services/triple-p/triple-p.component.scss) | hex=20, legacy=0, raw shadow=10 | hex=0, legacy=0, raw shadow=0 | ✅ Kapalı |
| [triple-p.component.css](../../src/app/pages/services/triple-p/triple-p.component.css) | hex=58, legacy=18, raw shadow=27 | hex=0, legacy=0, raw shadow=0 | ✅ Kapalı |
| [kategori.component.css](../../src/app/pages/kategori/kategori.component.css) | hex=10, legacy=23, raw shadow=4 | hex=0, legacy=0, raw shadow=0 | ✅ Kapalı |

Doğrulama kanıtları:

- Build kapısı geçti: `npm run build` (çıkış kodu 0).
- Route + CTA smoke (chromium) geçti: `15/15 passed`.
- Çoklu tarayıcı smoke denemesinde Firefox binary eksikliği görüldü; temel kapanış kapısı için chromium hedefli smoke kullanıldı.

Compliance matrix etkisi:

- `Hardcoded hex / legacy token / raw shadow` Faz 1 P0 kapsamında kapatıldı.
- Kalan açık maddeler Faz 2–Faz 4 kapsamına taşındı (state-layer/motion/a11y yatay kapanışları).

## Faz 2 — Elevation/State Layer ve Motion Disiplini

**Süre:** 1 gün  
**Hedef:** raw-shadow, shadow-first interaction ve motion sapmalarını kapatmak

Öncelik dosyaları:

- [saglikli-uykular.component.css](../../src/app/pages/services/saglikli-uykular/saglikli-uykular.component.css)
- [saglikli-uykular.component.scss](../../src/app/pages/services/saglikli-uykular/saglikli-uykular.component.scss)
- [laboratuvar-goruntuleme.component.scss](../../src/app/pages/services/laboratuvar-goruntuleme/laboratuvar-goruntuleme.component.scss)
- [sos-feeding.component.css](../../src/app/pages/services/sos-feeding/sos-feeding.component.css)
- [service-base-styles.css](../../src/app/pages/services/service-base-styles.css)

Kapanış ölçütü:

- Interaction geri bildirimi state-layer-first.
- Raw shadow yerine MD3 elevation tokenları.
- `prefers-reduced-motion` desteği.

### Faz 2 Uygulama Sonucu (2026-03-12)

Uygulama kapsamı:

- [saglikli-uykular.component.css](../../src/app/pages/services/saglikli-uykular/saglikli-uykular.component.css)
- [saglikli-uykular.component.scss](../../src/app/pages/services/saglikli-uykular/saglikli-uykular.component.scss)
- [laboratuvar-goruntuleme.component.scss](../../src/app/pages/services/laboratuvar-goruntuleme/laboratuvar-goruntuleme.component.scss)
- [laboratuvar-goruntuleme.component.css](../../src/app/pages/services/laboratuvar-goruntuleme/laboratuvar-goruntuleme.component.css) *(ek bulgu olarak dalgaya dahil edildi; aktif styleUrl bu dosyayı kullanıyor)*
- [sos-feeding.component.css](../../src/app/pages/services/sos-feeding/sos-feeding.component.css)
- [service-base-styles.css](../../src/app/pages/services/service-base-styles.css)

Baseline özeti (Faz 2 başlangıç taraması):

| Dosya | Baseline bulgu |
|---|---|
| [saglikli-uykular.component.css](../../src/app/pages/services/saglikli-uykular/saglikli-uykular.component.css) | raw shadow=14, hover=9, focus-visible=0, reduced-motion=0 |
| [saglikli-uykular.component.scss](../../src/app/pages/services/saglikli-uykular/saglikli-uykular.component.scss) | raw shadow=12, hover=8, focus-visible=0, reduced-motion=0 |
| [laboratuvar-goruntuleme.component.scss](../../src/app/pages/services/laboratuvar-goruntuleme/laboratuvar-goruntuleme.component.scss) | raw shadow=8, hover=10, focus-visible=0, reduced-motion=0 |
| [sos-feeding.component.css](../../src/app/pages/services/sos-feeding/sos-feeding.component.css) | raw shadow=0, hover=9, focus-visible=0, reduced-motion=0 |
| [service-base-styles.css](../../src/app/pages/services/service-base-styles.css) | raw shadow=0, hover=2, focus-visible=0, reduced-motion=0 |

Kapanış metrikleri (uygulama sonrası):

| Dosya | Son durum |
|---|---|
| [saglikli-uykular.component.css](../../src/app/pages/services/saglikli-uykular/saglikli-uykular.component.css) | raw shadow=0, legacy elevation var=0, hover=16, focus-visible=2, reduced-motion=1 |
| [saglikli-uykular.component.scss](../../src/app/pages/services/saglikli-uykular/saglikli-uykular.component.scss) | raw shadow=0, legacy elevation var=0, hover=16, focus-visible=2, reduced-motion=1 |
| [laboratuvar-goruntuleme.component.css](../../src/app/pages/services/laboratuvar-goruntuleme/laboratuvar-goruntuleme.component.css) | raw shadow=0, legacy elevation var=0, hover=29, focus-visible=2, reduced-motion=1 |
| [laboratuvar-goruntuleme.component.scss](../../src/app/pages/services/laboratuvar-goruntuleme/laboratuvar-goruntuleme.component.scss) | raw shadow=0, legacy elevation var=0, hover=20, focus-visible=2, reduced-motion=1 |
| [sos-feeding.component.css](../../src/app/pages/services/sos-feeding/sos-feeding.component.css) | raw shadow=0, legacy elevation var=0, hover=16, focus-visible=7, reduced-motion=1 |
| [service-base-styles.css](../../src/app/pages/services/service-base-styles.css) | raw shadow=0, legacy elevation var=0, hover=8, focus-visible=1, reduced-motion=1 |

Doğrulama kanıtları:

- Build kapısı geçti: `npm run build` (çıkış kodu 0).
- Route + CTA smoke (chromium) geçti: `15/15 passed`.

Compliance matrix etkisi:

- Faz 2 kapsamındaki `raw shadow`, `legacy elevation var`, `focus-visible`, `reduced-motion` eksikleri hedef dalgada kapatıldı.
- Açık maddeler Faz 3/Faz 4 odaklarına devredildi (i18n hardcoded metin temizliği + yatay forced-colors/focus kapanışı).

## Faz 3 — i18n ve Yapısal Metin Temizliği

**Süre:** 1.5 gün  
**Hedef:** hardcoded text/aria/title kapanışı

Öncelik dosyaları:

- [bright-futures-journey.component.html](../../src/app/pages/resources/bright-futures-journey/bright-futures-journey.component.html)
- [klinik-tasarimi.component.html](../../src/app/pages/about/klinik-tasarimi/klinik-tasarimi.component.html)
- Saygıyla alt sayfaları (P1 küme)

Kapanış ölçütü:

- Görünür tüm metinler translate key üzerinden.
- Hardcoded `aria-label` / `title` metinleri kapalı.

### Faz 3 Uygulama Sonucu (2026-03-16)

Uygulama kapsamı:

- [bright-futures-journey.component.html](../../src/app/pages/resources/bright-futures-journey/bright-futures-journey.component.html)
- [klinik-tasarimi.component.html](../../src/app/pages/about/klinik-tasarimi/klinik-tasarimi.component.html)
- [ataturk.component.html](../../src/app/pages/saygiyla/ataturk/ataturk.component.html)
- [ihsan-dogramaci.component.html](../../src/app/pages/saygiyla/ihsan-dogramaci/ihsan-dogramaci.component.html)
- [jonas-salk.component.html](../../src/app/pages/saygiyla/jonas-salk/jonas-salk.component.html)
- [louis-pasteur.component.html](../../src/app/pages/saygiyla/louis-pasteur/louis-pasteur.component.html)
- [malala-yousafzai.component.html](../../src/app/pages/saygiyla/malala-yousafzai/malala-yousafzai.component.html)
- [nils-rosen.component.html](../../src/app/pages/saygiyla/nils-rosen/nils-rosen.component.html)
- [turkan-saylan.component.html](../../src/app/pages/saygiyla/turkan-saylan/turkan-saylan.component.html)
- [ursula-leguin.component.html](../../src/app/pages/saygiyla/ursula-leguin/ursula-leguin.component.html)
- [virginia-apgar.component.html](../../src/app/pages/saygiyla/virginia-apgar/virginia-apgar.component.html)
- [waldo-nelson.component.html](../../src/app/pages/saygiyla/waldo-nelson/waldo-nelson.component.html)

Kapanış metrikleri (uygulama sonrası):

| Kontrol | Sonuç |
|---|---|
| Faz 3 hedef dosya taraması (raw `alt/title/subtitle/aria-label`) | `RAW_ATTR_COUNT=0` |
| Faz 3 hedef dosya taraması (visible raw text node, icon tokenları hariç) | `RAW_TEXT_COUNT=0` |
| i18n senkronizasyonu | `Missing keys=0`, `Used keys=1152` |
| Build kapısı | `npm run build` → çıkış kodu `0` |
| Route + CTA smoke (chromium) | `15/15 passed` |

Doğrulama kanıtları:

- i18n sync kapısı geçti: `npm run i18n:sync` (missing key bulunmadı).
- Build kapısı geçti: `npm run build` (çıkış kodu 0).
- Route + CTA smoke (chromium) geçti: `npx playwright test tests/e2e/route-cta-smoke.spec.js --config tests/config/playwright.config.js --project=chromium`.
- Saygıyla kalan son raw attribute kapatıldı: [jonas-salk.component.html](../../src/app/pages/saygiyla/jonas-salk/jonas-salk.component.html) içinde `alt="Dr. Jonas Salk"` -> `[alt]="'SAYGIYLA.PIONEERS.JONAS_SALK.NAME' | translate"`.

Kalan riskler / sonraki dalga:

- Saygıyla detay içerik anahtarlarında (`SAYGIYLA.PIONEERS.*.CONTENT.TEXT_*`) `tr/en` değerleri birebir aynı: `194` anahtar.
- Bu durum teknik i18n kapanışını etkilemiyor; ancak içerik kalitesi ve dil doğruluğu açısından P2 backlog maddesi olarak EN editoryal çeviri dalgası önerilir.

Compliance matrix etkisi:

- Faz 3 kapsamındaki `hardcoded text/aria/title` kapanış hedefi, hedef dosya kümesinde kapatıldı.
- Matrix üzerinde açık kalan madde: EN editoryal kalite harmonizasyonu (i18n teknik doğrulama dışında içerik seviyesi aksiyon).

## Faz 4 — A11y Kapıları (Yatay Dalga)

**Süre:** 1 gün  
**Hedef:** odak görünürlüğü ve erişilebilir hareket davranışı

- Hover tanımı olan her interaktif öğede `:focus-visible` zorunlu.
- Animasyon/geçiş kullanan her dosyada reduced-motion fallback.
- Forced-colors davranış kontrolü.

Kapanış ölçütü:

- `missing-focus-visible` ve `missing-reduced-motion` bulguları sıfırlanır.

### Faz 4 Uygulama Sonucu (2026-03-16)

Anayasa ve belge zinciri bağı:

- Non-negotiable: state-layer-first + erişilebilirlik kapıları ([master-style-guide.md](../design/master-style-guide.md)).
- Motion/a11y kapıları: `focus-visible`, `prefers-reduced-motion`, `forced-colors` ([md3-motion-shape-accessibility.md](../design/md3-motion-shape-accessibility.md)).

Uygulama kapsamı:

- [faq.scss](../../src/app/pages/faq/faq.scss)
- [resources.component.scss](../../src/app/pages/resources/resources.component.scss)
- [shared-styles.css](../../src/app/pages/resources/shared-styles.css)

Kapanış metrikleri (uygulama sonrası):

| Dosya | focus-visible | prefers-reduced-motion | forced-colors |
|---|---:|---:|---:|
| [faq.scss](../../src/app/pages/faq/faq.scss) | 12 | 1 | 1 |
| [resources.component.scss](../../src/app/pages/resources/resources.component.scss) | 10 | 1 | 1 |
| [shared-styles.css](../../src/app/pages/resources/shared-styles.css) | 10 | 1 | 1 |

Teknik doğrulama sonuçları:

| Kontrol | Sonuç |
|---|---|
| Hedef dosya pattern taraması (`outline: none`, `focus-visible`, `prefers-reduced-motion`, `forced-colors`) | Geçti |
| Build kapısı | `npm run build` → çıkış kodu `0` |
| Route + CTA smoke (chromium) | `15/15 passed` |

Doğrulama kanıtları:

- Pattern taraması: `grep -nE "outline:[[:space:]]*none|focus-visible|prefers-reduced-motion|forced-colors" src/app/pages/faq/faq.scss src/app/pages/resources/resources.component.scss src/app/pages/resources/shared-styles.css`
- A11y metrik taraması: `for f in src/app/pages/faq/faq.scss src/app/pages/resources/resources.component.scss src/app/pages/resources/shared-styles.css; do ...; done`
- Build kapısı: `npm run build`
- Route + CTA smoke (chromium): `npx playwright test tests/e2e/route-cta-smoke.spec.js --config tests/config/playwright.config.js --project=chromium`

Compliance matrix etkisi:

- Faz 4 hedef dalgada `missing-focus-visible`, `missing-reduced-motion` ve forced-colors eksikleri kapatıldı.
- A11y yatay kapanış, Faz 5 matrix/doğrulama dalgasına taşınabilir durumda.

## Faz 5 — Doğrulama, Matrix Güncellemesi, Yayın Hazırlığı

**Süre:** 0.5 gün  
**Hedef:** kalite kapıları + izlenebilir kapanış

- Build + route smoke + gerekli görsel regresyon testleri.
- [MD3 Compliance Matrix](../design/md3-compliance-matrix.md) güncellemesi.
- Kalan risk listesi ve sonraki dalga backlog’u.

### Faz 5 Uygulama Sonucu (2026-03-16)

Anayasa ve belge zinciri bağı:

- Karar önceliği ve kalite kapıları: [master-style-guide.md](../design/master-style-guide.md)
- Motion/a11y doğrulama kapıları: [md3-motion-shape-accessibility.md](../design/md3-motion-shape-accessibility.md)
- Workflow A/Faz 5 matrix işaretleme adımı: [md3-agent-workflows.md](../design/md3-agent-workflows.md)

Doğrulama sonuçları:

| Kontrol | Sonuç |
|---|---|
| Build kapısı | `npm run build` → çıkış kodu `0` |
| Route + CTA smoke (Chromium) | `15/15 passed` |
| CTA spacing görsel/smoke | `1/1 passed` |
| Kapsamlı MD3 compliance suite | `21 failed` *(ortam/stabilizasyon riski)* |
| Tekil MD3 a11y visual testi | `1 failed` *(Chromium page crash)* |

Faz 5’te güncellenen dokümanlar:

- Matrix güncellendi: [md3-compliance-matrix.md](../design/md3-compliance-matrix.md)
  - Faz 1/2/4 kapanışları matrixte “tamamlandı” olarak işlendi.
  - Açık riskler netleştirildi: Playwright stabilizasyonu + resources yardımcı stil katmanı token-bypass kalıntıları.

Kalan risk listesi (Faz 6 backlog önerisi):

1. Playwright stabilizasyonu:
   - [test-md3-global-styles.spec.js](../../tests/e2e/test-md3-global-styles.spec.js)
   - [test-md3-compliance.spec.js](../../tests/e2e/test-md3-compliance.spec.js)
   - Gözlem: `page.goto: Page crashed`, timeout, `networkidle` bağımlılığı.
2. ✅ Kapatıldı (2026-03-17): Resources yardımcı stil katmanı token-bypass temizliği:
   - [resource-content-styles.css](../../src/app/pages/resources/resource-content-styles.css): `hardcoded_hex=0`, `legacy_color_alias=0`
   - [clean-resource-styles.css](../../src/app/pages/resources/clean-resource-styles.css): `hardcoded_hex=0`, `legacy_color_alias=0`, `hardcoded_white=0`
   - [resource-utilities.css](../../src/app/pages/resources/resource-utilities.css): `hardcoded_hex=0`, `legacy_color_alias=0`, `hardcoded_white=0`
   - [base-resource-styles.css](../../src/app/pages/resources/base-resource-styles.css): `hardcoded_hex=0`, `legacy_color_alias=0`, `hardcoded_white=0`

Yayın hazırlığı durumu:

- Kritik doğrulama kapıları (build + route smoke) **geçti**.
- Matrix izlenebilirliği **güncel**.
- Residual riskler dokümante edilerek Faz 6 backlog’una taşındı.

### Faz 6 Uygulama Sonucu (2026-03-16)

Anayasa ve belge zinciri bağı:

- Karar önceliği ve kalite kapıları: [master-style-guide.md](../design/master-style-guide.md)
- Token/disiplin ve etkileşim güvenliği: [md3-token-governance.md](../design/md3-token-governance.md), [md3-motion-shape-accessibility.md](../design/md3-motion-shape-accessibility.md)
- Workflow A doğrulama-matrix işaretleme adımı: [md3-agent-workflows.md](../design/md3-agent-workflows.md)

Uygulama kapsamı (Playwright stabilizasyon):

- [test-md3-compliance.spec.js](../../tests/e2e/test-md3-compliance.spec.js)
  - `networkidle` bağımlılığı kaldırıldı; stabil navigasyon yardımcısı (`domcontentloaded + load + body visible`) standardize edildi.
  - A11y oran kontrolü, dekoratif görsel istisnalarını kapsayacak şekilde güvenli hale getirildi.
  - Görsel regresyon adımına sayfa yükseklik stabilizasyonu ve deterministik screenshot hazırlığı eklendi.
- [md3-visual-test.spec.js](../../tests/e2e/md3-visual-test.spec.js)
  - Aynı stabil navigasyon/timeout disipliniyle hizalandı.
  - Snapshot ve locator kırılganlıkları azaltıldı.

Doğrulama sonuçları:

| Kontrol | Sonuç |
|---|---|
| Hedefli compliance kırılımı (3 kritik test) | `3/3 passed` |
| Tam compliance suite (Chromium, workers=1) | `21/21 passed` |
| Birleşik suite: compliance + visual (Chromium, workers=4) | `34/34 passed` |

Kök neden kapanış özeti:

1. `page.goto` crash/timeout semptomlarını tetikleyen kırılgan bekleme modeli kaldırıldı.
2. `networkidle` odaklı flake yüzeyi elimine edildi.
3. Full-page screenshot yükseklik dalgalanması test içinde normalize edilerek paralel koşumda stabil hale getirildi.

### Faz 7 Uygulama Sonucu (2026-03-17)

Anayasa ve belge zinciri bağı:

- Non-negotiable karar önceliği: [master-style-guide.md](../design/master-style-guide.md)
- Semantic role-first / token governance: [md3-token-governance.md](../design/md3-token-governance.md)
- Bileşen ve yüzey davranışı: [md3-components-patterns.md](../design/md3-components-patterns.md)
- Erişilebilirlik ve motion güvenliği: [md3-motion-shape-accessibility.md](../design/md3-motion-shape-accessibility.md)

Uygulama kapsamı (resources helper CSS backlog kapanışı):

- [resource-content-styles.css](../../src/app/pages/resources/resource-content-styles.css)
- [clean-resource-styles.css](../../src/app/pages/resources/clean-resource-styles.css)
- [resource-utilities.css](../../src/app/pages/resources/resource-utilities.css)
- [base-resource-styles.css](../../src/app/pages/resources/base-resource-styles.css)

Kapanış özeti:

1. Legacy `--color-*` kullanımları `--md-sys-color-*` semantic role tokenlarına taşındı.
2. Hardcoded `#hex` ve `white` kullanımları temizlenerek tonal surface/container rolleri ile hizalandı.
3. Etkileşim yüzeylerinde state/elevation kararları MD3 uyumlu token seti içinde tutuldu.

Doğrulama sonuçları:

| Kontrol | Sonuç |
|---|---|
| Hedef dosyalarda token-bypass taraması (`var(--color-*)`, `#hex`, `white`) | `0 sonuç` |
| Build kapısı | `npm run build` → çıkış kodu `0` |
| Route + CTA smoke (Chromium) | `15/15 passed` |

---

## 6) Sprint Yürütme Sırası (Önerilen)

1. Faz 1 (P0 token ihlalleri)
2. Faz 2 (state/elevation/motion)
3. Faz 3 (i18n metin)
4. Faz 4 (a11y yatay kapanış)
5. Faz 5 (doğrulama + matrix)

---

## 7) Kapanış Kriteri (Release Gate)

- P0 ve P1 bulgular: **0 açık**
- Hardcoded hex: **0 yeni / kritik yüzeylerde 0 kalan**
- Legacy token alias: **0 kritik yüzeyde**
- Focus-visible + reduced-motion: **tüm interaktif yüzeylerde tamam**
- Matrix durumu: **izlenebilir şekilde güncel**
