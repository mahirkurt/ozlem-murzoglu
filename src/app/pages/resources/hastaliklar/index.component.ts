import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
    import { RESOURCES_INDEX, ResourceLink } from '../resources-index';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-hastaliklar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="category-page">
      <div class="category-header">
        <div class="container">
          <h1>Hastalıklar</h1>
              <p>Bu kategorideki tüm kaynaklar</p>
        </div>
      </div>
      <div class="category-content">
        <div class="container">
              <div class="doc-list">
                <a *ngFor="let doc of docs" class="doc-item" [routerLink]="doc.path">
                  <span class="material-icons">description</span>
                  <span>{{ doc.title }}</span>
                </a>
              </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .category-page {
      min-height: 100vh;
      padding-top: 80px;
    }
    .category-header {
      background: var(--color-primary);
      color: white;
      padding: 3rem 0;
    }
        .doc-list { display: grid; grid-template-columns: 1fr; gap: 0.5rem; margin-top: 1.5rem; }
        .doc-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; background: white; border-radius: 10px; text-decoration: none; color: inherit; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .doc-item:hover { box-shadow: 0 3px 12px rgba(0,0,0,0.08); transform: translateY(-1px); }
  `]
})
    export class HastaliklarCategoryComponent implements OnInit {
      docs: ResourceLink[] = RESOURCES_INDEX['hastaliklar'] || [];
      constructor(private title: Title, private meta: Meta) {}
      ngOnInit(): void {
        const pageTitle = 'Hastalıklar | Kaynaklar | Özlem Mürzoğlu';
        this.title.setTitle(pageTitle);
        this.meta.updateTag({ name: 'description', content: 'Hastalıklar kategorisindeki kaynaklar' });
      }
    }
