import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RESOURCES_INDEX, ResourceLink } from '../resources-index';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-gebelik-donemi',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="category-page">
      <div class="category-header">
        <div class="container">
          <nav class="breadcrumb">
            <a routerLink="/kaynaklar">Kaynaklar</a>
            <span> / </span>
            <span>Gebelik Dönemi</span>
          </nav>
          <h1>Gebelik Dönemi</h1>
          <p>Gebelik ve bebeğin gelecekteki yaşamı için hazırlık rehberleri ve bilgilendirici kaynaklar</p>
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
                  <span class="material-icons">pregnant_woman</span>
                </div>
                <div class="doc-meta">
                  <div class="doc-category">Gebelik Dönemi</div>
                  <div class="doc-type">Hazırlık Rehberi</div>
                </div>
              </div>
              <div class="doc-card-body">
                <h3 class="doc-title">{{ doc.title }}</h3>
                <p class="doc-description">Gebelik ve bebeğin gelecekteki yaşamı için hazırlık bilgileri</p>
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
export class GebelikDonemiCategoryComponent implements OnInit {
  docs: ResourceLink[] = RESOURCES_INDEX['gebelik-donemi'] || [];
  
  constructor(private title: Title, private meta: Meta) {}
  
  ngOnInit(): void {
    const pageTitle = 'Gebelik Dönemi | Kaynaklar | Özlem Mürzoğlu';
    const description = 'Gebelik ve bebeğin gelecekteki yaşamı için hazırlık rehberleri. Emzirme, bebek odası güvenliği, beslenme ve bakım konularında bilgiler.';
    
    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'keywords', content: 'gebelik dönemi, emzirme hazırlığı, bebek odası, güvenlik, beslenme' });
  }
}
