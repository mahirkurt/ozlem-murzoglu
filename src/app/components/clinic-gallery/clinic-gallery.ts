import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../../directives/reveal.directive';
import { LazyLoadDirective } from '../../directives/lazy-load.directive';

interface GalleryImage {
  src: string;
  alt: string;
  title: string;
  category: 'waiting' | 'consultation' | 'play' | 'reception';
}

@Component({
  selector: 'app-clinic-gallery',
  standalone: true,
  imports: [CommonModule, RevealDirective, LazyLoadDirective],
  template: `
    <section class="clinic-gallery gradient-mesh noise-texture">
      <div class="container">
        <div class="gallery-header reveal" appReveal [revealAnimation]="'fade'">
          <h2 class="gallery-title">Kliniğimiz</h2>
          <p class="gallery-subtitle">
            Modern, hijyenik ve çocuk dostu ortamımızda, küçük hastalarımızın kendilerini güvende ve mutlu hissetmeleri için tasarlanmış alanlarımız
          </p>
        </div>
        
        <div class="gallery-grid">
          <div *ngFor="let image of galleryImages; let i = index" 
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
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
      
      <!-- Modal -->
      <div class="modal-backdrop" *ngIf="selectedImage" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <button class="modal-close" (click)="closeModal()">
            <span class="material-icons">close</span>
          </button>
          <img [src]="selectedImage.src" [alt]="selectedImage.alt" class="modal-image" />
          <div class="modal-caption">{{ selectedImage.title }}</div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .clinic-gallery {
      padding: 60px 0;
      position: relative;
      background: var(--color-neutral-50);
    }
    
    .gallery-header {
      text-align: center;
      margin-bottom: var(--space-7);
    }
    
    .gallery-title {
      font-size: var(--font-size-4xl);
      color: var(--color-primary);
      margin-bottom: var(--space-3);
      position: relative;
      display: inline-block;
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
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--space-4);
      margin-bottom: var(--space-7);
    }
    
    @media (min-width: 768px) {
      .gallery-grid {
        grid-template-columns: repeat(4, 1fr);
      }
      
      .gallery-item.featured {
        grid-column: span 2;
        grid-row: span 2;
      }
    }
    
    @media (min-width: 1200px) {
      .gallery-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
    
    .gallery-item {
      position: relative;
      overflow: hidden;
      border-radius: 20px;
      transition: all 0.3s var(--ease-in-out);
      cursor: pointer;
    }
    
    .gallery-item:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: var(--shadow-xl);
    }
    
    .image-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 250px;
      overflow: hidden;
    }
    
    .gallery-item.featured .image-wrapper {
      min-height: 520px;
    }
    
    .gallery-image {
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
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    
    .gallery-features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-3);
      max-width: 800px;
      margin: 0 auto;
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
      from { opacity: 0; }
      to { opacity: 1; }
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
    }
  `]
})
export class ClinicGalleryComponent {
  selectedImage: GalleryImage | null = null;
  
  galleryImages: GalleryImage[] = [
    {
      src: '/images/20230416_174226~2.jpg',
      alt: 'Modern klinik resepsiyon alanı',
      title: 'Karşılama Alanımız',
      category: 'reception'
    },
    {
      src: '/images/20230416_174146~2.jpg',
      alt: 'Çocuk dostu bekleme salonu',
      title: 'Bekleme Salonumuz',
      category: 'waiting'
    },
    {
      src: '/images/20230416_175158~2.jpg',
      alt: 'Özel tasarım oyun ve okuma köşesi',
      title: 'Oyun Köşemiz',
      category: 'play'
    },
    {
      src: '/images/20230416_174740~2.jpg',
      alt: 'Profesyonel muayene odası',
      title: 'Muayene Odamız',
      category: 'consultation'
    },
    {
      src: '/images/20230416_174537~2.jpg',
      alt: 'Konforlu danışma odası',
      title: 'Danışma Alanı',
      category: 'consultation'
    },
    {
      src: '/images/20230416_174704~2.jpg',
      alt: 'Çocuk dostu muayene masası',
      title: 'Muayene Alanı',
      category: 'consultation'
    },
    {
      src: '/images/20230416_175137~2.jpg',
      alt: 'Aile danışmanlığı ve oyun alanı',
      title: 'Aile Danışma Köşesi',
      category: 'play'
    },
    {
      src: '/images/20230416_174343~2.jpg',
      alt: 'Modern ve hijyenik klinik ortamı',
      title: 'Klinik Alanlarımız',
      category: 'waiting'
    }
  ];
  
  clinicFeatures = [
    {
      icon: 'sanitizer',
      title: 'Hijyenik Ortam',
      description: 'En yüksek hijyen standartlarında, steril ve güvenli muayene ortamı'
    },
    {
      icon: 'child_care',
      title: 'Çocuk Dostu Tasarım',
      description: 'Çocukların kendilerini rahat hissedeceği renkli ve eğlenceli alanlar'
    },
    {
      icon: 'accessible',
      title: 'Engelsiz Erişim',
      description: 'Bebek arabası ve tekerlekli sandalye erişimine uygun düzenleme'
    }
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