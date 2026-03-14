# MD3 Token Governance

Bu belge token sisteminin **tek doğru kaynağını** ve kullanım kurallarını tanımlar.

## 1) Canonical kaynaklar

- Renk rolleri: [src/styles/md3/_colors.scss](../../src/styles/md3/_colors.scss)
- Elevation rolleri: [src/styles/md3/_elevation.scss](../../src/styles/md3/_elevation.scss)
- State layer rolleri: [src/styles/md3/_states.scss](../../src/styles/md3/_states.scss)
- Efekt rolleri (glass/gradient): [src/styles/md3/_effects.scss](../../src/styles/md3/_effects.scss)
- Import sırası: [src/styles/md3/_index.scss](../../src/styles/md3/_index.scss)

## 2) Token öncelik sırası

1. `--md-sys-*` sistem tokenları
2. `--md-ref-*` palet referans tokenları
3. Legacy köprü tokenları (`--color-*`, `--shadow-*`) yalnızca backward compatibility için

## 3) Elevation politikası (MD3 uyumlu)

### İzinli tokenlar
- `--md-sys-elevation-level0`
- `--md-sys-elevation-level1`
- `--md-sys-elevation-level2`
- `--md-sys-elevation-level3`
- `--md-sys-elevation-level4`
- `--md-sys-elevation-level5`

### Kural
- Derinlik öncelikle `surface-container-*` ton farkı ile verilir.
- Gölge yalnızca destekleyicidir.
- MD2 benzeri ağır/dekoratif shadow stack’leri token seviyesinde kullanılmaz.

## 4) Legacy shadow köprüsü

Eski bileşenlerde görülen `--shadow-*` değişkenleri, MD3 elevation seviyelerine map edilmelidir:

| Legacy | MD3 karşılık |
|---|---|
| `--shadow-xs` | `--md-sys-elevation-level0` |
| `--shadow-sm` | `--md-sys-elevation-level1` |
| `--shadow-md` | `--md-sys-elevation-level2` |
| `--shadow-lg` | `--md-sys-elevation-level3` |
| `--shadow-xl` | `--md-sys-elevation-level4` |
| `--shadow-2xl` | `--md-sys-elevation-level5` |

## 5) Yasaklar

- Hardcoded hex (`#...`) ile role bypass
- Bileşen içinde ad-hoc `box-shadow` değerleri
- Renkli/çok katmanlı shadow ile bilgi hiyerarşisi kurma

## 6) PR kontrol listesi

- Yeni stil satırı semantic token kullanıyor mu?
- `box-shadow` varsa MD3 level token üzerinden mi?
- State geri bildirimi [src/styles/md3/_states.scss](../../src/styles/md3/_states.scss) ile uyumlu mu?
- Dark mode ve high-contrast davranışı bozuluyor mu?
