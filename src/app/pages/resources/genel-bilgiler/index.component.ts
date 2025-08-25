import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RESOURCES_INDEX, ResourceLink } from '../resources-index';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-genel-bilgiler',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="category-page">
      <div class="category-header">
        <div class="container">
          <nav class="breadcrumb">
            <a routerLink="/kaynaklar">Kaynaklar</a>
            <span> / </span>
            <span>Genel Bilgiler</span>
          </nav>
          <h1>Genel Bilgiler</h1>
          <p>Çocuk sağlığı ve gelişimi ile ilgili genel konular hakkında bilgilendirici kaynaklar</p>
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
                  <span class="material-icons">description</span>
                </div>
                <div class="doc-meta">
                  <div class="doc-category">Genel Bilgiler</div>
                  <div class="doc-type">Bilgi Dökümanı</div>
                </div>
              </div>
              <div class="doc-card-body">
                <h3 class="doc-title">{{ doc.title }}</h3>
                <p class="doc-description">Çocuk sağlığı ve gelişimi konularında bilgilendirici kaynak</p>
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
export class GenelBilgilerCategoryComponent implements OnInit {
  docs: ResourceLink[] = RESOURCES_INDEX['genel-bilgiler'] || [];
  
  constructor(private title: Title, private meta: Meta) {}
  
  ngOnInit(): void {
    const pageTitle = 'Genel Bilgiler | Kaynaklar | Özlem Murzoğlu';
    const description = 'Çocuk sağlığı ve gelişimi ile ilgili genel konular hakkında bilgilendirici kaynaklar. Emzirme, beslenme, güvenlik ve daha fazlası.';
    
    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'keywords', content: 'çocuk sağlığı, emzirme, beslenme, güvenlik, gelişim' });
  }
}
