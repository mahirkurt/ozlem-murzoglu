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
}