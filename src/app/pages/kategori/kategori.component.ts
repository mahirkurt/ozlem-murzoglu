import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DocumentService, DocumentCategory, Document } from '../../services/document.service';

@Component({
  selector: 'app-kategori',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './kategori.component.html',
  styleUrls: ['./kategori.component.css']
})
export class KategoriComponent implements OnInit, OnDestroy {
  category: DocumentCategory | null = null;
  documents: Document[] = [];
  filteredDocuments: Document[] = [];
  relatedCategories: DocumentCategory[] = [];
  
  searchQuery: string = '';
  fileTypeFilter: string = 'all';
  sortBy: string = 'title';
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const categoryId = params.get('categoryId');
        if (categoryId) {
          this.loadCategory(categoryId);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCategory(categoryId: string): void {
    this.category = this.documentService.getCategoryById(categoryId) || null;
    
    if (this.category) {
      this.documents = this.category.documents;
      this.filteredDocuments = [...this.documents];
      this.loadRelatedCategories();
      this.applySorting();
    }
  }

  private loadRelatedCategories(): void {
    if (!this.category) return;
    
    const allCategories = this.documentService.getCategories();
    // Get 3 related categories (excluding current one)
    this.relatedCategories = allCategories
      .filter(cat => cat.id !== this.category!.id)
      .slice(0, 3);
  }

  onSearchChange(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery = query;
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  setFileTypeFilter(type: string): void {
    this.fileTypeFilter = type;
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.documents];
    
    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(query) ||
        doc.description?.toLowerCase().includes(query) ||
        doc.fileName.toLowerCase().includes(query)
      );
    }
    
    // Apply file type filter
    if (this.fileTypeFilter !== 'all') {
      filtered = filtered.filter(doc => doc.fileType === this.fileTypeFilter);
    }
    
    this.filteredDocuments = filtered;
    this.applySorting();
  }

  applySorting(): void {
    switch (this.sortBy) {
      case 'title':
        this.filteredDocuments.sort((a, b) => a.title.localeCompare(b.title, 'tr'));
        break;
      case 'title-desc':
        this.filteredDocuments.sort((a, b) => b.title.localeCompare(a.title, 'tr'));
        break;
      case 'type':
        this.filteredDocuments.sort((a, b) => {
          if (a.fileType === b.fileType) {
            return a.title.localeCompare(b.title, 'tr');
          }
          return a.fileType.localeCompare(b.fileType);
        });
        break;
    }
  }

  getFileTypes(): string[] {
    if (!this.documents) return [];
    
    const types = new Set(this.documents.map(doc => doc.fileType));
    return Array.from(types);
  }

  getDocumentsByType(type: string): Document[] {
    return this.documents.filter(doc => doc.fileType === type);
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.fileTypeFilter = 'all';
    this.sortBy = 'title';
    this.applyFilters();
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

  navigateToCategory(categoryId: string): void {
    this.router.navigate(['/kaynaklar', categoryId]);
  }

  trackByDocument(index: number, document: Document): string {
    return document.id;
  }
}