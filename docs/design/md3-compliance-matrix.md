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

1. [src/app/pages/services/service-base-styles.css](../../src/app/pages/services/service-base-styles.css), [src/app/pages/services/bright-futures-program/bright-futures-program.component.css](../../src/app/pages/services/bright-futures-program/bright-futures-program.component.css), [src/app/pages/services/sos-feeding/sos-feeding.component.css](../../src/app/pages/services/sos-feeding/sos-feeding.component.css) içinde hardcoded renk/token override kalıntılarını MD3 semantic role-first ilkesine hizala.
2. ✅ Tamamlandı: [src/app/pages/kaynaklar/kaynaklar.component.css](../../src/app/pages/kaynaklar/kaynaklar.component.css), [src/app/pages/saygiyla/saygiyla.css](../../src/app/pages/saygiyla/saygiyla.css) ve [src/app/pages/saygiyla/*/*.component.css](../../src/app/pages/saygiyla/) için hardcoded renk/shadow kalıpları temizlendi.
3. Playwright doğrulama stabilizasyonu: [tests/e2e/test-md3-global-styles.spec.js](../../tests/e2e/test-md3-global-styles.spec.js) `beforeEach` yüklenme bekleme stratejisini (networkidle bağımlılığı) ve CLS eşiğini CI gerçekliğine göre yeniden kalibre et.
