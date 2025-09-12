# Angular + Signals ThemeService ile İllüstrasyon Entegrasyonu Talimatnamesi
**Dosya türü:** `.md`  
**Kapsam:** Bu talimatname; verdiğiniz `ThemeService` (Angular Signals + `effect`) ile **tam uyumlu** şekilde, kurumsal renklerinize göre **statik SVG/PNG** ve **Lottie (JSON)** illüstrasyonlarının Angular projesine entegrasyonunu anlatır. Ayrıca **erişilebilirlik**, **lisans**, **performans** ve **otomasyon (SVGO)** konularında üretim düzeyi öneriler içerir.

> **Uyumluluk**: Buradaki adımlar **hiçbir değişiklik yapmadan** doğrudan sağladığınız `ThemeService` ile çalışır. Sınıfları `html` köküne (`document.documentElement`) uygulayan bu servis; açık/koyu/oto modlar arasında geçiş yaparken CSS değişkenlerini günceller, `meta[name="theme-color"]` değerini senkronize eder.

---

## 0) Hedefler ve Mimari
- **Hedefler**
  1. Kurumsal paleti **CSS değişkenleri** ile tek noktadan yönetmek (ThemeService zaten bunu runtime'da yapıyor).
  2. İllüstrasyonları **optimize etmek** (SVGO) ve **theme-aware** hale getirmek (inline SVG + yardımcı sınıflar).
  3. **Lottie** animasyonlarını katman bazlı renklendirmek (tercihen dışarıda düzenlenmiş JSON) ve Angular şablonlarında kullanmak.
  4. **A11y** (WCAG), **performans** (lazy load, cache), **lisans/atıf** gereksinimlerini check‑list ile güvenceye almak.

## 1) ThemeService Entegrasyonu (Bootstrap)
`ThemeService` constructor’ı ilk enjekte edildiği anda çalışır. Bu nedenle **AppComponent** içinde enjekte ederek servisi erken başlatın.

```ts
// src/app/app.component.ts (standalone örnek)
import { Component, inject } from '@angular/core';
import { ThemeService } from './core/theme/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <app-theme-toggle class="theme-toggle"></app-theme-toggle>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  private readonly theme = inject(ThemeService);
  // Sırf instantiate etmek için enjekte etmek yeterli; ek işleme gerek yok.
}
```

**index.html** içine şu meta etiketi eklidir/eklenmelidir (ThemeService bunu dinamik günceller):
```html
<meta name="theme-color" content="#005F73">
```

---

## 2) FOUC’yi (Flash of Unstyled Content) Önlemek İçin Fallback Değerler
ThemeService runtime’da değişkenleri ayarlıyor, fakat ilk boyamada (ilk frame) renklerin “boş” görünmemesi için **fallback** değerler tanımlayın.

```css
/* src/app/shared/styles/tokens.css */
:root {
  /* ThemeService ile birebir aynı isimler: */
  --color-primary: #005F73;
  --color-primary-light: #0A8FA3;
  --color-primary-dark: #003D4F;
  --color-secondary: #94D2BD;
  --color-secondary-light: #B8E6D3;
  --color-secondary-dark: #6FAF99;
  --color-accent: #EE6C4D;
  --color-accent-light: #FF8B70;
  --color-accent-dark: #D74A2B;

  --color-neutral-50:  #F8F9FA;
  --color-neutral-100: #E9ECEF;
  --color-neutral-200: #DEE2E6;
  --color-neutral-300: #CED4DA;
  --color-neutral-400: #ADB5BD;
  --color-neutral-500: #6C757D;
  --color-neutral-600: #495057;
  --color-neutral-700: #343A40;
  --color-neutral-800: #212529;
  --color-neutral-900: #0F1419;

  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(255, 255, 255, 0.18);

  --shadow-xs: 0 1px 2px rgba(0, 95, 115, 0.05);
  --shadow-sm: 0 2px 4px rgba(0, 95, 115, 0.06), 0 1px 2px rgba(0, 95, 115, 0.04);
  --shadow-md: 0 4px 6px rgba(0, 95, 115, 0.07), 0 2px 4px rgba(0, 95, 115, 0.04);
  --shadow-lg: 0 10px 15px rgba(0, 95, 115, 0.08), 0 4px 6px rgba(0, 95, 115, 0.05);
  --shadow-xl: 0 20px 25px rgba(0, 95, 115, 0.1), 0 10px 10px rgba(0, 95, 115, 0.04);
}

/* Root’a ThemeService class’ları geliyor: .light-theme / .dark-theme */
/* Buraya tema-spesifik ekstra stiller ekleyebilirsiniz */
html.light-theme body { background: var(--color-neutral-50); color: var(--color-neutral-900); }
html.dark-theme  body { background: var(--color-neutral-50); color: var(--color-neutral-900); }
```

> **Not:** `styles.css` (global) içerisine `@import './app/shared/styles/tokens.css';` satırı ekleyin.

---

## 3) İllüstrasyon Yardımcı Sınıfları (Theme‑Aware SVG)
SVG içindeki öğeleri **CSS değişkenleri** ile boyamak için minimal bir yardımcı set:

```css
/* src/app/shared/styles/illustrations.css */
.illo { width: 100%; height: auto; display: block; }

/* fill/stroke eşlemeleri (ThemeService değişkenlerine bağlı) */
.illo-fill-primary   { fill: var(--color-primary); }
.illo-fill-secondary { fill: var(--color-secondary); }
.illo-fill-accent    { fill: var(--color-accent); }
.illo-fill-surface   { fill: var(--color-neutral-50); }

.illo-stroke-primary { stroke: var(--color-primary); }
.illo-stroke-weak    { stroke: var(--color-neutral-300); }
.illo-stroke-strong  { stroke: var(--color-neutral-700); }

/* Cam efekti (ThemeService’in cam değişkenleri) */
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: saturate(180%) blur(16px);
  -webkit-backdrop-filter: saturate(180%) blur(16px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow: var(--shadow-md);
}

/* Erişilebilirlik için görünmez başlık yardımcı sınıfı */
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0;
  margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0;
}
```

> **Kullanım prensibi:** İndirilen SVG içindeki `fill="#xxxxxx"` / `stroke="#xxxxxx"` tanımlarını **kaldırıp** ilgili elementlere yukarıdaki sınıfları verin. Böylece tema değiştikçe otomatik renklenir.

Global stil dosyanıza `@import './app/shared/styles/illustrations.css';` eklemeyi unutmayın.

---

## 4) Inline SVG ile Entegrasyon (Örnek Component)
Aşağıdaki component, **inline SVG**’yi yardımcı sınıflarla kullanır ve A11y için `<title>` sağlar.

```ts
// src/app/shared/components/illustration/illustration.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-illustration',
  standalone: true,
  template: `
    <figure class="glass-card" [attr.aria-labelledby]="titleId">
      <svg class="illo" role="img" [attr.aria-labelledby]="titleId" viewBox="0 0 600 400">
        <title [id]="titleId">{{ title }}</title>
        <rect width="600" height="400" class="illo-fill-surface"/>
        <circle cx="120" cy="200" r="80" class="illo-fill-primary"/>
        <path d="M300,100 L500,300" class="illo-stroke-weak" stroke-width="8" fill="none"/>
        <circle cx="480" cy="220" r="64" class="illo-fill-secondary"/>
      </svg>
      <figcaption class="sr-only">{{ title }}</figcaption>
    </figure>
  `
})
export class IllustrationComponent {
  @Input() title = 'Karşılama illüstrasyonu';
  titleId = 'illo-' + Math.random().toString(36).slice(2);
}
```

Kullanım (örnek):
```html
<!-- src/app/app.component.html (veya herhangi bir template) -->
<app-illustration title="Klinik karşılaması"></app-illustration>
```

> **Güvenlik**: Inline SVG’ye dış kaynaktan ham HTML olarak ek yapmayın (XSS riski). Dosyayı **önce** projeye alın ve gerekirse SVGO’dan geçirin.

---

## 5) Lottie (Animasyon) Entegrasyonu – Web Component ile
Ek bağımlılık eklemeden **LottieFiles web component** kullanabilirsiniz. Angular’da custom element kullanımı için ek bir ayar gerekmez.

**1) index.html** içine player script’i ekleyin:
```html
<script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js" defer></script>
```

