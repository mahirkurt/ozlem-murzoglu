import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RESOURCES_INDEX, ResourceLink } from '../resources-index';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-gelisim-rehberleri',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="category-page">
      <div class="category-header">
        <div class="container">
          <nav class="breadcrumb">
            <a routerLink="/kaynaklar">Kaynaklar</a>
            <span> / </span>
            <span>Gelişim Rehberleri</span>
          </nav>
          <h1>Gelişim Rehberleri</h1>
          <p>Çocuk gelişiminin farklı dönemlerine yönelik gelişimsel ipucları ve etkinlik önerileri</p>
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
                  <span class="material-icons">psychology</span>
                </div>
                <div class="doc-meta">
                  <div class="doc-category">Gelişim Rehberleri</div>
                  <div class="doc-type">Gelişim Rehberi</div>
                </div>
              </div>
              <div class="doc-card-body">
                <h3 class="doc-title">{{ doc.title }}</h3>
                <p class="doc-description">Yaşa uygun gelişimsel aşamalar ve etkinlik önerileri</p>
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
export class GelisimRehberleriCategoryComponent implements OnInit {
  docs: ResourceLink[] = RESOURCES_INDEX['gelisim-rehberleri'] || [];
  
  constructor(private title: Title, private meta: Meta) {}
  
  ngOnInit(): void {
    const pageTitle = 'Gelişim Rehberleri | Kaynaklar | Özlem Murzoğlu';
    const description = 'Çocuk gelişiminin farklı dönemlerine yönelik gelişimsel ipucları ve etkinlik önerileri. Gelişim basamakları ve yaşa uygun etkinlikler.';
    
    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'keywords', content: 'çocuk gelişimi, gelişim basamakları, etkinlik önerileri, yaş dönemleri' });
  }
}
