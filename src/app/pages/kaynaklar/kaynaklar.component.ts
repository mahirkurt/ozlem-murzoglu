import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentService, DocumentCategory, Document } from '../../services/document.service';
import { HeroSectionComponent } from '../../components/shared/hero-section/hero-section.component';
import { TranslateModule } from '@ngx-translate/core';
import { trigger, transition, style, animate, stagger, query, state } from '@angular/animations';

// Animasyon tanımlamaları
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
    animate('400ms {{delay}}ms cubic-bezier(0.05, 0.7, 0.1, 1.0)', 
      style({ opacity: 1, transform: 'translateY(0)' })
    )
  ], { params: { delay: 0 } })
]);

const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('600ms ease-in', style({ opacity: 1 }))
  ])
]);

// Bölüm veri yapısı
interface Section {
  title: string;
  subtitle?: string;
  description?: string;
  icon: string;
  isAccent?: boolean;
  categories?: DocumentCategory[];
  panels?: Panel[];
}

interface Panel {
  title: string;
  description: string;
  icon: string;
  content: string;
  categoryId?: string;
  expanded?: boolean;
}

@Component({
  selector: 'app-kaynaklar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeroSectionComponent,
    TranslateModule
  ],
  templateUrl: './kaynaklar.component.html',
  styleUrls: ['./kaynaklar.component.css'],
  animations: [listAnimation, cardAnimation, fadeIn]
})
export class KaynaklarComponent implements OnInit {
  categories: DocumentCategory[] = [];
  searchQuery: string = '';
  searchResults: Document[] = [];
  popularDocuments: Document[] = [];
  showSearch: boolean = true;
  sections: Section[] = [];

  breadcrumbs = [
    { label: 'HEADER.NAV_HOME', link: '/' },
    { label: 'HEADER.NAV_INFO_CENTER' }
  ];

  constructor(
    private documentService: DocumentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadPopularDocuments();
    this.initializeSections();
  }

  private initializeSections(): void {
    // Kategorileri gruplara ayır
    const brightFuturesAile = this.categories.filter(c => c.id.includes('bright-futures-aile'));
    const brightFuturesCocuk = this.categories.filter(c => c.id.includes('bright-futures-cocuk'));
    const gelisimRehberleri = this.categories.filter(c => c.id.includes('gelisim'));
    const genelBilgiler = this.categories.filter(c => c.id === 'genel-bilgiler');
    const asilar = this.categories.filter(c => c.id === 'asilar');
    const hastaliklar = this.categories.filter(c => c.id === 'hastaliklar');
    const digerler = this.categories.filter(c => 
      !c.id.includes('bright-futures') && 
      !c.id.includes('gelisim') &&
      c.id !== 'genel-bilgiler' &&
      c.id !== 'asilar' &&
      c.id !== 'hastaliklar'
    );

    this.sections = [
      {
        title: 'Bright Futures - Aile Rehberleri',
        subtitle: 'Her yaş için özel hazırlanmış aile bilgilendirme rehberleri',
        description: 'Amerikan Pediatri Akademisi tarafından hazırlanan, çocuğunuzun her gelişim döneminde size yol gösterecek kapsamlı rehberler.',
        icon: 'family_restroom',
        isAccent: true,
        categories: brightFuturesAile
      },
      {
        title: 'Gelişimsel Kilometre Taşları',
        subtitle: 'Çocuğunuzun gelişimini takip edin',
        description: 'Her ay ve yaş için gelişimsel basamaklar, öneriler ve aktiviteler.',
        icon: 'psychology',
        categories: gelisimRehberleri
      },
      {
        title: 'Sağlık ve Hastalıklar',
        subtitle: 'Koruyucu sağlık ve hastalık yönetimi',
        icon: 'local_hospital',
        panels: [
          {
            title: 'Aşılar ve Bağışıklama',
            description: 'Aşı takvimi ve bilgilendirme föyleri',
            icon: 'medical_services',
            content: `
              <ul>
                <li>HPV, KKK, KKKA aşı bilgi föyleri</li>
                <li>Meningokok ve influenza aşıları</li>
                <li>Rotavirüs aşısı hakkında bilgiler</li>
                <li>Güncel aşı takvimi ve öneriler</li>
              </ul>
            `,
            categoryId: 'asilar'
          },
          {
            title: 'Sık Görülen Hastalıklar',
            description: 'Tanı, tedavi ve korunma yöntemleri',
            icon: 'sick',
            content: `
              <ul>
                <li>Ateş yönetimi ve müdahale</li>
                <li>Orta kulak iltihabı</li>
                <li>Astım ve alerji yönetimi</li>
                <li>Egzama ve cilt sorunları</li>
              </ul>
            `,
            categoryId: 'hastaliklar'
          },
          {
            title: 'Genel Sağlık Bilgileri',
            description: 'Koruyucu sağlık ve güvenlik',
            icon: 'health_and_safety',
            content: `
              <ul>
                <li>Güvenli uyku pratikleri</li>
                <li>Emzirme rehberleri</li>
                <li>Beslenme ve diş sağlığı</li>
                <li>Ev ve oyuncak güvenliği</li>
              </ul>
            `,
            categoryId: 'genel-bilgiler'
          }
        ]
      },
      {
        title: 'Bright Futures - Çocuk ve Ergen',
        subtitle: 'Çocuğunuza özel hazırlanmış bilgilendirme materyalleri',
        description: 'Çocukların ve ergenlerin anlayabileceği dilde hazırlanmış sağlık ve gelişim bilgileri.',
        icon: 'child_care',
        categories: brightFuturesCocuk
      },
      {
        title: 'Özel Konular ve Rehberler',
        subtitle: 'Medya kullanımı, büyüme eğrileri ve daha fazlası',
        icon: 'menu_book',
        categories: digerler
      }
    ];
  }

