# MD3 Non-Home Page Standard Template

Bu standart, **anasayfa haricindeki tum sayfalar** icin tekil bir MD3 Expressive duzeni tanimlar. Hedef, estetik tutarlilik + yuksek okunabilirlik + dusuk bilissel yuk + dogrudan uygulanabilir implementasyon netligidir.

## 0) Tasarim Niyeti

Bu tasarim, bilgi arayan ebeveynin veya hizmete karar veren kullanicinin ic sayfalarda kritik icerigi daha hizli taramasini, daha rahat anlamasini ve daha guvenli aksiyona gecmesini iyilestirir.

## 1) Platform ve Olgunluk Notu

- Hedef yuzey: web/desktop + mobile web
- Olgunluk seviyesi: core MD3 semantic token sistemi + kontrollu Expressive katman
- Not: Wear OS 6 ve Compose spesifik Expressive API isimleri bu dokumanda **referans niyet** olarak dusunulur; web tarafta token-first uyarlama esas alinir.

## 2) Expressive Seviye Politikasi

Bu standardin varsayilan seviyesi: **Moderate Expressive**.

Seviye secenekleri:
- `standard-page--expressive-minimum`
- `standard-page--expressive-moderate` (onerilen varsayilan)
- `standard-page--expressive-maximum` (sadece dusuk riskli marka anlari)

Seviye secim kriteri:
- Minimum: yasal metin, yogun bilgi, dusuk dekor ihtiyaci
- Moderate: hizmet, kaynak, iletisim, hakkimizda sayfalari
- Maximum: kampanya, ozel duyuru, lansman, storytelling girisleri

Trade-off:
- Seviye arttikca ayrisma ve estetik vurgu artar
- Seviye arttikca bilissel yuk ve implementasyon/test maliyeti artar
- Kritik karar ekranlarinda (randevu formu, yasal onam) minimum/moderate disina cikilmaz

## 3) Dayanak Dokumanlar

- [md3-foundation-principles.md](./md3-foundation-principles.md)
- [md3-token-governance.md](./md3-token-governance.md)
- [md3-components-patterns.md](./md3-components-patterns.md)
- [md3-motion-shape-accessibility.md](./md3-motion-shape-accessibility.md)
- [md3-compliance-matrix.md](./md3-compliance-matrix.md)

## 4) Token Esleme Matrisi (Zorunlu)

| Alan | Ana token rolleri | Destek tokenlari | Yorum |
|---|---|---|---|
| Sayfa zemini | `--md-sys-color-surface` | `--md-sys-color-on-surface` | Uzun okuma icin sakin zemin |
| Bolum varyantlari | `surface-container-*` | `outline-variant` | Derinlik once tonal farkla verilir |
| Kartlar | `surface-container-low` | `elevation-level1/2` | Hover sadece bir seviye yukselir |
| Basliklar | typescale display/headline | `on-surface` | Gradient metin yerine semantic text |
| Ikincil metin | body roles | `on-surface-variant` | Metin hiyerarsisi burada kurulur |
| CTA vurgu | `primary-container` veya `surface-container-high` | `on-primary-container` | Kontrast + okunurluk dengesi |
| Etkilesim | `state-* opacity` | `focus-ring-*` | Shadow yerine state layer once gelir |

## 5) Canonical Sayfa Anatomisi

1. `div.standard-page`
2. `app-page-header`
3. `main.standard-page-main`
4. 1..n adet `section.standard-page-section`
5. Opsiyonel `app-contact-cta`

Minimal fakat production-ready semantik iskelet:

```html
<div class="standard-page standard-page--expressive-moderate">
  <app-page-header
    [title]="pageTitle"
    [subtitle]="pageSubtitle"
    [breadcrumbs]="breadcrumbs">
  </app-page-header>

  <main class="standard-page-main" id="main-content">
    <section class="standard-page-section standard-page-section--surface standard-page-section--reveal">
      <div class="standard-page-container standard-page-container--content">
        <header class="standard-page-section-header">
          <span class="standard-page-eyebrow">Kategori</span>
          <h2 class="standard-page-title">Bolum Basligi</h2>
          <p class="standard-page-subtitle">Bolum amacini 1-2 cümlede aciklayan metin</p>
        </header>

        <div class="standard-page-grid standard-page-grid--2">
          <article class="standard-page-card standard-page-card--interactive">
            <div class="standard-page-card__media" aria-hidden="true">
              <span class="material-icons-rounded">health_and_safety</span>
            </div>
            <div class="standard-page-card__body">
              <p class="standard-page-card__kicker">Bilimsel temel</p>
              <h3 class="standard-page-card__title">Alt Baslik</h3>
              <p class="standard-page-card__description">Acilayici aciklama metni.</p>
            </div>
            <div class="standard-page-card__actions">
              <a class="standard-page-link" href="#">Detayi Gor</a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="standard-page-section standard-page-section--surface-container-low">
      <div class="standard-page-container standard-page-container--wide">
        <div class="standard-page-layout standard-page-layout--with-aside">
          <article class="standard-page-prose">
            <h2>Uzun Icerik Basligi</h2>
            <p>Okunurluk odakli ana metin...</p>
          </article>
          <aside class="standard-page-rail">
            <div class="standard-page-callout">
              <h3>Hizli Not</h3>
              <p>Kritik, oz ve taranabilir bilgi.</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </main>

  <app-contact-cta></app-contact-cta>
</div>
```

