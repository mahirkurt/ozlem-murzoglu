# MD3 Compliance Matrix (m3.material.io Referanslı)

Durum anahtarı:
- ✅ Uyumlu
- ⚠️ Kısmi / Riskli
- ❌ Uyum dışı

## 1) Sistem seviyesinde durum

| Alan | Durum | Not |
|---|---|---|
| Semantic color roles | ✅ | [src/styles/md3/_colors.scss](../../src/styles/md3/_colors.scss) güçlü kapsama sahip |
| Tonal surface hierarchy | ✅ | `surface-container-*` hiyerarşisi mevcut |
| State layer modeli | ✅ | [src/styles/md3/_states.scss](../../src/styles/md3/_states.scss) kapsamlı |
| Elevation core levels | ✅ | `level0..level5` mevcut |
| MD2 gölge kalıntısı riski | ✅ | [src/styles/md3/_effects.scss](../../src/styles/md3/_effects.scss) içinde `md3-drop-shadow*` yardımcıları nötr (`filter: none`) ve glow mixinleri elevation tokenlarına sınırlandı; [src/styles/design-system.css](../../src/styles/design-system.css) içinde `neu` gölge değişkenleri kaldırıldı |
| Legacy shadow tanımları | ✅ | [src/app/shared/styles/tokens.css](../../src/app/shared/styles/tokens.css) ve [src/app/services/theme.service.ts](../../src/app/services/theme.service.ts:124) MD3 level eşlemesine sabitlendi |
| Token servis doğruluğu | ✅ | [DesignTokensService.generateShadowScale()](../../src/app/core/services/design-tokens.service.ts:268), [DesignTokensService.hexToHsl()](../../src/app/core/services/design-tokens.service.ts:675), [DesignTokensService.adjustColorBrightness()](../../src/app/core/services/design-tokens.service.ts:713), [DesignTokensService.calculateContrast()](../../src/app/core/services/design-tokens.service.ts:733) gerçek implementasyon içeriyor |

## 2) Kritik bulgular

1. **Doküman düzeyi**
   - Monolit belge modüler yapıya taşındı: [master-style-guide.md](./master-style-guide.md)

2. **MD2 gölge dili temizliği (kapanan kritikler)**
   - Legacy/global utility katmanında neumorphism kalıntıları MD3-safe köprüye indirildi: [src/styles/design-system.css](../../src/styles/design-system.css)
   - Efekt katmanında dekoratif `drop-shadow` kullanımı nötrlendi ve glow davranışı MD3 elevation tokenlarıyla sınırlandı: [src/styles/md3/_effects.scss](../../src/styles/md3/_effects.scss)

3. **Doğrulama bulguları (Playwright + statik tarama)**
    - [tests/e2e/test-md3-global-styles.spec.js](../../tests/e2e/test-md3-global-styles.spec.js) çalıştırmasında 27 testin 23'ü geçti; kalan 4 hata doğrudan shadow cleanup kaynaklı değil.
    - Kalan hatalar: `beforeEach` aşamasında `networkidle` timeout ve CLS eşiği (`0.25`) aşımı.
    - `spacing` ve `shape` beklentisi için global köprü genişletildi: [src/styles.scss](../../src/styles.scss)
    - Wave C hedeflerinde token-first temizlik tamamlandı: [src/app/pages/saygiyla/saygiyla.css](../../src/app/pages/saygiyla/saygiyla.css), [src/app/pages/kaynaklar/kaynaklar.component.css](../../src/app/pages/kaynaklar/kaynaklar.component.css), [src/app/pages/saygiyla/*/*.component.css](../../src/app/pages/saygiyla/)
    - Wave C odaklı doğrulama: `hex=0`, `raw_rgba=0`, `drop-shadow=0`; `box-shadow` kullanımları MD3 elevation tokenlarına hizalı.

4. **Token servis güvenilirliği**
   - `generateShadowScale` artık `var(--md-sys-elevation-level*)` kullanıyor: [DesignTokensService.generateShadowScale()](../../src/app/core/services/design-tokens.service.ts:268)
   - `hexToHsl` gerçek HSL dönüşümü yapıyor: [DesignTokensService.hexToHsl()](../../src/app/core/services/design-tokens.service.ts:675)
   - `adjustColorBrightness` hex tabanlı ölçekleme yapıyor: [DesignTokensService.adjustColorBrightness()](../../src/app/core/services/design-tokens.service.ts:713)
   - `calculateContrast` relatif luminance ile kontrast hesaplıyor: [DesignTokensService.calculateContrast()](../../src/app/core/services/design-tokens.service.ts:733)

## 3) Zorunlu iyileştirme önceliği

1. ✅ Tamamlandı: [src/app/pages/services/service-base-styles.css](../../src/app/pages/services/service-base-styles.css), [src/app/pages/services/bright-futures-program/bright-futures-program.component.css](../../src/app/pages/services/bright-futures-program/bright-futures-program.component.css), [src/app/pages/services/sos-feeding/sos-feeding.component.css](../../src/app/pages/services/sos-feeding/sos-feeding.component.css) içinde MD3 semantic role-first hizalaması uygulandı.
2. ✅ Tamamlandı: [src/app/pages/kaynaklar/kaynaklar.component.css](../../src/app/pages/kaynaklar/kaynaklar.component.css), [src/app/pages/saygiyla/saygiyla.css](../../src/app/pages/saygiyla/saygiyla.css) ve [src/app/pages/saygiyla/*/*.component.css](../../src/app/pages/saygiyla/) için hardcoded renk/shadow kalıpları temizlendi.
3. ✅ Faz 6’da kapatıldı (Playwright stabilizasyonu): [tests/e2e/test-md3-compliance.spec.js](../../tests/e2e/test-md3-compliance.spec.js) ve [tests/e2e/md3-visual-test.spec.js](../../tests/e2e/md3-visual-test.spec.js) için `networkidle` bağımlılığı kaldırıldı, stabil navigasyon (`domcontentloaded + load + body visible`) akışına geçildi, screenshot tutarlılığı için yükseklik stabilizasyonu eklendi. Chromium doğrulaması: `34/34 passed` (workers=4).
4. ✅ Faz 7’de kapatıldı (resources yardımcı stil katmanı): [src/app/pages/resources/resource-content-styles.css](../../src/app/pages/resources/resource-content-styles.css), [src/app/pages/resources/clean-resource-styles.css](../../src/app/pages/resources/clean-resource-styles.css), [src/app/pages/resources/resource-utilities.css](../../src/app/pages/resources/resource-utilities.css), [src/app/pages/resources/base-resource-styles.css](../../src/app/pages/resources/base-resource-styles.css) içinde legacy `--color-*` alias ve hardcoded hex/`white` kullanımları semantic `--md-sys-color-*` rollerine taşındı; MD3 level token dışı shadow kalıntısı bırakılmadı.

