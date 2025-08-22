import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DocumentService, Document, DocumentCategory } from '../../services/document.service';

@Component({
  selector: 'app-dokuman-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dokuman-viewer.component.html',
  styleUrls: ['./dokuman-viewer.component.css']
})
export class DokumanViewerComponent implements OnInit, OnDestroy {
  @ViewChild('pdfContainer') pdfContainer!: ElementRef;
  
  document: Document | null = null;
  category: DocumentCategory | null = null;
  relatedDocuments: Document[] = [];
  error: string | null = null;
  
  zoomLevel: number = 1;
  isFullscreen: boolean = false;
  canShare: boolean = false;
  
  Math = Math; // Expose Math to template
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Check if Web Share API is supported
    if (typeof navigator !== 'undefined') {
      this.canShare = 'share' in navigator;
    }
    
    // Listen for fullscreen changes
    if (typeof document !== 'undefined') {
      document.addEventListener('fullscreenchange', this.onFullscreenChange.bind(this));
    }
    
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const documentId = params.get('documentId');
        if (documentId) {
          this.loadDocument(documentId);
        }
      });
  }

  ngOnDestroy(): void {
    if (typeof document !== 'undefined') {
      document.removeEventListener('fullscreenchange', this.onFullscreenChange.bind(this));
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDocument(documentId: string): void {
    this.document = this.documentService.getDocumentById(documentId) || null;
    
    if (this.document) {
      this.category = this.documentService.getCategoryById(this.document.category) || null;
      this.loadRelatedDocuments();
      this.error = null;
    } else {
      this.error = 'Aradığınız dokuman bulunamadı veya kaldırılmış olabilir.';
    }
  }

  private loadRelatedDocuments(): void {
    if (!this.document || !this.category) return;
    
    // Get other documents from the same category
    this.relatedDocuments = this.category.documents
      .filter(doc => doc.id !== this.document!.id)
      .slice(0, 5); // Limit to 5 related documents
  }

  getCategoryTitle(): string {
    return this.category ? this.category.title : '';
  }

  getSafeDocumentUrl(): SafeResourceUrl {
    if (!this.document) return '';
    
    const url = this.documentService.getDownloadUrl(this.document);
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  downloadDocument(): void {
    if (!this.document || typeof window === 'undefined') return;
    
    const link = window.document.createElement('a');
    link.href = this.documentService.getDownloadUrl(this.document);
    link.download = this.document.fileName;
    link.target = '_blank';
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  }

  shareDocument(): void {
    if (!this.document || !this.canShare) return;
    
    const shareData = {
      title: this.document.title,
      text: this.document.description || this.document.title,
      url: window.location.href
    };
    
    navigator.share(shareData).catch(err => {
      console.log('Error sharing:', err);
      // Fallback to copying URL to clipboard
      this.copyToClipboard();
    });
  }

  private copyToClipboard(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      // Could show a toast notification here
      console.log('URL copied to clipboard');
    });
  }

  printDocument(): void {
    if (!this.document) return;
    
    if (this.document.fileType === 'pdf') {
      // For PDFs, open in new window for printing
      const printWindow = window.open(this.documentService.getDownloadUrl(this.document), '_blank');
      if (printWindow) {
        printWindow.addEventListener('load', () => {
          printWindow.print();
        });
      }
    } else {
      // For other file types, just download
      this.downloadDocument();
    }
  }

  zoomIn(): void {
    if (this.zoomLevel < 2) {
      this.zoomLevel += 0.1;
    }
  }

  zoomOut(): void {
    if (this.zoomLevel > 0.5) {
      this.zoomLevel -= 0.1;
    }
  }

  resetZoom(): void {
    this.zoomLevel = 1;
  }

  toggleFullscreen(): void {
    if (!this.pdfContainer) return;
    
    if (!this.isFullscreen) {
      if (this.pdfContainer.nativeElement.requestFullscreen) {
        this.pdfContainer.nativeElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  private onFullscreenChange(): void {
    this.isFullscreen = !!document.fullscreenElement;
  }

  navigateToDocument(documentId: string): void {
    this.router.navigate(['/kaynaklar', 'dokuman', documentId]);
  }

  goBackToCategory(): void {
    if (this.document) {
      this.router.navigate(['/kaynaklar', this.document.category]);
    } else {
      this.router.navigate(['/kaynaklar']);
    }
  }
}