import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../../directives/reveal.directive';
import { LazyLoadDirective } from '../../directives/lazy-load.directive';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

interface GalleryImage {
  src: string;
  alt: string;
  title: string;
  titleKey: string;
  category: 'waiting' | 'consultation' | 'play' | 'reception';
}

@Component({
  selector: 'app-clinic-gallery',
  standalone: true,
  imports: [CommonModule, RevealDirective, LazyLoadDirective, TranslateModule],
  template: `
    <section class="clinic-gallery gradient-mesh noise-texture">
      <div class="container">
        <div class="gallery-header reveal" appReveal [revealAnimation]="'fade'">
          <h2 class="gallery-title">{{ 'CLINIC.GALLERY_TITLE' | translate }}</h2>
          <p class="gallery-subtitle">
            {{ 'CLINIC.GALLERY_SUBTITLE' | translate }}
          </p>
        </div>
        
        <div class="gallery-grid">
          <div *ngFor="let image of displayedImages; let i = index" 
               class="gallery-item glass-card"
               [class.featured]="i === 0"
               [attr.data-category]="image.category"
               (click)="openModal(image)"
               appReveal 
               [revealAnimation]="i % 2 === 0 ? 'slide-right' : 'slide-left'"
               [revealDelay]="i * 100">
            <div class="image-wrapper ken-burns-hover">
              <img 
                [src]="image.src" 
                [alt]="image.alt"
                [title]="image.title"
                appLazyLoad
                [appLazyLoad]="image.src"
                class="gallery-image"
                loading="lazy"
              />
              <div class="image-overlay">
                <span class="material-icons zoom-icon">zoom_in</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="gallery-features">
          <div class="feature-card neu-card" *ngFor="let feature of clinicFeatures; let i = index"
               appReveal [revealAnimation]="'scale'" [revealDelay]="i * 150">
            <div class="feature-icon">
              <span class="material-icons">{{ feature.icon }}</span>
            </div>
            <h3 class="feature-title">{{ feature.titleKey | translate }}</h3>
            <p class="feature-description">{{ feature.descriptionKey | translate }}</p>
          </div>
        </div>
        
        <div class="view-all-container" *ngIf="isMobile && galleryImages.length > displayLimit">
          <button class="view-all-btn" (click)="viewAllGallery()">
            <span>{{ 'CLINIC.VIEW_ALL_PHOTOS' | translate }}</span>
            <span class="material-icons">arrow_forward</span>
          </button>
        </div>
      </div>
      
      <!-- Modal -->
      <div class="modal-backdrop" *ngIf="selectedImage" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <button class="modal-control modal-close" (click)="closeModal()">
            <span class="material-icons">close</span>
          </button>

          <!-- Navigation Arrows -->
          <button class="modal-control modal-nav modal-prev" (click)="previousImage()" *ngIf="currentImageIndex > 0">
            <span class="material-icons">chevron_left</span>
          </button>
          <button class="modal-control modal-nav modal-next" (click)="nextImage()" *ngIf="currentImageIndex < galleryImages.length - 1">
            <span class="material-icons">chevron_right</span>
          </button>

          <!-- Image Container -->
          <div class="modal-image-container">
            <img [src]="selectedImage.src" [alt]="selectedImage.alt" class="modal-image" />
          </div>

          <!-- Caption and Counter -->
          <div class="modal-info">
            <div class="modal-caption">{{ selectedImage.titleKey | translate }}</div>
            <div class="modal-counter">{{ currentImageIndex + 1 }} / {{ galleryImages.length }}</div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrl: './clinic-gallery.scss'
})
export class ClinicGalleryComponent {
  selectedImage: GalleryImage | null = null;
  currentImageIndex: number = 0;
  isMobile = false;
  displayLimit = 6;
  
  constructor(private router: Router) {
    this.checkMobile();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.checkMobile());
    }
  }
  
  checkMobile() {
    if (typeof window !== 'undefined') {
      this.isMobile = window.innerWidth <= 768;
      this.displayLimit = this.isMobile ? 4 : 6;
    }
  }
  
  get displayedImages() {
    return this.isMobile ? this.galleryImages.slice(0, this.displayLimit) : this.galleryImages;
  }
  
  viewAllGallery() {
    this.router.navigate(['/galeri']);
  }
  
  galleryImages: GalleryImage[] = [
    {
      src: '/images/20230416_174226~2.jpg',
      alt: 'Modern klinik resepsiyon alanı',
      title: 'Karşılama Alanımız',
      titleKey: 'CLINIC.RECEPTION_AREA',
      category: 'reception'
    },
    {
      src: '/images/20230416_174146~2.jpg',
      alt: 'Çocuk dostu bekleme salonu',
      title: 'Bekleme Salonumuz',
      titleKey: 'CLINIC.WAITING_ROOM',
      category: 'waiting'
    },
    {
      src: '/images/20230416_175158~2.jpg',
      alt: 'Özel tasarım oyun ve okuma köşesi',
      title: 'Oyun Köşemiz',
      titleKey: 'CLINIC.PLAY_CORNER',
      category: 'play'
    },
    {
      src: '/images/20230416_174740~2.jpg',
      alt: 'Profesyonel muayene odası',
      title: 'Muayene Odamız',
      titleKey: 'CLINIC.EXAMINATION_ROOM',
      category: 'consultation'
    },
    {
      src: '/images/20230416_174537~2.jpg',
      alt: 'Konforlu danışma odası',
      title: 'Danışma Alanı',
      titleKey: 'CLINIC.CONSULTATION_AREA',
      category: 'consultation'
    },
    {
      src: '/images/20230416_174704~2.jpg',
      alt: 'Çocuk dostu muayene masası',
      title: 'Muayene Alanı',
      titleKey: 'CLINIC.EXAMINATION_AREA',
      category: 'consultation'
    },
    {
      src: '/images/20230416_175137~2.jpg',
      alt: 'Aile danışmanlığı ve oyun alanı',
      title: 'Aile Danışma Köşesi',
      titleKey: 'CLINIC.FAMILY_CONSULTATION',
      category: 'play'
    },
    {
      src: '/images/20230416_174343~2.jpg',
      alt: 'Modern ve hijyenik klinik ortamı',
      title: 'Klinik Alanlarımız',
      titleKey: 'CLINIC.CLINIC_AREAS',
      category: 'waiting'
    },
    {
      src: '/images/20230416_174550~2.jpg',
      alt: 'Klinik iç mekan görünümü',
      title: 'Klinik İç Mekan',
      titleKey: 'CLINIC.INTERIOR_VIEW',
      category: 'reception'
    }
  ];
  
  clinicFeatures = [
    {
      icon: 'sanitizer',
      titleKey: 'CLINIC.FEATURE_HYGIENE',
      descriptionKey: 'CLINIC.FEATURE_HYGIENE_DESC'
    },
    {
      icon: 'child_care',
      titleKey: 'CLINIC.FEATURE_CHILD_FRIENDLY',
      descriptionKey: 'CLINIC.FEATURE_CHILD_FRIENDLY_DESC'
    },
    {
      icon: 'accessible',
      titleKey: 'CLINIC.FEATURE_ACCESS',
      descriptionKey: 'CLINIC.FEATURE_ACCESS_DESC'
    }
  ];
  
  openModal(image: GalleryImage) {
    this.selectedImage = image;
    this.currentImageIndex = this.galleryImages.indexOf(image);
    document.body.style.overflow = 'hidden';

    // Add keyboard navigation
    if (typeof window !== 'undefined') {
      this.handleKeyboard = this.handleKeyboard.bind(this);
      window.addEventListener('keydown', this.handleKeyboard);
    }
  }

  closeModal() {
    this.selectedImage = null;
    document.body.style.overflow = '';

    // Remove keyboard navigation
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyboard);
    }
  }

  nextImage() {
    if (this.currentImageIndex < this.galleryImages.length - 1) {
      this.currentImageIndex++;
      this.selectedImage = this.galleryImages[this.currentImageIndex];
    }
  }

  previousImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.selectedImage = this.galleryImages[this.currentImageIndex];
    }
  }

  private handleKeyboard(event: KeyboardEvent) {
    switch(event.key) {
      case 'ArrowRight':
        this.nextImage();
        break;
      case 'ArrowLeft':
        this.previousImage();
        break;
      case 'Escape':
        this.closeModal();
        break;
    }
  }
}