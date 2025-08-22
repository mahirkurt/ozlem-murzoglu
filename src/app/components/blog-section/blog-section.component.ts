import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  illustrationType: 'sleep' | 'parenting' | 'vaccination';
  color: 'primary' | 'secondary' | 'tertiary';
}

@Component({
  selector: 'app-blog-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-section.component.html',
  styleUrl: './blog-section.component.css'
})
export class BlogSectionComponent {
  blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Çocuklarda Uyku Düzeni Nasıl Sağlanır?',
      excerpt: 'Sağlıklı uyku, çocuğunuzun fiziksel ve zihinsel gelişimi için kritik öneme sahiptir. Yaşa uygun uyku rutinleri...',
      category: 'Uyku Danışmanlığı',
      date: '15 Aralık 2024',
      readTime: '5 dk okuma',
      illustrationType: 'sleep',
      color: 'primary'
    },
    {
      id: 2,
      title: 'Triple P: Pozitif Ebeveynlik Programı',
      excerpt: 'Çocuğunuzla olan ilişkinizi güçlendirirken, davranış sorunlarıyla başa çıkmanın kanıtlanmış yöntemleri...',
      category: 'Ebeveynlik',
      date: '12 Aralık 2024',
      readTime: '7 dk okuma',
      illustrationType: 'parenting',
      color: 'secondary'
    },
    {
      id: 3,
      title: 'Aşı Takvimi 2024: Bilmeniz Gerekenler',
      excerpt: 'Sağlık Bakanlığı\'nın güncel aşı takvimi ve çocuğunuzun hangi yaşta hangi aşıları olması gerektiği...',
      category: 'Aşılama',
      date: '10 Aralık 2024',
      readTime: '4 dk okuma',
      illustrationType: 'vaccination',
      color: 'tertiary'
    }
  ];

  getIllustrationIcon(type: string): string {
    switch(type) {
      case 'sleep': return 'bedtime';
      case 'parenting': return 'family_restroom';
      case 'vaccination': return 'vaccines';
      default: return 'article';
    }
  }

  getSVGIllustration(type: string): string {
    const titleId = `illo-${type}-${Math.random().toString(36).slice(2)}`;
    
    switch(type) {
      case 'sleep':
        return `
          <svg class="blog-illustration-svg illo" role="img" aria-labelledby="${titleId}" viewBox="0 0 200 200">
            <title id="${titleId}">Uyku düzeni illüstrasyonu</title>
            <!-- Moon -->
            <circle cx="140" cy="60" r="25" class="illo-fill-primary"/>
            <circle cx="148" cy="52" r="20" class="illo-fill-surface"/>
            <!-- Stars -->
            <path d="M60,40 L62,46 L68,46 L63,50 L65,56 L60,52 L55,56 L57,50 L52,46 L58,46 Z" class="illo-fill-secondary"/>
            <path d="M180,90 L181,94 L185,94 L182,97 L183,101 L180,98 L177,101 L178,97 L175,94 L179,94 Z" class="illo-fill-accent"/>
            <!-- Baby in crib -->
            <rect x="40" y="120" width="120" height="60" rx="8" class="illo-fill-neutral-100" stroke-width="2" class="illo-stroke-weak"/>
            <!-- Baby head -->
            <circle cx="100" cy="140" r="15" class="illo-fill-accent"/>
            <!-- Blanket -->
            <path d="M70,150 Q100,145 130,150 L130,170 Q100,175 70,170 Z" class="illo-fill-secondary" opacity="0.7"/>
            <!-- Pillow -->
            <ellipse cx="100" cy="135" rx="20" ry="8" class="illo-fill-neutral-200"/>
            <!-- Sleep zzz -->
            <text x="20" y="90" font-family="Arial" font-size="14" class="illo-fill-primary">Z</text>
            <text x="25" y="80" font-family="Arial" font-size="12" class="illo-fill-primary" opacity="0.7">z</text>
            <text x="30" y="75" font-family="Arial" font-size="10" class="illo-fill-primary" opacity="0.5">z</text>
          </svg>
        `;
      
      case 'parenting':
        return `
          <svg class="blog-illustration-svg illo" role="img" aria-labelledby="${titleId}" viewBox="0 0 200 200">
            <title id="${titleId}">Ebeveynlik danışmanlığı illüstrasyonu</title>
            <!-- Parent figure -->
            <circle cx="80" cy="60" r="20" class="illo-fill-primary"/>
            <rect x="60" y="80" width="40" height="60" rx="8" class="illo-fill-secondary"/>
            <!-- Child figure -->
            <circle cx="130" cy="80" r="15" class="illo-fill-accent"/>
            <rect x="115" y="95" width="30" height="45" rx="6" class="illo-fill-neutral-200"/>
            <!-- Heart between them -->
            <path d="M102,100 C102,95 108,95 108,100 C108,95 114,95 114,100 C114,110 108,118 108,118 C108,118 102,110 102,100 Z" class="illo-fill-accent"/>
            <!-- Hands reaching towards each other -->
            <circle cx="95" cy="105" r="4" class="illo-fill-primary"/>
            <circle cx="121" cy="105" r="3" class="illo-fill-accent"/>
            <!-- Ground -->
            <ellipse cx="100" cy="180" rx="80" ry="10" class="illo-fill-neutral-100"/>
          </svg>
        `;
      
      case 'vaccination':
        return `
          <svg class="blog-illustration-svg illo" role="img" aria-labelledby="${titleId}" viewBox="0 0 200 200">
            <title id="${titleId}">Aşılama korunma illüstrasyonu</title>
            <!-- Shield background -->
            <path d="M100,20 L140,40 L140,100 Q140,140 100,160 Q60,140 60,100 L60,40 Z" class="illo-fill-primary"/>
            <!-- Inner shield -->
            <path d="M100,35 L125,50 L125,95 Q125,125 100,140 Q75,125 75,95 L75,50 Z" class="illo-fill-surface"/>
            <!-- Medical cross -->
            <rect x="95" y="65" width="10" height="30" class="illo-fill-accent"/>
            <rect x="85" y="75" width="30" height="10" class="illo-fill-accent"/>
            <!-- Syringe -->
            <rect x="140" y="50" width="25" height="6" rx="3" class="illo-fill-secondary"/>
            <rect x="165" y="52" width="8" height="2" class="illo-fill-neutral-300"/>
            <circle cx="173" cy="53" r="2" class="illo-fill-accent"/>
            <!-- Protection sparkles -->
            <circle cx="50" cy="60" r="2" class="illo-fill-accent"/>
            <circle cx="150" cy="80" r="2" class="illo-fill-secondary"/>
            <circle cx="70" cy="150" r="2" class="illo-fill-primary"/>
            <circle cx="130" cy="160" r="2" class="illo-fill-accent"/>
          </svg>
        `;
      
      default:
        return `
          <svg class="blog-illustration-svg illo" role="img" aria-labelledby="${titleId}" viewBox="0 0 200 200">
            <title id="${titleId}">Makale illüstrasyonu</title>
            <rect x="50" y="50" width="100" height="100" rx="8" class="illo-fill-primary"/>
            <circle cx="100" cy="100" r="30" class="illo-fill-surface"/>
          </svg>
        `;
    }
  }
}