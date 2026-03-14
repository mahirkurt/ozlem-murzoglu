# MD3 Components Patterns

Bu belge, bileşen seviyesinde MD3 uyumlu kalıpları özetler.

## 1) Button

- Filled/Tonal/Outlined/Text hiyerarşisi korunur.
- Hover/pressed/focus geri bildirimi state layer ile verilir.
- Elevation yalnızca gerektiğinde `level1 → level2` geçişiyle kullanılır.

## 2) Card

- Varsayılan kart: tonal surface
- Elevated kart: sınırlı gölge + tonal yüzey
- Outlined kart: border + düşük görsel ağırlık
- Uzun metin kartlarında glass kullanılmaz.

## 3) Navigation

- App bar ve navigation yüzeyleri `surface/surface-container` rollerinden gelir.
- Scroll durumunda elevation geçişi kontrollü uygulanır.

## 4) Dialog / Sheet

- Dialog yüzeyleri `surface-container-high*` ile tanımlanır.
- Scrim kullanımı zorunludur; kontrast korunur.

## 5) Form alanları

- Label görünürlüğü ve focus ring net olmalı.
- Hata durumu yalnız renkle değil ikon/metinle de belirtilir.

## 6) Bu repodaki kaynaklar

- Button: [src/styles/md3/components/_buttons.scss](../../src/styles/md3/components/_buttons.scss)
- Card: [src/styles/md3/components/_cards.scss](../../src/styles/md3/components/_cards.scss)
- Navigation: [src/styles/md3/components/_navigation.scss](../../src/styles/md3/components/_navigation.scss)
- Dialog: [src/styles/md3/components/_dialogs.scss](../../src/styles/md3/components/_dialogs.scss)
- Text field: [src/styles/md3/components/_text-fields.scss](../../src/styles/md3/components/_text-fields.scss)
