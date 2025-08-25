import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RESOURCES_INDEX, ResourceLink } from '../resources-index';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-cdc-buyume-egrileri',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="category-page">
      <div class="category-header">
        <div class="container">
          <nav class="breadcrumb">
            <a routerLink="/kaynaklar">Kaynaklar</a>
            <span> / </span>
            <span>CDC Büyüme Eğrileri</span>
          </nav>
          <h1>CDC Büyüme Eğrileri</h1>
          <p>Amerikan Hastalık Kontrol ve Önleme Merkezi (CDC) büyüme standartları ve eğrileri</p>
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
                  <span class="material-icons">trending_up</span>
                </div>
                <div class="doc-meta">
                  <div class="doc-category">CDC Büyüme Eğrileri</div>
                  <div class="doc-type">Büyüme Tablosu</div>
                </div>
              </div>
              <div class="doc-card-body">
                <h3 class="doc-title">{{ doc.title }}</h3>
                <p class="doc-description">CDC standartlarına göre büyüme takip tablosu</p>
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
export class CdcBuyumeEgrileriCategoryComponent implements OnInit {
  docs: ResourceLink[] = RESOURCES_INDEX['cdc-buyume-egrileri'] || [];
  
  constructor(private title: Title, private meta: Meta) {}
  
  ngOnInit(): void {
    const pageTitle = 'CDC Büyüme Eğrileri | Kaynaklar | Özlem Murzoğlu';
    const description = 'Amerikan Hastalık Kontrol ve Önleme Merkezi (CDC) büyüme standartları ve eğrileri. Çocuk gelişimini takip etmek için kullanılan resmi tablolar.';
    
    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'keywords', content: 'CDC, büyüme eğrileri, boy kilo, percentil, çocuk gelişimi' });
  }
}
