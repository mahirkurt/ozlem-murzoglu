# Proje: Bright Futures - Angular & MD3 Sanatsal Uygulama Kılavuzu

**Felsefe:** Amacımız, bilgiyi sunmaktan öte, ebeveynlere güven ve dinginlik hissi veren, dijital bir sığınak yaratmaktır. Bu kılavuz, sıradan bir sayfayı, mikro-etkileşimler, görsel ritim ve anlamsal renklendirme ile unutulmaz bir deneyime dönüştürmenin ileri düzey tekniklerini içermektedir.

---

### **Bölüm 1: Komponent Şablonu: Ritim ve Hiyerarşi (`component.html`)**

Statik bir kart yığınından kaçınıp, kullanıcıya görsel bir yolculuk sunuyoruz. Bir giriş paragrafı ile tonu belirliyor, "vurgu kartı" ile kilit bilgileri öne çıkarıyor ve `mat-divider` ile görsel nefes alanları yaratıyoruz.

```html
<!-- page-component.html -->
<div class="content-container" [@listAnimation]="sections.length">

  <!-- SAYFA BAŞLIĞI VE GİRİŞ METNİ -->
  <header class="page-header">
    <h1 class="page-title">10 Yaşındaki Çocuğunuz İçin Bilgiler</h1>
    <p class="page-lead">
      Çocuğunuzun hayatındaki bu önemli dönemeçte, fiziksel, duygusal ve sosyal gelişimini anlamak, ona en iyi şekilde rehberlik etmenizi sağlar. İşte bu yolculukta size ışık tutacak bilgiler.
    </p>
  </header>

  <!-- BÖLÜMLER (Dinamik olarak *ngFor ile oluşturulur) -->
  <ng-container *ngFor="let section of sections">

    <!-- VURGU KARTI (Önemli ipuçları için özel tasarım) -->
    <mat-card *ngIf="section.isAccent" class="info-card accent-card">
      <mat-card-header>
        <mat-icon mat-card-avatar>tips_and_updates</mat-icon>
        <mat-card-title class="section-headline">{{ section.title }}</mat-card-title>
      </mat-card-header>
      <mat-card-content class="body-text" [innerHTML]="section.content"></mat-card-content>
    </mat-card>

    <!-- STANDART BİLGİ KARTI -->
    <mat-card *ngIf="!section.isAccent && !section.panels" class="info-card">
      <mat-card-header>
        <mat-card-title class="section-headline">{{ section.title }}</mat-card-title>
      </mat-card-header>
      <mat-card-content class="body-text" [innerHTML]="section.content"></mat-card-content>
    </mat-card>

    <!-- AÇILIR PANELLİ KART -->
    <mat-card *ngIf="section.panels" class="info-card">
      <mat-card-header>
        <mat-card-title class="section-headline">{{ section.title }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-accordion>
          <mat-expansion-panel *ngFor="let panel of section.panels">
            <mat-expansion-panel-header>
              <mat-panel-title>
                <mat-icon>{{ panel.icon }}</mat-icon>
                {{ panel.title }}
              </mat-panel-title>
            </mat-expansion-panel-header>
            <div class="body-text" [innerHTML]="panel.content"></div>
          </mat-expansion-panel>
        </mat-accordion>
      </mat-card-content>
    </mat-card>

  </ng-container>
</div>
```

---

### **Bölüm 2: Komponent Stilleri: Derinlik ve Etkileşim (`component.scss`)**

Burası sihrin gerçekleştiği yer. Statik stile veda edip, Angular'ın gücüyle bileşene özel, yaşayan ve nefes alan stiller yaratıyoruz. `:host` ile animasyonları bileşene bağlıyor, `::ng-deep` ile Material bileşenlerinin ruhuna dokunuyoruz.

