import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.css'
})
export class ArticlesComponent {
  private translate = inject(TranslateService);
  
  breadcrumbs = [
    { label: 'Ana Sayfa', link: '/' },
    { label: 'Makaleler' }
  ];
}