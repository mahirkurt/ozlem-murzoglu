# MD3 Foundation Principles (m3.material.io Uyumlu)

Bu belge, temel tasarım ilkelerini MD3 resmi yaklaşımına göre normalize eder.

## 1) Kapsam

- Renk sistemi: semantic rol tabanlı
- Surface yaklaşımı: tonal elevation öncelikli
- Durum katmanları: hover/focus/pressed/dragged
- Token önceliği: component-level hardcode yerine system token

## 2) MD3 ile Uyumlu Ana İlkeler

1. **Semantic role-first**
   - `primary`, `on-primary`, `primary-container`, `on-primary-container`
   - `secondary`, `tertiary`
   - `surface`, `surface-container-*`, `on-surface`
   - `outline`, `outline-variant`

2. **Tonal surface hiyerarşisi**
   - Derinlik için ilk araç: `surface-container-lowest → highest`
   - Gölge yalnızca destekleyici ve düşük yoğunlukta

3. **State layer zorunluluğu**
   - Etkileşim geri bildirimi `box-shadow` ile değil state layer ile başlar
   - Odak görünürlüğü keyboard kullanıcıları için belirgin olmalıdır

4. **Erişilebilirlik kontratı**
   - Metin kontrastı min 4.5:1
   - UI grafik/ikon kontrastı min 3:1
   - Reduced motion ve high contrast desteklenir

## 3) Bu repoda karşılık gelen kaynaklar

- Renk rolleri: [src/styles/md3/_colors.scss](../../src/styles/md3/_colors.scss)
- Elevation yaklaşımı: [src/styles/md3/_elevation.scss](../../src/styles/md3/_elevation.scss)
- State layer: [src/styles/md3/_states.scss](../../src/styles/md3/_states.scss)
- Import sırası: [src/styles/md3/_index.scss](../../src/styles/md3/_index.scss)

## 4) Anti-Pattern Listesi

- Hex renkle doğrudan boyama
- Bileşen içinde ad-hoc `rgba(0,0,0,...)` gölge tanımı
- Aynı ekranda fazla blur + glow + heavy shadow kombinasyonu
- State layer yerine sadece hover shadow ile etkileşim sinyali verme
