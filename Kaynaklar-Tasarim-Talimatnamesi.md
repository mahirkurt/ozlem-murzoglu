# KAYNAKLAR SAYFASI TASARIM TAL0MATNAMES0
## Material Design 3 (MD3) Profesyonel Tasar1m Sistemi

---

## <� 1. TASARIM FELSEFES0

### Temel Prensipler
- **Netlik ve Okunabilirlik**: T�m i�erik hiyerar_ik yap1da, kolay taranabilir
- **G�rsel Hiyerar_i**: Ba_l1klar, alt ba_l1klar ve i�erik aras1nda belirgin ayr1m
- **Renk Psikolojisi**: Kurumsal g�ven veren, profesyonel renk paleti
- **Responsive Tasar1m**: T�m cihazlarda kusursuz g�r�n�m
- **Eri_ilebilirlik**: WCAG 2.1 AA standartlar1na uyum

---

## <� 2. RENK PALET0

### Ana Renkler
```css
--color-primary: #005f73;        /* Koyu Teal - G�ven ve Profesyonellik */
--color-primary-light: #0a9396;  /* A�1k Teal */
--color-primary-dark: #003d48;   /* �ok Koyu Teal */

--color-secondary: #94d2bd;      /* Soft Mint - Sal1k ve Tazelik */
--color-secondary-light: #b8e4d5; 
--color-secondary-dark: #6fb39e;

--color-accent: #ffb703;         /* Alt1n Sar1 - Dikkat �ekici */
--color-accent-light: #ffd60a;
--color-accent-dark: #fb8500;
```

### N�tr Renkler
```css
--color-neutral-50: #f8fafc;
--color-neutral-100: #f1f5f9;
--color-neutral-200: #e2e8f0;
--color-neutral-300: #cbd5e1;
--color-neutral-400: #94a3b8;
--color-neutral-500: #64748b;
--color-neutral-600: #475569;
--color-neutral-700: #334155;
--color-neutral-800: #1e293b;
--color-neutral-900: #0f172a;
```

### Semantik Renkler
```css
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error: #ef4444;
--color-info: #3b82f6;
```

---

## =� 3. T0POGRAF0 S0STEM0

### Font Ailesi
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-secondary: 'Poppins', sans-serif;
--font-mono: 'Fira Code', 'Consolas', monospace;
```

### Ba_l1k Hiyerar_isi
| Seviye | Font Size | Line Height | Font Weight | Kullan1m |
|--------|-----------|-------------|-------------|----------|
| H1 | 2.75rem (44px) | 1.2 | 800 | Sayfa Ana Ba_l11 |
| H2 | 2.25rem (36px) | 1.3 | 700 | B�l�m Ba_l1klar1 |
| H3 | 1.75rem (28px) | 1.4 | 600 | Alt B�l�mler |
| H4 | 1.375rem (22px) | 1.5 | 600 | K���k Ba_l1klar |
| H5 | 1.125rem (18px) | 1.6 | 500 | Liste Ba_l1klar1 |
| H6 | 1rem (16px) | 1.6 | 500 | Detay Ba_l1klar1 |

### Body Text
- **Normal**: 1.0625rem (17px), line-height: 1.8
- **Small**: 0.9375rem (15px), line-height: 1.7
- **Caption**: 0.875rem (14px), line-height: 1.6

---

## <� 4. COMPONENT TASARIMLARI

### 4.1 Hero Section
```css
.resource-hero {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  padding: 8rem 0 4rem;
  position: relative;
  overflow: hidden;
}

/* Dekoratif Pattern */
.hero-pattern {
  position: absolute;
  opacity: 0.1;
  /* SVG pattern veya gradient overlay */
}
```

### 4.2 0�erik Kartlar1
```css
.content-card {
  background: white;
  border-radius: 24px;
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.04),
    0 10px 15px rgba(0, 0, 0, 0.08);
  transform: translateY(-3rem);
}
```

### 4.3 Liste �eleri
**�zellikler:**
- 0konlu bullet points
- Hover efektleri
- Gradient arka planlar
- Smooth animasyonlar

```css
.content-body li {
  padding-left: 3rem;
  background: linear-gradient(90deg, rgba(0, 95, 115, 0.02) 0%, transparent 100%);
  transition: all 0.3s ease;
}

