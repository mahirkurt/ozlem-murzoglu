import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentService, DocumentCategory, Document } from '../../services/document.service';

@Component({
  selector: 'app-kaynaklar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kaynaklar.component.html',
  styleUrls: ['./kaynaklar.component.css']
})
export class KaynaklarComponent implements OnInit {
  categories: DocumentCategory[] = [];
  searchQuery: string = '';
  searchResults: Document[] = [];
  popularDocuments: Document[] = [];

  constructor(
    private documentService: DocumentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadPopularDocuments();
  }

  private loadCategories(): void {
    this.categories = this.documentService.getCategories();
  }

  private loadPopularDocuments(): void {
    // Select some popular documents from different categories
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

    this.popularDocuments = [
      this.documentService.getDocumentById('guvenli-uyku'),
      this.documentService.getDocumentById('bebeginizi-emzirmek'),
      this.documentService.getDocumentById('tuvalet-egitimi'),
      this.documentService.getDocumentById('cocuklarda-ates'),
      this.documentService.getDocumentById('bf-aile-1ay'),
      this.documentService.getDocumentById('hpv-asisi'),
      this.documentService.getDocumentById('gelisim-basamaklari-6ay-yeni'),
      this.documentService.getDocumentById('oyuncak-guvenligi')
    ].filter(doc => doc !== undefined) as Document[];
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

  getTotalDocumentCount(): number {
    return this.documentService.getTotalDocumentCount();
  }

  trackByCategory(index: number, category: DocumentCategory): string {
    return category.id;
  }
}