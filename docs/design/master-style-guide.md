# MASTER STYLE GUIDE — MD3 Agent Hub

Bu dosya, tasarım sisteminin **AI agent odaklı giriş noktasıdır**.

Detaylı eski monolit doküman arşivi:
- [master-style-guide.legacy-v6-archive.md](./master-style-guide.legacy-v6-archive.md)

---

## 1) Doküman Mimarisi (Modüler)

Tüm dosyalar aynı klasördedir ve görev bazlı okunur:

1. Temel ilkeler: [md3-foundation-principles.md](./md3-foundation-principles.md)
2. Token yönetişimi: [md3-token-governance.md](./md3-token-governance.md)
3. Bileşen kalıpları: [md3-components-patterns.md](./md3-components-patterns.md)
4. Motion / Shape / A11y: [md3-motion-shape-accessibility.md](./md3-motion-shape-accessibility.md)
5. Agent çalışma akışları: [md3-agent-workflows.md](./md3-agent-workflows.md)
6. MD3 uygunluk matrisi: [md3-compliance-matrix.md](./md3-compliance-matrix.md)

---

## 2) Agent Hızlı Başlangıç

### UI değişikliği yapmadan önce
1. [md3-foundation-principles.md](./md3-foundation-principles.md) içinden ilgili ilkeyi doğrula.
2. [md3-token-governance.md](./md3-token-governance.md) içinden doğru token rolünü seç.
3. [md3-components-patterns.md](./md3-components-patterns.md) içinden bileşen anatomisini uygula.
4. [md3-motion-shape-accessibility.md](./md3-motion-shape-accessibility.md) ile erişilebilirlik/motion kontrolü yap.
5. [md3-compliance-matrix.md](./md3-compliance-matrix.md) ile MD3 uyumunu işaretle.

### Tek cümle karar kuralı
**Hex / hardcoded shadow / tekil component override yerine semantic MD3 token kullan.**

---

## 3) Non-Negotiable Kurallar

- MD3 semantic renk rolleri dışına çıkılmaz.
- Elevation için önce tonal surface hiyerarşisi kullanılır.
- MD2 tarzı “dekoratif çok katmanlı” gölge dili token seviyesinde yasaktır.
- Hover/pressed/focus geri bildirimi state layer ile verilir.
- Glass sadece odak yüzeylerinde, metin okunurluğu korunarak kullanılır.

---

## 4) Kod Referansları

- Ana MD3 girişi: [src/styles/md3/_index.scss](../../src/styles/md3/_index.scss)
- Renk tokenları: [src/styles/md3/_colors.scss](../../src/styles/md3/_colors.scss)
- Elevation tokenları: [src/styles/md3/_elevation.scss](../../src/styles/md3/_elevation.scss)
- State layer tokenları: [src/styles/md3/_states.scss](../../src/styles/md3/_states.scss)
- Legacy köprü tokenları: [src/app/shared/styles/tokens.css](../../src/app/shared/styles/tokens.css)

---

## 5) Resmi Kaynaklar

- Material Design 3 ana kaynak: <https://m3.material.io/>
- Theme Builder: <https://m3.material.io/theme-builder>
- Color system: <https://m3.material.io/styles/color/system/overview>
- Elevation: <https://m3.material.io/styles/elevation/overview>
- State: <https://m3.material.io/foundations/interaction/states>
- Accessibility: <https://m3.material.io/foundations/designing/overview>

---

## 6) Sürüm Notu

- Bu dosya monolit belgenin modülerleştirilmiş sürümünün index’idir.
- Eski kapsamlı içerik arşivde korunur: [master-style-guide.legacy-v6-archive.md](./master-style-guide.legacy-v6-archive.md)