.content-body li:hover {
  transform: translateX(4px);
  background: rgba(0, 95, 115, 0.05);
}
```

### 4.4 Tablolar
**MD3 Tablo Tasar1m1:**
- Gradient ba_l1k sat1r1
- Zebra stripe pattern
- Hover highlight
- Rounded corners
- Soft shadows

### 4.5 �zel 0�erik Kutular1

#### Info Box
- Mavi gradient arka plan
- Sol border accent
- Info ikonu
- Yumu_ak g�lgeler

#### Warning Box
- Sar1 gradient arka plan
- Uyar1 ikonu
- Kontrast metin rengi

#### Success Box
- Ye_il gradient arka plan
- Onay ikonu
- Pozitif mesajlar i�in

#### Important Box
- Pembe gradient arka plan
- �st etiket badge
- Kritik bilgiler i�in

---

## =� 5. RESPONS0VE BREAKPOINTS

```css
/* Desktop XL */
@media (min-width: 1440px) { }

/* Desktop */
@media (max-width: 1439px) { }

/* Tablet Landscape */
@media (max-width: 1024px) { }

/* Tablet Portrait */
@media (max-width: 768px) { }

/* Mobile Large */
@media (max-width: 480px) { }

/* Mobile Small */
@media (max-width: 360px) { }
```

---

## ( 6. AN0MASYON VE GE�0^LER

### Temel Animasyonlar
```css
/* Fade In Up */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide In */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### Transition Deerleri
- **Fast**: 0.2s
- **Normal**: 0.3s
- **Slow**: 0.5s
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1)

---

## = 7. ER0^0LEB0L0RL0K

### WCAG 2.1 AA Uyumluluu
- Minimum kontrast oran1: 4.5:1 (normal metin)
- Minimum kontrast oran1: 3:1 (b�y�k metin)
- Focus g�stergeleri t�m interaktif elementlerde
- Keyboard navigasyon destei
- Screen reader uyumlu semantic HTML
- ARIA etiketleri

### Focus States
```css
:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 4px;
}
```

---

## =� 8. PERFORMANS OPT0M0ZASYONU

### CSS Optimizasyonlar1
1. **Critical CSS**: Above-the-fold i�erik i�in inline CSS
2. **Minification**: T�m CSS dosyalar1 minified
3. **Purge Unused**: Kullan1lmayan CSS temizlii
4. **Modern Properties**: CSS Grid, Flexbox, Custom Properties

### G�r�nt� Optimizasyonu
1. **Lazy Loading**: Viewport d1_1 g�rseller i�in
2. **WebP Format**: Modern taray1c1lar i�in
3. **Responsive Images**: srcset kullan1m1
4. **Blur-up Technique**: Progressive loading

---

## =� 9. SAYFA ^ABLONLARI

### 9.1 Standart 0�erik Sayfas1
```html
<div class="resource-page">
  <!-- Hero Section -->
  <section class="resource-hero">
    <div class="hero-pattern"></div>
    <div class="container">
      <nav class="breadcrumb">...</nav>
      <h1>Sayfa Ba_l11</h1>
      <p class="lead">A�1klama metni</p>
    </div>
  </section>

  <!-- Content Section -->
  <section class="resource-content">
    <div class="container">
      <div class="content-wrapper">
        <!-- Optional TOC Sidebar -->
        <aside class="toc-sidebar">...</aside>
        
        <!-- Main Content -->
        <div class="content-card">
          <div class="content-body">
            <!-- 0�erik buraya -->
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
```