## 4) Faz 5 kapanış notu (2026-03-16)

- Build kapısı geçti: `npm run build`.
- Route + CTA smoke (Chromium) geçti: [tests/e2e/route-cta-smoke.spec.js](../../tests/e2e/route-cta-smoke.spec.js).
- CTA spacing görsel/smoke kontrolü geçti: [tests/e2e/test-cta-spacing-simple.spec.js](../../tests/e2e/test-cta-spacing-simple.spec.js).
- Kapsamlı MD3 doğrulama akışında stabilizasyon riski doğrulandı: [tests/e2e/test-md3-compliance.spec.js](../../tests/e2e/test-md3-compliance.spec.js), [tests/e2e/md3-visual-test.spec.js](../../tests/e2e/md3-visual-test.spec.js).

## 5) Faz 6 Playwright stabilizasyon kapanışı (2026-03-16)

- Anayasa bağı: [master-style-guide.md](./master-style-guide.md) non-negotiable `state-layer-first` + kalite kapıları, hareket/erişilebilirlik doğrulama disiplinleri.
- Belge zinciri bağı: [md3-foundation-principles.md](./md3-foundation-principles.md) → [md3-token-governance.md](./md3-token-governance.md) → [md3-components-patterns.md](./md3-components-patterns.md) → [md3-motion-shape-accessibility.md](./md3-motion-shape-accessibility.md) → bu matrix.

Doğrulama kanıtları:

| Kontrol | Sonuç |
|---|---|
| Hedefli stabilizasyon doğrulaması (`test-md3-compliance` kritik 3 test) | `3/3 passed` |
| Tam compliance suite (Chromium, workers=1) | `21/21 passed` |
| Birleşik suite (`test-md3-compliance` + `md3-visual-test`, Chromium, workers=4) | `34/34 passed` |

Kapanan riskler:

1. `networkidle` tabanlı flake/crash tetikleyicisi kaldırıldı.
2. `page.goto: Page crashed` ve timeout kök nedeni olarak görülen kırılgan navigasyon akışı stabilize edildi.
3. Full-page screenshot yüksekliği dalgalanması, test içi yükseklik stabilizasyonu ile deterministik hale getirildi.

## 6) Faz 7 Resources yardımcı stil katmanı kapanışı (2026-03-17)

- Anayasa bağı: [master-style-guide.md](./master-style-guide.md) non-negotiable `semantic role-first token usage`, `state-layer-first` ve `tonal surface` önceliği.
- Belge zinciri bağı: [md3-foundation-principles.md](./md3-foundation-principles.md) → [md3-token-governance.md](./md3-token-governance.md) → [md3-components-patterns.md](./md3-components-patterns.md) → [md3-motion-shape-accessibility.md](./md3-motion-shape-accessibility.md) → bu matrix.

Uygulama kapsamı:

- [src/app/pages/resources/resource-content-styles.css](../../src/app/pages/resources/resource-content-styles.css)
- [src/app/pages/resources/clean-resource-styles.css](../../src/app/pages/resources/clean-resource-styles.css)
- [src/app/pages/resources/resource-utilities.css](../../src/app/pages/resources/resource-utilities.css)
- [src/app/pages/resources/base-resource-styles.css](../../src/app/pages/resources/base-resource-styles.css)

Doğrulama kanıtları:

| Kontrol | Sonuç |
|---|---|
| Token bypass / hardcoded tarama (`var(--color-*)`, `#hex`, `white`) | `0 sonuç` (hedef 4 dosyada) |
| Build kapısı | `npm run build` → çıkış kodu `0` |
| Route + CTA smoke (Chromium) | `15/15 passed` |

Kapanan riskler:

1. Resources yardımcı stil katmanındaki legacy `--color-*` alias kullanımları kaldırıldı.
2. Hardcoded hex/`white` değerleri semantic role tokenlarına taşındı.
3. Yüzey ayrışması tonal container rolleriyle korundu; etkileşim katmanlarında MD3 uyumlu renk/elevation disiplini sürdürüldü.