  private loadCategories(): void {
    this.categories = this.documentService.getCategories();
  }

  private loadPopularDocuments(): void {
    const popularIds = [
      'guvenli-uyku',
      'bebeginizi-emzirmek',
      'tuvalet-egitimi',
      'cocuklarda-ates',
      'bf-aile-1ay',
      'asilar-genel',
      'gelisim-basamaklari-6ay',
      'oyuncak-guvenligi'
    ];

    this.popularDocuments = popularIds
      .map(id => this.documentService.getDocumentById(id))
      .filter(doc => doc !== undefined) as Document[];
  }

  onSearchChange(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery = query;
    
    if (query.trim().length > 0) {
      this.searchResults = this.documentService.searchDocuments(query.trim());
    } else {
      this.searchResults = [];
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
  }

  navigateToCategory(categoryId: string): void {
    this.router.navigate(['/kaynaklar', categoryId]);
  }

  viewDocument(document: Document): void {
    this.router.navigate(['/kaynaklar', 'dokuman', document.id]);
  }

  downloadDocument(document: Document): void {
    if (typeof window !== 'undefined') {
      const link = window.document.createElement('a');
      link.href = this.documentService.getDownloadUrl(document);
      link.download = document.fileName;
      link.target = '_blank';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    }
  }

  getCategoryTitle(categoryId: string): string {
    const category = this.documentService.getCategoryById(categoryId);
    return category ? category.title : '';
  }

  getQuickAccessIcon(categoryId: string): string {
    const iconMap: Record<string, string> = {
      'genel-bilgiler': 'info',
      'asilar': 'medical_services',
      'bright-futures-aile': 'family_restroom',
      'hastaliklar': 'local_hospital',
      'gelisim-rehberleri': 'psychology',
      'gebelik-donemi': 'pregnant_woman',
      'oyuncaklar': 'toys',
      'aile-medya-plani': 'devices',
      'cdc-buyume-egrileri': 'trending_up',
      'bright-futures-cocuk': 'child_care',
      'who-buyume-egrileri': 'show_chart'
    };
    
    return iconMap[categoryId] || 'description';
  }

  getDocumentIcon(doc: Document): string {
    if (doc.fileType === 'pdf') return 'picture_as_pdf';
    if (doc.categoryId.includes('video')) return 'play_circle';
    if (doc.categoryId.includes('form')) return 'assignment';
    return 'description';
  }

  getTotalDocumentCount(): number {
    return this.documentService.getTotalDocumentCount();
  }

  trackByCategory(index: number, category: DocumentCategory): string {
    return category.id;
  }
}