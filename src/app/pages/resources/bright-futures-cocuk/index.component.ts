import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RESOURCES_INDEX, ResourceLink } from '../resources-index';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-bright-futures-cocuk',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="category-page">
      <div class="category-header">
        <div class="container">
          <nav class="breadcrumb">
            <a routerLink="/kaynaklar">Kaynaklar</a>
            <span> / </span>
            <span>Bright Futures (Çocuk)</span>
          </nav>
          <h1>Bright Futures (Çocuk)</h1>
          <p>Çocuklar ve ergenler için hazırlanmış eğitici ve bilgilendirici kaynaklar</p>
          <div class="stats">
            <div class="stat-item">
              <span class="stat-number">{{ docs.length }}</span>
              <span class="stat-label">Döküman</span>
            </div>
          </div>
        </div>
      </div>
      <div class="category-content">
        <div class="container">
          <div class="doc-grid">
            <a *ngFor="let doc of docs" class="doc-card" [routerLink]="doc.path">
              <div class="doc-card-header">
                <div class="doc-icon-wrapper">
                  <span class="material-icons">child_care</span>
                </div>
                <div class="doc-meta">
                  <div class="doc-category">Bright Futures (Çocuk)</div>
                  <div class="doc-type">Çocuk Rehberi</div>
                </div>
              </div>
              <div class="doc-card-body">
                <h3 class="doc-title">{{ doc.title }}</h3>
                <p class="doc-description">Çocuklar için yaşa uygun sağlık ve gelişim bilgileri</p>
              </div>
              <div class="doc-card-footer">
                <div class="doc-action">
                  <span>Görüntüle</span>
                  <span class="material-icons">arrow_forward</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../shared-styles.css']
})
export class BrightFuturesCocukCategoryComponent implements OnInit {
  docs: ResourceLink[] = RESOURCES_INDEX['bright-futures-cocuk'] || [];
  
  constructor(private title: Title, private meta: Meta) {}
  
  ngOnInit(): void {
    const pageTitle = 'Bright Futures (Çocuk) | Kaynaklar | Özlem Murzoğlu';
    const description = 'Çocuklar ve ergenler için hazırlanmış eğitici kaynaklar. Ergenlik dönemi, sağlık alışkanlıkları ve yaşa uygun bilgiler.';
    
    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'keywords', content: 'Bright Futures, çocuk rehberi, ergenlik, okul çağı, gelişim' });
  }
}
