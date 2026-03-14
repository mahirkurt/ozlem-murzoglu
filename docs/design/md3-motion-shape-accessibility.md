# MD3 Motion, Shape, Accessibility

## 1) Motion

- Standart geçişlerde kısa/orta süre tokenları kullanılır.
- Expressive hareket yalnızca “hero moment” gibi sınırlı bağlamlarda kullanılır.
- `prefers-reduced-motion` desteği zorunludur.

Referans:
- [src/styles/md3/_motion.scss](../../src/styles/md3/_motion.scss)

## 2) Shape

- Köşe yarıçapları token üzerinden seçilir.
- Asimetrik shape yalnızca amaçlı bileşenlerde (sheet/drawer vb.) kullanılır.

Referans:
- [src/styles/md3/_shapes.scss](../../src/styles/md3/_shapes.scss)

## 3) Accessibility

- Metin kontrastı min 4.5:1
- Touch target min 48px
- Focus-visible ring belirgin
- Forced-colors ve high-contrast destekli

Referans:
- [src/styles/md3/_accessibility.scss](../../src/styles/md3/_accessibility.scss)
- [src/styles/md3/_states.scss](../../src/styles/md3/_states.scss)

## 4) Glass kullanımı (kısıtlı)

- Sadece düşük yoğunluklu, büyük ve odak yüzeylerde
- Uzun metin arkası için opak tonal surface tercih edilir
- Blur fallback (`@supports`) zorunlu

Referans:
- [src/styles/md3/_effects.scss](../../src/styles/md3/_effects.scss)