## 6) Yapi Bazli Izahat (Her Yapi)

### 6.1 `standard-page` (root shell)

- Amac: tum ic sayfanin tek bir tema/motion/a11y baglaminda calismasi
- Gorsel sorumluluk: ambient arka plan yogunlugunu seviye bazli yonetmek
- Davranis: expression-level siniflari (`minimum/moderate/maximum`) burada uygulanir
- A11y: temel metin rengi root seviyede garanti altina alinir

### 6.2 `app-page-header` + `md3-page-header`

- Amac: sayfa kimligini, baglami ve hiyerarsiyi ilk ekranda netlestirmek
- Zorunlu alanlar: `title`, `breadcrumbs`; `subtitle` strongly recommended
- Stil: title/subtitle olcekleri ic sayfada normalize edilir; marka gorselligi metnin onune gecmez
- Kural: header altinda tekrar H1 kullanilmaz

### 6.3 `standard-page-main`

- Amac: ana icerik eksenini semantik olarak izole etmek
- Yapi: section stack davranisi burada toplanir
- Kural: reklam/yan unsur yerine icerik akisinin merkezlenmesi esas

### 6.4 `standard-page-section` ve varyantlari

- Amac: icerigi anlamli bloklara ayirmak
- Varyant secimi:
  - `--surface`: default bilgi bloklari
  - `--surface-container-low/high`: ritim ve tonal ayrisma
  - `--primary`: sinirli vurgu/callout
- Kural: ardisik bolumlerde ayni tonal agirlik yinelenmez; ritim olusturulur

### 6.5 `standard-page-container` varyantlari

- `--narrow`: yasal/uzun metin
- `--content`: makale benzeri okuma akislar
- `--wide`: kart grid + tablo + yan kolon kombinasyonlari
- Kural: satir uzunlugu 75ch civarinda tutulur

### 6.6 `standard-page-section-header`

- Amac: her bolumun "ne oldugu"nu ilk 3 satirda anlatmak
- Atomlar:
  - `standard-page-eyebrow`: kategorik etiket
  - `standard-page-title`: bolumun asil mesaji
  - `standard-page-subtitle`: karar verdiren aciklayici metin
- Kural: basliklar semantik renkle kalir; dekoratif gradient metin uygulanmaz

### 6.7 `standard-page-grid` ve `standard-page-layout`

- Amac: responsive icerik dagilimini standardize etmek
- `grid--2` ve `grid--3`: kart yogun bolumler icin
- `layout--with-aside`: ana icerik + rehber rail duzeni
- Kural: mobilde tum yapilar tek kolona duserek okunurluk korur

### 6.8 `standard-page-card` ailesi

- Amac: bilgi parcaciklarini taranabilir birimlere bolmek
- Alt anatomiler:
  - `__media`: ikon/gorsel baglam
  - `__body`: kicker + title + description
  - `__actions`: birincil/ikincil eylem
- Etkilesim: interaktif kartta state layer + focus-visible + kontrollu elevation
- Kural: hover’da agresif ziplama/abarti scale yok

### 6.9 `standard-page-prose`

- Amac: uzun metin okunurlugunu yuksek tutmak
- Davranis: paragraf araligi, line-length, list/blockquote tutarliligi
- Kural: prose zemininde glass/blur uygulanmaz

### 6.10 `standard-page-table-wrap` ve `standard-page-table`

- Amac: veri yogun bolumlerde yatay tasma sorununu cozmeyi garanti etmek
- Davranis: mobilde yatay kaydirma + baslik/hucre tipografi ayrimi
- Kural: tablo kontrasti outline-variant ile korunur

### 6.11 `standard-page-cta` ve `standard-page-actions`

