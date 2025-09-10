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
      <div class="container md3-container">
        <div class="gallery-header reveal" appReveal [revealAnimation]="'fade'">
          <h2 class="gallery-title">{{ 'CLINIC.GALLERY_TITLE' | translate }}</h2>
          <p class="gallery-subtitle">
            {{ 'CLINIC.GALLERY_SUBTITLE' | translate }}
          </p>
        </div>

        <div class="gallery-grid">
          <div
            *ngFor="let image of displayedImages; let i = index"
            class="gallery-item glass-card"
            [class.featured]="i === 0"
            [attr.data-category]="image.category"
            (click)="openModal(image)"
            appReveal
            [revealAnimation]="i % 2 === 0 ? 'slide-right' : 'slide-left'"
            [revealDelay]="i * 100"
          >
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
          <div
            class="feature-card neu-card"
            *ngFor="let feature of clinicFeatures; let i = index"
            appReveal
            [revealAnimation]="'scale'"
            [revealDelay]="i * 150"
          >
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
          <button class="modal-close" (click)="closeModal()">
            <span class="material-icons">close</span>
          </button>
          <img [src]="selectedImage.src" [alt]="selectedImage.alt" class="modal-image" />
          <div class="modal-caption">{{ selectedImage.titleKey | translate }}</div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .clinic-gallery {
        padding: 60px 0;
        position: relative;
        background: #ffffff;
      }

      .gallery-header {
        text-align: center;
        margin-bottom: var(--space-7);
      }

      .gallery-title {
        font-size: 2.25rem;
        color: var(--color-primary);
        margin-bottom: var(--space-3);
        position: relative;
        display: inline-block;
        font-weight: 700;
      }

      .gallery-subtitle {
        font-size: var(--font-size-lg);
        color: var(--color-neutral-600);
        max-width: 700px;
        margin: 0 auto;
        line-height: var(--line-height-relaxed);
      }

      .gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 12px;
        margin-bottom: var(--space-7);
      }

      @media (min-width: 768px) {
        .gallery-grid {
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .gallery-item.featured {
          grid-column: span 2;
          grid-row: span 2;
        }
      }

      @media (min-width: 1200px) {
        .gallery-grid {
          grid-template-columns: repeat(6, 1fr);
          gap: 20px;
        }
      }

      .gallery-item {
        position: relative;
        overflow: hidden;
        border-radius: 12px;
        transition: all 0.3s var(--ease-in-out);
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .gallery-item:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: var(--shadow-xl);
      }

      .image-wrapper {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 100%; /* 1:1 aspect ratio for square tiles */
        overflow: hidden;
      }

      .gallery-item.featured .image-wrapper {
        padding-bottom: 100%; /* Keep square even for featured */
      }

      .gallery-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 10s var(--ease-in-out);
      }

      .ken-burns-hover:hover .gallery-image {
        transform: scale(1.15) rotate(1deg);
      }

      .image-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba(0, 95, 115, 0.7) 0%, rgba(0, 95, 115, 0.3) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s var(--ease-in-out);
      }

      .gallery-item:hover .image-overlay {
        opacity: 1;
      }

      .zoom-icon {
        color: white;
        font-size: 48px;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
      }

      .gallery-features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--space-3);
        width: 100%;
        margin: 0;
      }
      
      @media (max-width: 480px) {
        .gallery-features {
          grid-template-columns: 1fr;
        }
      }

      .feature-card {
        padding: var(--space-4);
        text-align: center;
        transition: all 0.3s var(--ease-in-out);
      }

      .feature-card:hover {
        transform: translateY(-4px);
      }

      .feature-icon {
        width: 48px;
        height: 48px;
        margin: 0 auto var(--space-2);
        background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
        box-shadow: var(--shadow-md);
      }

      .feature-title {
        font-size: var(--font-size-lg);
        color: var(--color-primary);
        margin-bottom: var(--space-1);
      }

      .feature-description {
        font-size: var(--font-size-base);
        color: var(--color-neutral-600);
        line-height: var(--line-height-relaxed);
      }

      /* Modal Styles */
      .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
        cursor: zoom-out;
      }

      .modal-content {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        animation: zoomIn 0.3s ease;
        cursor: default;
      }

      .modal-image {
        width: 100%;
        height: auto;
        max-width: 100%;
        max-height: 80vh;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      }

      .modal-caption {
        text-align: center;
        color: white;
        font-size: var(--font-size-lg);
        margin-top: var(--space-3);
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      }

      .modal-close {
        position: absolute;
        top: -40px;
        right: 0;
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.3);
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      }

      .modal-close:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: rotate(90deg);
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes zoomIn {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      @media (max-width: 768px) {
        .modal-close {
          top: 10px;
          right: 10px;
        }

        .modal-caption {
          font-size: var(--font-size-base);
        }

        .gallery-grid {
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .gallery-item.featured {
          grid-column: span 2;
          grid-row: span 2;
        }
      }

      .view-all-container {
        text-align: center;
        margin-top: var(--space-5);
      }

      .view-all-btn {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        padding: 14px 28px;
        background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
        color: white;
        border: none;
        border-radius: 30px;
        font-size: var(--font-size-lg);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 95, 115, 0.2);
      }

      .view-all-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 95, 115, 0.3);
      }

      .view-all-btn .material-icons {
        transition: transform 0.3s ease;
      }

      .view-all-btn:hover .material-icons {
        transform: translateX(4px);
      }
    `,
  ],
})
export class ClinicGalleryComponent {
  selectedImage: GalleryImage | null = null;
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
    this.router.navigate(['/hakkimizda']);
  }

  galleryImages: GalleryImage[] = [
    {
      src: '/images/20230416_174226~2.jpg',
      alt: 'Modern klinik resepsiyon alanı',
      title: 'Karşılama Alanımız',
      titleKey: 'CLINIC.RECEPTION_AREA',
      category: 'reception',
    },
    {
      src: '/images/20230416_174146~2.jpg',
      alt: 'Çocuk dostu bekleme salonu',
      title: 'Bekleme Salonumuz',
      titleKey: 'CLINIC.WAITING_ROOM',
      category: 'waiting',
    },
    {
      src: '/images/20230416_175158~2.jpg',
      alt: 'Özel tasarım oyun ve okuma köşesi',
      title: 'Oyun Köşemiz',
      titleKey: 'CLINIC.PLAY_CORNER',
      category: 'play',
    },
    {
      src: '/images/20230416_174740~2.jpg',
      alt: 'Profesyonel muayene odası',
      title: 'Muayene Odamız',
      titleKey: 'CLINIC.EXAMINATION_ROOM',
      category: 'consultation',
    },
    {
      src: '/images/20230416_174537~2.jpg',
      alt: 'Konforlu danışma odası',
      title: 'Danışma Alanı',
      titleKey: 'CLINIC.CONSULTATION_AREA',
      category: 'consultation',
    },
    {
      src: '/images/20230416_174704~2.jpg',
      alt: 'Çocuk dostu muayene masası',
      title: 'Muayene Alanı',
      titleKey: 'CLINIC.EXAMINATION_AREA',
      category: 'consultation',
    },
    {
      src: '/images/20230416_175137~2.jpg',
      alt: 'Aile danışmanlığı ve oyun alanı',
      title: 'Aile Danışma Köşesi',
      titleKey: 'CLINIC.FAMILY_CONSULTATION',
      category: 'play',
    },
    {
      src: '/images/20230416_174343~2.jpg',
      alt: 'Modern ve hijyenik klinik ortamı',
      title: 'Klinik Alanlarımız',
      titleKey: 'CLINIC.CLINIC_AREAS',
      category: 'waiting',
    },
    {
      src: '/images/20230416_174550~2.jpg',
      alt: 'Klinik iç mekan görünümü',
      title: 'Klinik İç Mekan',
      titleKey: 'CLINIC.INTERIOR_VIEW',
      category: 'reception',
    },
  ];

  clinicFeatures = [
    {
      icon: 'sanitizer',
      titleKey: 'CLINIC.FEATURE_HYGIENE',
      descriptionKey: 'CLINIC.FEATURE_HYGIENE_DESC',
    },
    {
      icon: 'child_care',
      titleKey: 'CLINIC.FEATURE_CHILD_FRIENDLY',
      descriptionKey: 'CLINIC.FEATURE_CHILD_FRIENDLY_DESC',
    },
    {
      icon: 'accessible',
      titleKey: 'CLINIC.FEATURE_ACCESS',
      descriptionKey: 'CLINIC.FEATURE_ACCESS_DESC',
    },
  ];

  openModal(image: GalleryImage) {
    this.selectedImage = image;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.selectedImage = null;
    document.body.style.overflow = '';
  }
}
