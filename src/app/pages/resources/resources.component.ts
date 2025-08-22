import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RESOURCES_INDEX, ResourceLink } from './resources-index';

interface ResourceCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  documentCount: number;
  route: string;
}

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.css'
})
export class ResourcesComponent {
  query = '';
  results: { title: string; path: string; category: string }[] = [];
  categories: ResourceCategory[] = [
    {
      id: 'bright-futures-aile',
      title: 'Bright Futures (Aile)',
      description: 'Amerikan Pediatri Akademisi tarafından hazırlanan, çocuğunuzun her yaş dönemine özel aile rehberleri',
      icon: 'family_restroom',
      color: 'primary',
      documentCount: 30,
      route: '/kaynaklar/bright-futures-aile'
    },
    {
      id: 'bright-futures-cocuk',
      title: 'Bright Futures (Çocuk)',
      description: 'Çocuklar için hazırlanmış, yaşa uygun gelişim ve sağlık bilgileri',
      icon: 'child_care',
      color: 'secondary',
      documentCount: 25,
      route: '/kaynaklar/bright-futures-cocuk'
    },
    {
      id: 'asilar',
      title: 'Aşılar',
      description: 'Aşılar hakkında detaylı bilgiler, takvimler ve sıkça sorulan sorular',
      icon: 'vaccines',
      color: 'accent',
      documentCount: 15,
      route: '/kaynaklar/asilar'
    },
    {
      id: 'gebelik-donemi',
      title: 'Gebelik Dönemi',
      description: 'Gebelik sürecinde beslenme, egzersiz ve sağlık konularında rehberler',
      icon: 'pregnant_woman',
      color: 'primary',
      documentCount: 20,
      route: '/kaynaklar/gebelik-donemi'
    },
    {
      id: 'gelisim-rehberleri',
      title: 'Gelişim Rehberleri',
      description: 'Çocuğunuzun fiziksel, zihinsel ve duygusal gelişimini takip etmenize yardımcı kaynaklar',
      icon: 'trending_up',
      color: 'secondary',
      documentCount: 18,
      route: '/kaynaklar/gelisim-rehberleri'
    },
    {
      id: 'hastaliklar',
      title: 'Hastalıklar',
      description: 'Çocukluk çağı hastalıkları hakkında bilgilendirici dökümanlar',
      icon: 'medical_information',
      color: 'accent',
      documentCount: 35,
      route: '/kaynaklar/hastaliklar'
    },
    {
      id: 'oyuncaklar',
      title: 'Oyuncaklar',
      description: 'Yaşa uygun oyuncak seçimi ve güvenli oyun rehberleri',
      icon: 'toys',
      color: 'primary',
      documentCount: 12,
      route: '/kaynaklar/oyuncaklar'
    },
    {
      id: 'aile-medya-plani',
      title: 'Aile Medya Planı',
      description: 'Dijital çağda çocuğunuzun ekran süresi ve medya kullanımını düzenleme rehberi',
      icon: 'devices',
      color: 'secondary',
      documentCount: 8,
      route: '/kaynaklar/aile-medya-plani'
    },
    {
      id: 'genel-bilgiler',
      title: 'Genel Bilgiler',
      description: 'Çocuk sağlığı ve bakımı hakkında genel bilgiler ve öneriler',
      icon: 'info',
      color: 'accent',
      documentCount: 22,
      route: '/kaynaklar/genel-bilgiler'
    },
    {
      id: 'cdc-buyume-egrileri',
      title: 'CDC Büyüme Eğrileri',
      description: 'CDC standartlarına göre çocuğunuzun büyüme ve gelişim takibi',
      icon: 'show_chart',
      color: 'primary',
      documentCount: 10,
      route: '/kaynaklar/cdc-buyume-egrileri'
    },
    {
      id: 'who-buyume-egrileri',
      title: 'WHO Büyüme Eğrileri',
      description: 'Dünya Sağlık Örgütü standartlarına göre büyüme takip çizelgeleri',
      icon: 'analytics',
      color: 'secondary',
      documentCount: 10,
      route: '/kaynaklar/who-buyume-egrileri'
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