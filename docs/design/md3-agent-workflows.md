# MD3 Agent Workflows

Bu belge, AI agentların tasarım değişikliği yaparken izlemesi gereken adımları verir.

## Workflow A — Bileşen görsel güncellemesi

1. Etkilenen bileşeni tespit et.
2. Token ihtiyacını [md3-token-governance.md](./md3-token-governance.md) ile doğrula.
3. Bileşen anatomisini [md3-components-patterns.md](./md3-components-patterns.md) ile hizala.
4. State/a11y kontrolünü [md3-motion-shape-accessibility.md](./md3-motion-shape-accessibility.md) ile tamamla.
5. Uygunluk maddesini [md3-compliance-matrix.md](./md3-compliance-matrix.md) içinde işaretle.

## Workflow B — Yeni token önerisi

1. Mevcut token ile çözülemiyorsa yeni token öner.
2. Token ismi semantic role mantığına göre verilsin.
3. Light/dark ve high-contrast etkisi belgelensin.
4. PR notuna neden mevcut tokenın yetersiz olduğu yazılsın.

## Workflow C — Shadow temizliği (MD2 → MD3)

1. Hardcoded shadow satırlarını bul.
2. Mümkünse tonal surface ile değiştir.
3. Gerekliyse sadece `--md-sys-elevation-level*` kullan.
4. Legacy `--shadow-*` kullanımı varsa köprü eşlemesini koru.

## Hızlı kontrol komutları (agent için)

- `box-shadow:` araması
- `rgba(0, 0, 0` araması
- `--shadow-` araması
- `prefers-reduced-motion` varlığı
