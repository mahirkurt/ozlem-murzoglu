import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div class="favorites-container">
      <h1>{{ 'FAVORITES.TITLE' | translate }}</h1>
      <p>{{ 'FAVORITES.EMPTY' | translate }}</p>
    </div>
  `,
  styles: [`
    .favorites-container {
      padding: 40px;
      min-height: 60vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    h1 {
      color: var(--color-primary);
      margin-bottom: 20px;
    }
    
    p {
      color: var(--color-neutral-600);
    }
  `]
})
export class FavoritesComponent implements OnInit {
  constructor() {}
  
  ngOnInit(): void {}
}