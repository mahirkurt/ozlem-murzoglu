# MD2 Temizliği ve Tam MD3 Uyum Playbook (AI Agent)

Bu belge, projede kalan MD2 gölge/effect kalıntılarını temizleyip sistemi tam MD3 uyumuna taşımak için uygulanacak operasyonel to-do list ve talimatnamedir.

## 1) Amaç

- Dekoratif, çok katmanlı, ad-hoc gölge yaklaşımını sistemden kaldırmak
- Derinlik kararlarını önce tonal surface hiyerarşisi, gerekirse MD3 elevation level tokenları ile vermek
- Etkileşim geri bildirimini state layer öncelikli hale getirmek
- Dokümantasyon, token katmanı ve bileşen katmanını tek bir MD3 kontratında birleştirmek

## 2) Done Kriterleri

- Token ve köprü katmanında shadow eşlemeleri yalnızca MD3 level0..level5 üzerinden çalışır
- Yeni eklenen stillerde hardcoded shadow ve hardcoded hex kullanılmaz
- Yüksek etkili sayfa/bileşen dosyalarında MD2 tarzı shadow kalıpları temizlenir
- Erişilebilirlik ve hareket tercihleri korunur: kontrast, focus görünürlüğü, reduced motion, high contrast
- Uyum matrisi son durumla güncellenir

## 3) Non-Negotiable Kurallar

1. Öncelik sırası: semantic color role → tonal surface → gerekiyorsa elevation
2. Dekoratif glow, ağır drop-shadow, neumorphism varsayılan davranış olamaz
3. Hover/pressed/focus geri bildirimi yalnız gölge artışıyla verilemez; state layer zorunludur
4. Glass sadece odak yüzeylerinde ve okunurluk korunuyorsa kullanılabilir
5. Her temizlik adımı sonunda doküman referansı güncel kalmalıdır

## 4) Operasyonel To-Do List (AI Agent)

### Faz 0 — Baseline Envanter

- [ ] Mevcut kuralları doğrula: [md3-foundation-principles.md](./md3-foundation-principles.md), [md3-token-governance.md](./md3-token-governance.md), [md3-motion-shape-accessibility.md](./md3-motion-shape-accessibility.md)
- [ ] Uyum başlangıç durumunu sabitle: [md3-compliance-matrix.md](./md3-compliance-matrix.md)
- [ ] MD2 kalıntılarını dosya bazında listele (box-shadow, text-shadow, drop-shadow, legacy shadow kullanımı)

### Faz 1 — Token ve Köprü Katmanı

- [ ] Köprü tokenlarını doğrula: [src/app/shared/styles/tokens.css](../../src/app/shared/styles/tokens.css)
- [ ] Runtime köprü eşlemesini doğrula: [src/app/services/theme.service.ts](../../src/app/services/theme.service.ts)
- [ ] Token servis shadow üretimini doğrula: [src/app/core/services/design-tokens.service.ts](../../src/app/core/services/design-tokens.service.ts)

### Faz 2 — Sistem Stil Katmanı

- [ ] Global utility kalıntılarını temizle: [src/styles/design-system.css](../../src/styles/design-system.css)
- [ ] Elevation katmanını MD3 safe tut: [src/styles/md3/_elevation.scss](../../src/styles/md3/_elevation.scss)
- [ ] Effect katmanında dekoratif glow/drop-shadow kalıplarını sınırla: [src/styles/md3/_effects.scss](../../src/styles/md3/_effects.scss)

### Faz 3 — Bileşen/Sayfa Dalgaları (Wave Plan)

- [ ] Wave A (yüksek etki): [src/app/pages/legal/legal-md3.css](../../src/app/pages/legal/legal-md3.css), [src/app/pages/services/triple-p/triple-p.component.css](../../src/app/pages/services/triple-p/triple-p.component.css), [src/app/pages/resources/shared-styles.css](../../src/app/pages/resources/shared-styles.css)
- [ ] Wave B (servis katmanı): [src/app/pages/services/service-base-styles.css](../../src/app/pages/services/service-base-styles.css), [src/app/pages/services/bright-futures-program/bright-futures-program.component.css](../../src/app/pages/services/bright-futures-program/bright-futures-program.component.css), [src/app/pages/services/sos-feeding/sos-feeding.component.css](../../src/app/pages/services/sos-feeding/sos-feeding.component.css)
- [ ] Wave C (genişleyen kalıntılar): [src/app/pages/kaynaklar/kaynaklar.component.css](../../src/app/pages/kaynaklar/kaynaklar.component.css), [src/app/pages/saygiyla/saygiyla.css](../../src/app/pages/saygiyla/saygiyla.css) ve tekrar eden alt sayfa stilleri

### Faz 4 — Doğrulama Kapıları

- [ ] Kontrast ve focus görünürlüğünü denetle
- [ ] Reduced motion ve high-contrast davranışını denetle
- [ ] Yalnızca shadow azaltımı değil, state layer doğruluğunu da denetle
- [ ] Mevcut test/e2e akışında görsel regresyon kontrolü çalıştır

### Faz 5 — Dokümantasyon ve Kapanış

- [ ] Son durum matrisi güncelle: [md3-compliance-matrix.md](./md3-compliance-matrix.md)
- [ ] Gerekirse governance notlarını güncelle: [md3-token-governance.md](./md3-token-governance.md)
- [ ] Agent çalışma akışına sprint çıktısını işle: [md3-agent-workflows.md](./md3-agent-workflows.md)

## 5) Uygulama Talimatnamesi (Agent Runbook)

1. Tek seferde sınırlı kapsam al: bir PR içinde en fazla 5–10 dosya.
2. Her shadow satırı için karar ağacı uygula:
   - Derinlik ihtiyacı yoksa shadow kaldır ve tonal surface kullan.
   - Derinlik gerekliyse sadece MD3 elevation level kullan.
   - Etkileşim geri bildirimi gerekiyorsa state layer ile tamamla.
3. Dekoratif efektleri varsayılan davranıştan çıkar; sadece açıkça opt-in kullanım bırak.
4. Kod değişikliği sonrası doküman satırını güncellemeden PR kapatma.
5. Her dalga sonunda risk raporu çıkar: kalan dosyalar, bloke eden noktalar, bir sonraki dalga.

## 6) PR Kontrol Listesi

- [ ] Yeni hardcoded shadow eklenmedi
- [ ] Yeni hardcoded hex eklenmedi
- [ ] MD3 role-first + tonal-first ilkesi korundu
- [ ] State layer/focus görünürlüğü bozulmadı
- [ ] İlgili dokümanlar güncellendi

