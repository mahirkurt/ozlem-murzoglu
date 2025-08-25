import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RESOURCES_INDEX, ResourceLink } from '../resources-index';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-aile-medya-plani',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="category-page">
      <div class="category-header">
        <div class="container">
          <nav class="breadcrumb">
            <a routerLink="/kaynaklar">Kaynaklar</a>
            <span> / </span>
            <span>Aile Medya Planı</span>
          </nav>
          <h1>Aile Medya Planı</h1>
          <p>Dijital medya kullanımı için aile rehberleri ve planlama araçları</p>
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
                  <span class="material-icons">devices</span>
                </div>
                <div class="doc-meta">
                  <div class="doc-category">Aile Medya Planı</div>
                  <div class="doc-type">Rehber</div>
                </div>
              </div>
              <div class="doc-card-body">
                <h3 class="doc-title">{{ doc.title }}</h3>
                <p class="doc-description">Sağlıklı medya kullanımı için aile rehberi</p>
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
export class AileMedyaPlaniCategoryComponent implements OnInit {
  docs: ResourceLink[] = RESOURCES_INDEX['aile-medya-plani'] || [];
  
  constructor(private title: Title, private meta: Meta) {}
  
  ngOnInit(): void {
    const pageTitle = 'Aile Medya Planı | Kaynaklar | Özlem Murzoğlu';
    const description = 'Dijital medya kullanımı için aile rehberleri ve planlama araçları. Ekran süresi, medya dengesi ve dijital güvenlik konularında rehberler.';
    
    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'keywords', content: 'aile medya planı, ekran süresi, dijital medya, çocuk güvenlik, medya dengesi' });
  }
}
