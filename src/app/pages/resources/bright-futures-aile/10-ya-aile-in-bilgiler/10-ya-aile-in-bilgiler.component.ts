import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';

// Animasyonlar
const listAnimation = trigger('listAnimation', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger(100, [
        animate('400ms cubic-bezier(0.05, 0.7, 0.1, 1.0)', 
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ])
    ], { optional: true })
  ])
]);

const cardAnimation = trigger('cardAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(20px)' }),
    animate('400ms cubic-bezier(0.05, 0.7, 0.1, 1.0)', 
      style({ opacity: 1, transform: 'translateY(0)' })
    )
  ])
]);

interface ContentSection {
  title: string;
  content: string;
  isAccent?: boolean;
  icon?: string;
  panels?: Panel[];
}

interface Panel {
  title: string;
  content: string;
  expanded?: boolean;
}

@Component({
  selector: 'app-10-ya-aile-in-bilgiler',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatExpansionModule,
    MatListModule,
    MatChipsModule
  ],
  templateUrl: './10-ya-aile-in-bilgiler.component.html',
  styleUrl: './10-ya-aile-in-bilgiler.component.scss',
  animations: [listAnimation, cardAnimation]
})
export class Doc10YaAileInBilgilerComponent implements OnInit, AfterViewInit {
  title = '10. Yaş - Aile İçin Bilgiler';
  category = 'Bright Futures (Aile)';
  description: string = "AMERİKAN PEDİATRİ AKADEMİSİ AİLENİZ İÇİN BİLGİLER 10. YAŞ ZİYARETİ AİLENİZİN DURUMU Çocuğunuzu bağımsız ve sorumlu olmaya teşvik edin. Ona sık sık sarılın ve onu övün. Çocuğunuzla…";
  toc: { id: string; text: string; level: number }[] = [];
  private tocIds = new Set<string>();
  sections: ContentSection[] = [];

  @ViewChild('contentRoot') contentRoot!: ElementRef<HTMLElement>;

  constructor(private titleService: Title, private meta: Meta) {}

