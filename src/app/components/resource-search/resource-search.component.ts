import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-resource-search',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="search-container">
      <input 
        type="text" 
        [(ngModel)]="searchQuery"
        (input)="onSearch()"
        [placeholder]="'RESOURCES.SEARCH_PLACEHOLDER' | translate"
        class="search-input"
      />
      <span class="material-icons search-icon">search</span>
    </div>
  `,
  styles: [`
    .search-container {
      position: relative;
      width: 100%;
      max-width: 400px;
      margin: 0 auto 2rem;
    }
    
    .search-input {
      width: 100%;
      padding: 12px 40px 12px 16px;
      border: 1px solid var(--color-neutral-300);
      border-radius: 8px;
      font-size: 16px;
      transition: all 0.3s ease;
    }
    
    .search-input:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(0, 95, 115, 0.1);
    }
    
    .search-icon {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-neutral-500);
    }
  `]
})
export class ResourceSearchComponent {
  @Output() searchChange = new EventEmitter<string>();
  searchQuery = '';
  
  onSearch(): void {
    this.searchChange.emit(this.searchQuery);
  }
}