- Amac: bolum veya sayfa sonu aksiyonunu belirginlestirmek
- Davranis: tek bir birincil aksiyon onceliklidir; ikincil eylemler sade kalir
- Kural: CTA alaninda metin > dekor prensibi korunur

### 6.12 `standard-page-rail` (aside)

- Amac: ana akis bozulmadan ek degerli bilgi sunmak
- Davranis: desktopta sticky davranis; mobilde ana akisa inline eklenir
- Kural: rail, ana metnin dikkatini calacak yogunlukta olmamali

### 6.13 `standard-page-filter-bar` (opsiyonel)

- Amac: kaynak/liste sayfalarinda arama ve filtreyi normalize etmek
- Davranis: input + action elementleri 48px hedef boyutuna uyar
- Kural: filtre paneli action alanina donusmez; bilgi bulma gorevine hizmet eder

### 6.14 `standard-page-chip` ve `standard-page-callout`

- `chip`: mikro metadata (kategori, sure, seviye)
- `callout`: kritik yonlendirme veya guven veren on bilgi
- Kural: chip sayisi bir satirda taramayi bozacak seviyeye cikmamalidir

## 7) Motion ve Durum Gecisleri

Varsayilan motion:
- Gecis: `--md-sys-transition-standard`
- Reveal: `--md-sys-motion-duration-medium2` + emphasized decelerate
- Hover/pressed/focus: state opacity tokenlari

Kurallar:
- Motion hiyerarsi anlatir, dekorasyon yapmaz
- Bir sayfada birincil hareket dili tek olmalidir (karişik easing yok)
- Maximum expressive seviyede bile reduced-motion mutlak onceliktir

## 8) Erişilebilirlik Kalite Kontrati

- Metin kontrasti min 4.5:1
- Ikon/UI kontrasti min 3:1
- Dokunma hedefi min 48px
- `:focus-visible` net ve tutarli
- Klavye ile tam dolasim
- `prefers-reduced-motion` aktifken transform/animasyon minimuma iner
- `forced-colors` kipinde border/focus kaybolmaz

## 9) Sayfa Tipi Blueprintleri

### 9.1 Liste / Index

Sira:
1. Header
2. Filter bar
3. Kategori grid
4. Yardimci bilgi/callout
5. CTA

### 9.2 Detay / Makale

Sira:
1. Header
2. Intro karti
3. Prose + rail
4. Ozet/next steps
5. CTA

### 9.3 Hizmet Detay

Sira:
1. Header
2. Problem/vaat girisi
3. Fayda kartlari
4. Surec/timeline veya tablo
5. Guven arttirici callout
6. CTA

### 9.4 Yasal/Bilgilendirme

Sira:
1. Header
2. Dar prose alani
3. Maddeli aciklamalar
4. Guncelleme tarihi + iletisim referansi

## 10) Anti-Pattern Listesi

- Hardcoded hex/rgba ile semantic rol bypass
- MD2 agir shadow stack veya glow agir dekor
- Bir sayfada birden fazla H1
- Sadece hover shadow ile geri bildirim verme
- Uzun metin arkasinda blur/glass
- Mobilde 48px altinda aksiyon alani
- Ayni sayfada expression level karmasasi

## 11) Uygulama Kararlari (Now / Later)

Hemen uygulanacaklar:
1. `standard-page` root + expression level sinifi ekleme
2. Header/title/subtitle normalize etme
3. Section/container/grid siniflarini canonical yapiya cekme
4. Card ve CTA alanlarinda state/focus kurallarini sabitleme

Ikinci faz:
1. Eski sayfalari `service-base-styles.css` benzeri legacy kaliplardan yeni sablona migrate etme
2. Sayfa tipine gore otomatik layout presetleri cikarma
3. E2E seviyesinde a11y + motion regressions testlerini genisletme

## 12) Migration Kontrol Listesi

- Header kontrati (`title/subtitle/breadcrumbs`) guncellendi mi?
- Root shell expression seviyesi secildi mi?
- Section ritmi tonal hiyerarsiye gore kuruldu mu?
- Kartlar `level1 -> level2` disina tasiyor mu?
- Focus-visible ve reduced-motion smoke testleri geciyor mu?
- Dark/high-contrast kiplerinde okunurluk stabil mi?

## 13) Referans Stil Dosyasi

Bu standardin paylasilabilir CSS sablonu:
- [src/app/pages/shared/non-home-page-template.css](../../src/app/pages/shared/non-home-page-template.css)

Yeni sayfalarda bu dosya class adlari baz alinmali; mevcut sayfalar adim adim bu standarda migrate edilmelidir.