  ngOnInit(): void {
    const fullTitle = this.title + ' | Kaynaklar | Özlem Mürzoğlu';
    this.titleService.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: this.description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: this.description });
    this.initializeSections();
  }

  private initializeSections(): void {
    this.sections = [
      {
        title: 'Ailenizin Durumu',
        icon: 'family_restroom',
        isAccent: true,
        content: `
          <p><strong>Çocuğunuzla olan ilişkiniz bu dönemde çok önemlidir.</strong> Çocuğunuzu bağımsız ve sorumlu olmaya teşvik edin. 
          Ona sık sık sarılın ve onu övün. Her gün birlikte zaman geçirin ve onun ilgi alanlarını öğrenin.</p>
          <ul>
            <li>Çocuğunuzun arkadaşlarını ve ailelerini tanıyın</li>
            <li>Okul aktivitelerine katılımını destekleyin</li>
            <li>Düzenli aile yemekleri planlayın</li>
            <li>Açık ve dürüst iletişim kurun</li>
          </ul>
        `
      },
      {
        title: 'Gelişimsel Özellikler',
        icon: 'psychology',
        panels: [
          {
            title: 'Fiziksel Gelişim',
            content: `
              <p>10 yaşındaki çocuklar hızlı bir büyüme dönemine girerler. Bu dönemde:</p>
              <ul>
                <li>Boy ve kilo artışı hızlanır</li>
                <li>Motor becerileri gelişir</li>
                <li>Spor aktivitelerine ilgi artar</li>
                <li>Ergenlik öncesi değişimler başlayabilir</li>
              </ul>
            `,
            expanded: false
          },
          {
            title: 'Duygusal ve Sosyal Gelişim',
            content: `
              <p>Bu yaş grubunda duygusal dalgalanmalar normaldir:</p>
              <ul>
                <li>Arkadaş ilişkileri önem kazanır</li>
                <li>Bağımsızlık isteği artar</li>
                <li>Kendini ifade etme becerisi gelişir</li>
                <li>Sorumluluk bilinci oluşur</li>
              </ul>
            `,
            expanded: false
          },
          {
            title: 'Bilişsel Gelişim',
            content: `
              <p>Düşünce becerileri hızla gelişir:</p>
              <ul>
                <li>Soyut düşünme yeteneği artar</li>
                <li>Problem çözme becerileri gelişir</li>
                <li>Okuma ve yazma becerileri güçlenir</li>
                <li>Mantıklı düşünme kapasitesi artar</li>
              </ul>
            `,
            expanded: false
          }
        ]
      },
      {
        title: 'Beslenme ve Fiziksel Aktivite',
        icon: 'restaurant',
        content: `
          <h3>Sağlıklı Beslenme Alışkanlıkları</h3>
          <ul>
            <li>Günde 3 ana öğün ve 2 ara öğün</li>
            <li>Bol meyve ve sebze tüketimi</li>
            <li>Yeterli kalsiyum ve protein alımı</li>
            <li>Şekerli içeceklerden kaçınma</li>
          </ul>
          <h3>Fiziksel Aktivite Önerileri</h3>
          <ul>
            <li>Günde en az 60 dakika fiziksel aktivite</li>
            <li>Takım sporlarına katılım</li>
            <li>Ekran süresi sınırlaması (günde max 2 saat)</li>
            <li>Açık hava aktiviteleri</li>
          </ul>
        `
      },
      {
        title: 'Güvenlik Önlemleri',
        icon: 'security',
        isAccent: true,
        content: `
          <h3>Ev ve Okul Güvenliği</h3>
          <ul>
            <li>İnternet ve sosyal medya güvenliği kuralları</li>
            <li>Bisiklet kaskı kullanımı</li>
            <li>Araç içi emniyet kemeri takma</li>
            <li>Yabancılarla iletişim kuralları</li>
          </ul>
          <h3>Acil Durumlar</h3>
          <ul>
            <li>Acil telefon numaralarını bilme</li>
            <li>Temel ilk yardım bilgisi</li>
            <li>Yangın ve deprem tatbikatları</li>
          </ul>
        `
      },
      {
        title: 'Okul ve Öğrenme',
        icon: 'school',
        content: `
          <p>Okul başarısı için öneriler:</p>
          <ul>
            <li>Düzenli ders çalışma saatleri belirleme</li>
            <li>Sessiz bir çalışma ortamı sağlama</li>
            <li>Öğretmenlerle düzenli iletişim</li>
            <li>Okuma alışkanlığını teşvik etme</li>
            <li>Ödev sorumluluğunu destekleme</li>
          </ul>
        `
      },
      {
        title: 'Sağlık Kontrolleri',
        icon: 'medical_services',
        content: `
          <h3>Rutin Kontroller</h3>
          <ul>
            <li>Yıllık doktor muayenesi</li>
            <li>Diş kontrolü (6 ayda bir)</li>
            <li>Göz muayenesi</li>
            <li>İşitme testi</li>
          </ul>
          <h3>Aşılar</h3>
          <ul>
            <li>İnfluenza aşısı (yıllık)</li>
            <li>Eksik aşıların tamamlanması</li>
            <li>HPV aşısı hakkında bilgilendirme</li>
          </ul>
        `
      }
    ];
  }

  ngAfterViewInit(): void {
    // Build TOC from h2/h3 headings
    const root = this.contentRoot?.nativeElement;
    if (!root) return;
    const headings = Array.from(root.querySelectorAll('h2, h3')) as HTMLElement[];
    this.toc = headings.map(h => {
      let text = (h.textContent || '').trim();
      const level = h.tagName.toLowerCase() === 'h2' ? 2 : 3;
      let id = this.slugify(text);
      // ensure unique
      let base = id;
      let i = 2;
      while (this.tocIds.has(id) || document.getElementById(id)) {
        id = base + '-' + (i++);
      }
      this.tocIds.add(id);
      h.setAttribute('id', id);
      return { id, text, level };
    });
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9s-]/g, '')
      .trim()
      .replace(/s+/g, '-')
      .replace(/-+/g, '-');
  }
}