**2) Şablonda kullanın:**
```html
<lottie-player
  src="assets/illustrations/lottie/hero.json"
  background="transparent"
  speed="1"
  loop
  autoplay
  style="width: 480px; height: 320px;">
</lottie-player>
```

> **Renk uyarlama:** En sağlam yaklaşım, Lottie JSON’u **önceden** (LottieFiles Editor vb.) kurumsal HEX kodlarınızla renklendirip `assets/illustrations/lottie/` içine koymaktır. JSON’u runtime’da manipüle etmek (ör. `lottie-web` ile) mümkündür fakat katman adlarına bağımlı olduğu için kırılgandır.

---

## 6) Tema Anahtarlayıcı (Theme Toggle) Bileşeni
Sağladığınız servisle birebir uyumlu, **standalone** bir bileşen:

```ts
// src/app/shared/components/theme-toggle/theme-toggle.component.ts
import { Component, computed, inject } from '@angular/core';
import { ThemeService, Theme } from '../../../core/theme/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <button type="button" class="glass-card"
            (click)="toggle()"
            [title]="'Tema: ' + theme()">
      <span *ngIf="theme() === 'light'">☀️ Light</span>
      <span *ngIf="theme() === 'dark'">🌙 Dark</span>
      <span *ngIf="theme() === 'auto'">🖥️ Auto</span>
    </button>
  `,
  styles: [`
    button {
      padding: .5rem .75rem;
      border-radius: .75rem;
      border: none;
      cursor: pointer;
      box-shadow: var(--shadow-sm);
      color: var(--color-neutral-900);
    }
    html.dark-theme button { color: var(--color-neutral-800); }
  `]
})
export class ThemeToggleComponent {
  private readonly themeService = inject(ThemeService);
  theme = computed<Theme>(() => this.themeService.getTheme());
  toggle() { this.themeService.toggleTheme(); }
}
```

**AppComponent** şablonuna eklemiştik:
```html
<app-theme-toggle class="theme-toggle"></app-theme-toggle>
```

---

## 7) İllüstrasyon Kaynakları ve Lisans Notları (Özet)
- **Atıfsız ticari kullanımı** genellikle destekleyenler: unDraw, ManyPixels, Open Peeps/Open Doodles (CC0), illlustrations.co (MIT), DrawKit’in bazı paketleri, Lukasz Adam’ın koleksiyonu (genellikle MIT/CC0).
- **Atıf gerektirebilenler (ücretsiz katman)**: Storyset (Freepik), Icons8 Ouch! vb.  
> **İlke:** Her bir dosyanın kendi **lisans sayfasını** mutlaka kontrol edin. Gerekirse sayfa altbilgisine atıf ekleyin:  
> `İllüstrasyon: Storyset – storyset.com` veya `İllüstrasyon: Icons8 – icons8.com`
>
ManyPixels        -> https://www.manypixels.co/gallery
unDraw            -> https://undraw.co/illustrations
Storyset          -> https://storyset.com/
Icons8 Ouch!      -> https://icons8.com/illustrations
Blush             -> https://blush.design/
Open Peeps        -> https://www.openpeeps.com/
Open Doodles      -> https://www.opendoodles.com/
IRA Design        -> https://iradesign.io/
LottieFiles       -> https://lottiefiles.com/
DrawKit           -> https://www.drawkit.com/
illlustrations.co -> https://illlustrations.co/
Lukasz Adam       -> https://lukaszadam.com/illustrations

---

## 8) Erişilebilirlik (A11y) Kontrolleri
- Dekoratif SVG’ler için `aria-hidden="true"` veya hiç `role` vermeyin. Anlamlı SVG’lerde `<title>` + `aria-labelledby` kullanın.
- **Kontrast:** `--color-primary` ve metin/zemin etkileşimlerini **WCAG AA**’ya göre doğrulayın.
- **Klavye:** Tema butonu `<button>` ile erişilebilir; `title`/`aria-label` ekleyin.

---

## 9) Performans ve Yükleme Stratejisi
- **SVGO** ile SVG’leri optimize edin.
- **Lazy load**: Fold altındaki Lottie/SVG’ler için IntersectionObserver tabanlı basit bir directive kullanabilirsiniz (örnek aşağıda).
- **Cache**: `assets/illustrations/**` uzun süreli cache; içerik değişince dosya adını değiştirin (hash).

**Basit Lazy Directive (opsiyonel):**
```ts
// src/app/shared/directives/lazy-observe.directive.ts
import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[appLazyObserve]',
  standalone: true
})
export class LazyObserveDirective implements OnInit, OnDestroy {
  @Input('appLazyObserve') classWhenVisible = 'is-visible';
  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.el.nativeElement.classList.add(this.classWhenVisible);
          this.disconnect();
        }
      });
    }, { rootMargin: '128px' });
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void { this.disconnect(); }
  private disconnect() { this.observer?.disconnect(); }
}
```

Kullanım:
```html
<div appLazyObserve="in-view">
  <app-illustration title="Asenkron randevu"></app-illustration>
</div>
```

---

## 10) SVGO ile Toplu Optimizasyon
**Kurulum:**
```bash
npm i -D svgo
```

**Yapılandırma:**
```js
// tools/svgo.config.mjs
export default {
  multipass: true,
  js2svg: { pretty: false },
  plugins: [
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'removeEditorsNSData',
    'cleanupAttrs',
    'convertStyleToAttrs',
    'removeUselessDefs',
    'cleanupNumericValues',
    'collapseGroups',
    'convertShapeToPath',
    { name: 'removeAttrs', params: { attrs: '(data-name|id|class)' } },
    { name: 'removeDimensions' } // width/height -> viewBox kalsın
  ]
};
```

**Script:**
```json
// package.json
{
  "scripts": {
    "svgo": "svgo -f src/assets/illustrations/static -o src/assets/illustrations/static --config=tools/svgo.config.mjs"
  }
}
```

> **İpucu:** Bir “temizleme” prompt’u ile Claude Code’dan SVG’deki hex `fill`/`stroke` özniteliklerini uygun `.illo-*` sınıflarına dönüştürmesini isteyebilirsiniz.

---

## 11) QA Checklist (Yayın Öncesi)
- [ ] Her dosyanın **lisansı** ve gerekirse **atıfı** doğrulandı.
- [ ] SVG’ler **SVGO**’dan geçirildi; `viewBox` korundu.
- [ ] Inline SVG’lerde sabit `fill/stroke` kaldırılıp `.illo-*` sınıfları uygulandı.
- [ ] A11y: Anlamlı SVG’lerde `<title>`/`aria-labelledby`; dekoratif olanlarda `aria-hidden`.
- [ ] Lottie JSON’ları önceden kurumsal HEX’lerle renklendirildi.
- [ ] **FOUC yok**: `tokens.css` fallback yüklü, ThemeService erkenden instantiate ediliyor.
- [ ] Performans: Lazy load, cache, boyutlar/`width/height` tanımlı.
- [ ] Karanlık/Aydınlık modda **WCAG AA** kontrastları sağlanıyor.

---

## 12) Sık Sorunlar
- **ThemeService çalışıyor ama renkler değişmiyor** → SVG içinde inline `style` veya `fill="#xxxxxx"` değerleri kalmış olabilir. Kaldırıp `.illo-*` sınıfları uygulayın.
- **Lottie renkleri değişmedi** → Katman efekt/gradyan kullanıyor olabilir. JSON’u editörde yeniden renklendirin ve kaydedin.
- **Kök sınıf uygulanmıyor** → `ThemeService` projenizde ilk enjekte edilmeden render oluyorsa, `AppComponent`’e injection eklediğinizden emin olun.

---

## 13) Hızlı Komutlar
```bash
# SVG optimizasyonu
npm run svgo
```

---

## 14) Claude Code için Yararlı İstemler (Prompt’lar)
- **SVG sınıf dönüşümü:**  
  *“Bu SVG içindeki tüm `fill="#..."` / `stroke="#..."` özniteliklerini kaldırıp uygun yerlere `.illo-fill-primary` / `.illo-stroke-weak` gibi sınıflar ekle. `viewBox`’ı koru, grupları sadeleştir.”*
- **Palet eşleme tablosu:**  
  *“SVG’deki hex renkleri çıkarıp `--color-primary/secondary/accent` eşlemesini öner; en yakın eşleşme için ΔE farkını not et.”*

---

## 15) Hızlı Başlangıç Özeti
1. `tokens.css` ve `illustrations.css` dosyalarını global stillere import et.
2. `AppComponent` içine `ThemeService`’i enjekte et; `ThemeToggle` bileşenini ekle.
3. SVG’leri `assets/illustrations/static` altına al, **SVGO** ile optimize et.
4. Inline SVG’ye `.illo-*` sınıflarını uygula.
5. Animasyon gerekiyorsa Lottie JSON’u **önceden** renklendirip `assets/illustrations/lottie` altına koy ve `<lottie-player>` ile şablona ekle.
6. Yayın öncesi **QA checklist** üzerinden geç.

> Bu talimatname, verdiğiniz `ThemeService` ile birebir uyumlu çalışır ve Angular uygulamanızda **tema‑duyarlı** illüstrasyon akışını standartlaştırır.