```scss
/* page-component.scss */
:host {
  display: block;
  overflow: hidden; // Animasyonların taşmasını engellemek için
}

.content-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem;
}

.page-header {
  margin-bottom: 3rem;
  text-align: center;
}

.page-lead {
  font-family: var(--md-sys-typescale-title-large-font);
  font-size: var(--md-sys-typescale-title-large-size);
  line-height: var(--md-sys-typescale-title-large-line-height);
  color: var(--md-ref-palette-neutral-variant30);
  max-width: 700px;
  margin: 1rem auto 0;
}

.info-card {
  // Animasyonlar .ts dosyasından gelecek
  margin-bottom: 2rem;
}

// Vurgu kartı için özel, dikkat çekici stil
.accent-card {
  background-color: var(--md-ref-palette-tertiary95) !important;
  border: 1px solid var(--md-ref-palette-tertiary90);
}

.accent-card .mat-icon {
  color: var(--md-ref-palette-tertiary40);
}

// Expansion Panel'i daha rafine hale getiriyoruz
::ng-deep .mat-expansion-panel {
  border-bottom: 1px solid var(--md-ref-palette-neutral-variant90);
  border-radius: 0 !important;
}
::ng-deep .mat-expansion-panel:first-of-type {
  border-top: 1px solid var(--md-ref-palette-neutral-variant90);
}

::ng-deep .mat-expansion-panel-header {
  transition: background-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
}

::ng-deep .mat-expansion-panel.mat-expanded .mat-expansion-panel-header {
  background-color: var(--md-ref-palette-primary95);
}

.mat-panel-title {
  font-family: var(--md-sys-typescale-title-medium-font);
  font-weight: var(--md-sys-typescale-title-medium-weight);
  color: var(--md-ref-palette-primary10);
  align-items: center;
}

.mat-panel-title .mat-icon {
  margin-right: 16px;
  color: var(--md-ref-palette-primary40);
}

// Listeleri sıradanlıktan kurtarıp, markaya özel hale getiriyoruz
::ng-deep .body-text ul {
  list-style: none;
  padding-left: 0;
  margin-top: 16px;
}

::ng-deep .body-text li {
  padding-left: 2.5rem;
  position: relative;
  margin-bottom: 12px;
}

::ng-deep .body-text li::before {
  font-family: 'Material Symbols Outlined';
  content: '\\e5ca'; // 'check_circle' ikonu
  position: absolute;
  left: 0;
  top: 2px;
  font-size: 20px;
  color: var(--md-ref-palette-primary40);
}
```

---

### **Bölüm 3: Komponent Mantığı ve Animasyonlar (`component.ts`)**

İleri düzey Angular animasyonları ile sayfaya hayat veriyoruz. Kartlar artık ekrana "dökülerek" gelecek ve kullanıcıyı nazikçe karşılayacak. Veri yapımız, farklı kart türlerini destekleyecek şekilde daha zengin ve esnek.

```typescript
// page-component.ts
import { Component } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

// KARTLARIN GİRİŞ ANİMASYONU
export const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger('100ms', 
        animate('500ms var(--md-sys-motion-easing-emphasized-decelerate)', 
        style({ opacity: 1, transform: 'translateY(0)' })))
    ], { optional: true })
  ])
]);

@Component({
  selector: 'app-bright-futures-page',
  templateUrl: './page-component.html',
  styleUrls: ['./page-component.scss'],
  animations: [listAnimation] // Animasyonu bileşene bağlıyoruz
})
export class BrightFuturesPageComponent {

  // Zenginleştirilmiş, esnek veri yapısı
  sections = [
    {
      title: 'Fiziksel Gelişim',
      content: `<p>Bu dönemde çocuğunuzun büyümesi yavaşlayabilir. Kızlar genellikle erkeklerden daha erken ergenliğe girerler. Çocuğunuzun <strong>beden imajı</strong> hakkında endişeleri olabilir. Sağlıklı beslenme ve düzenli fiziksel aktivite bu dönemde kritik öneme sahiptir.</p>`
    },
    {
      title: 'Ebeveynler İçin İpuçları',
      isAccent: true, // Bu kartın vurgu kartı olacağını belirtir
      content: `
        <p>Çocuğunuzla sağlıklı bir ilişki kurmak için aşağıdaki adımları izleyebilirsiniz:</p>
        <ul>
          <li>Onunla her gün okul ve arkadaşları hakkında konuşun.</li>
          <li>Başarılarını ve çabalarını takdir edin.</li>
          <li>Evde net ve tutarlı kurallar belirleyin.</li>
          <li>Okul etkinliklerine ve veli toplantılarına aktif olarak katılın.</li>
          <li>Ona sevginizi ve desteğinizi her fırsatta gösterin.</li>
        </ul>`
    },
    {
      title: 'Duygusal ve Sosyal Gelişim',
      panels: [ // Bu kartın açılır paneller içereceğini belirtir
        {
          icon: 'groups',
          title: 'Arkadaşlık İlişkileri',
          content: `<p>Çocuğunuzun <strong>en iyi arkadaşları</strong> olabilir ve arkadaş grupları önem kazanır. Akran baskısı bu dönemde başlayabilir. Çocuğunuzun arkadaşlarıyla sağlıklı ilişkiler kurmasına yardımcı olun.</p>`
        },
        {
          icon: 'psychology',
          title: 'Duygusal Farkındalık',
          content: `<p>Kendi duygularını daha iyi anlar ve ifade eder. Başkalarının bakış açılarına karşı daha <strong>duyarlı</strong> hale gelir. Empati yeteneği gelişir ve daha karmaşık sosyal durumları anlamaya başlar.</p>`
        }
      ]
    }
  ];
}