### 9.2 Kategori Listesi Sayfas1
```html
<div class="category-page">
  <!-- Category Header -->
  <section class="category-header">
    <div class="container">
      <h1>Kategori Ad1</h1>
      <p>Kategori a�1klamas1</p>
      <div class="stats">...</div>
    </div>
  </section>

  <!-- Category Content -->
  <section class="category-content">
    <div class="container">
      <!-- Filter Bar -->
      <div class="filter-bar">...</div>
      
      <!-- Document Grid -->
      <div class="doc-grid">
        <!-- Document Cards -->
      </div>
    </div>
  </section>
</div>
```

---

## <� 10. UYGULAMA KONTROL L0STES0

### Her Sayfa 0�in Yap1lmas1 Gerekenler:

####  Tasar1m
- [ ] Hero section gradient arka plan
- [ ] 0�erik kart1 g�lgelendirme
- [ ] Ba_l1k hiyerar_isi kontrol�
- [ ] Renk paleti uyumu
- [ ] 0kon kullan1m1

####  Tipografi
- [ ] Font ailesi tan1mlamalar1
- [ ] Ba_l1k boyutlar1
- [ ] Line-height deerleri
- [ ] Letter-spacing ayarlar1
- [ ] Font-weight optimizasyonu

####  Responsive
- [ ] Mobile g�r�n�m testi
- [ ] Tablet g�r�n�m testi
- [ ] Desktop g�r�n�m testi
- [ ] Touch target boyutlar1 (min 44x44px)
- [ ] Overflow kontrol�

####  Eri_ilebilirlik
- [ ] Kontrast oranlar1
- [ ] Focus g�stergeleri
- [ ] ARIA etiketleri
- [ ] Semantic HTML
- [ ] Keyboard navigasyon

####  Performans
- [ ] CSS minification
- [ ] Lazy loading
- [ ] Critical CSS
- [ ] Animasyon performans1
- [ ] Render blocking kaynaklar

####  0nteraktivite
- [ ] Hover efektleri
- [ ] Transition smoothness
- [ ] Click/tap feedback
- [ ] Loading states
- [ ] Error states

---

## =� 11. SAYFA T0PLER0 VE �ZELL0KLER0

### Bright Futures Sayfalar1
- Ya_ gruplar1na g�re kategorize
- 0kon bazl1 navigasyon
- Progress indicator
- Ya_ �zel renk kodlamas1

### A_1 Bilgi Sayfalar1
- Medikal i�erik vurgusu
- Tablo youn layout
- Uyar1 kutular1
- Dozaj _emalar1

### Geli_im Rehberleri
- Timeline g�r�n�m�
- Milestone kartlar1
- 0nteraktif checklistler
- Progress tracking

### Hastal1k Bilgileri
- Semptom listeleri
- Tedavi protokolleri
- Acil durum kutular1
- 0la� tablolar1

### Medya Planlar1
- Grid layout
- Video embed alanlar1
- Download linkleri
- Sharing buttons

---

## =' 12. �ZEL COMPONENT'LER

### Progress Bar
```css
.progress-bar {
  height: 8px;
  background: var(--color-neutral-200);
  border-radius: 100px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  transition: width 0.5s ease;
}
```

### Badge System
```css
.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-primary { background: var(--color-primary); color: white; }
.badge-success { background: var(--color-success); color: white; }
.badge-warning { background: var(--color-warning); color: white; }
```

### Tooltip
```css
.tooltip {
  position: relative;
}

.tooltip-content {
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-neutral-800);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip:hover .tooltip-content {
  opacity: 1;
}
```

---

## =� NOTLAR

1. **Tutarl1l1k**: T�m sayfalar ayn1 tasar1m dilini kullanmal1
2. **Mod�lerlik**: Component'ler yeniden kullan1labilir olmal1
3. **�l�eklenebilirlik**: Yeni i�erik eklendiinde tasar1m bozulmamal1
4. **Bak1m Kolayl11**: CSS dei_kenleri ile merkezi kontrol
5. **Test**: Her dei_iklik sonras1 cross-browser test

---

**Son G�ncelleme**: 2025
**Versiyon**: 2.0
**Tasar1m Sistemi**: Material Design 3 (MD3)