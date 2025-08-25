import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RESOURCES_INDEX, ResourceLink } from './resources-index';
import { HeroSectionComponent } from '../../components/shared/hero-section/hero-section.component';

interface ResourceCategory {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  color: string;
  documentCount: number;
  route: string;
}

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.css'
})
export class ResourcesComponent {
  private translate = inject(TranslateService);
  
  breadcrumbs = [
    { label: 'RESOURCES.HOME_BREADCRUMB', link: '/' },
    { label: 'RESOURCES.RESOURCES_BREADCRUMB' }
  ];
  query = '';
  results: { title: string; path: string; category: string }[] = [];
  categories: ResourceCategory[] = [
    {
      id: 'asilar',
      titleKey: 'RESOURCES.CATEGORIES.VACCINES',
      descriptionKey: 'RESOURCES.CATEGORIES.VACCINES_DESC',
      icon: 'vaccines',
      color: 'accent',
      documentCount: 15,
      route: '/bilgi-merkezi/asilar'
    },
    {
      id: 'gebelik-donemi',
      titleKey: 'RESOURCES.CATEGORIES.PREGNANCY',
      descriptionKey: 'RESOURCES.CATEGORIES.PREGNANCY_DESC',
      icon: 'pregnant_woman',
      color: 'primary',
      documentCount: 20,
      route: '/bilgi-merkezi/gebelik-donemi'
    },
    {
      id: 'gelisim-rehberleri',
      titleKey: 'RESOURCES.CATEGORIES.DEVELOPMENT',
      descriptionKey: 'RESOURCES.CATEGORIES.DEVELOPMENT_DESC',
      icon: 'trending_up',
      color: 'secondary',
      documentCount: 18,
      route: '/bilgi-merkezi/gelisim-rehberleri'
    },
    {
      id: 'hastaliklar',
      titleKey: 'RESOURCES.CATEGORIES.DISEASES',
      descriptionKey: 'RESOURCES.CATEGORIES.DISEASES_DESC',
      icon: 'medical_information',
      color: 'accent',
      documentCount: 35,
      route: '/bilgi-merkezi/hastaliklar'
    },
    {
      id: 'oyuncaklar',
      titleKey: 'RESOURCES.CATEGORIES.TOYS',
      descriptionKey: 'RESOURCES.CATEGORIES.TOYS_DESC',
      icon: 'toys',
      color: 'primary',
      documentCount: 12,
      route: '/bilgi-merkezi/oyuncaklar'
    },
    {
      id: 'aile-medya-plani',
      titleKey: 'RESOURCES.CATEGORIES.MEDIA_PLAN',
      descriptionKey: 'RESOURCES.CATEGORIES.MEDIA_PLAN_DESC',
      icon: 'devices',
      color: 'secondary',
      documentCount: 8,
      route: '/bilgi-merkezi/aile-medya-plani'
    },
    {
      id: 'genel-bilgiler',
      titleKey: 'RESOURCES.CATEGORIES.GENERAL_INFO',
      descriptionKey: 'RESOURCES.CATEGORIES.GENERAL_INFO_DESC',
      icon: 'info',
      color: 'accent',
      documentCount: 22,
      route: '/bilgi-merkezi/genel-bilgiler'
    },
    {
      id: 'cdc-buyume-egrileri',
      titleKey: 'RESOURCES.CATEGORIES.CDC_GROWTH',
      descriptionKey: 'RESOURCES.CATEGORIES.CDC_GROWTH_DESC',
      icon: 'show_chart',
      color: 'primary',
      documentCount: 10,
      route: '/bilgi-merkezi/cdc-buyume-egrileri'
    },
    {
      id: 'who-buyume-egrileri',
      titleKey: 'RESOURCES.CATEGORIES.WHO_GROWTH',
      descriptionKey: 'RESOURCES.CATEGORIES.WHO_GROWTH_DESC',
      icon: 'analytics',
      color: 'secondary',
      documentCount: 10,
      route: '/bilgi-merkezi/who-buyume-egrileri'
    }
  ];

  getColorClass(color: string): string {
    return `category-${color}`;
  }

  onSearch(q: string) {
    this.query = q;
    const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    const nq = norm(q);
    const acc: { title: string; path: string; category: string }[] = [];
    Object.entries(RESOURCES_INDEX).forEach(([cat, items]) => {
      items.forEach((it: ResourceLink) => {
        if (norm(it.title).includes(nq)) acc.push({ title: it.title, path: it.path, category: cat });
      });
    });
    this.results = acc.slice(0, 50);
  }
}