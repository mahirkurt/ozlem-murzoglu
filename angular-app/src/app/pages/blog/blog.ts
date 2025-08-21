import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  category: string;
  date: string;
  readTime: number;
  image: string;
  author: string;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './blog.html',
  styleUrl: './blog.css'
})
export class BlogComponent {
  categories = ['Tümü', 'Bebek Bakımı', 'Çocuk Gelişimi', 'Hastalıklar', 'Beslenme', 'Aşılar'];
  selectedCategory = 'Tümü';
  newsletterEmail = '';
  hasMore = true;
  
  blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Pişik (Bez Dermatiti)',
      slug: 'pisik-bez-dermatiti',
      excerpt: 'Bebeklerde bez bölgesinde oluşan kızarıklık ve tahriş durumu olan pişik, doğru bakım yöntemleriyle önlenebilir ve tedavi edilebilir.',
      category: 'Bebek Bakımı',
      date: '15 Aralık 2024',
      readTime: 5,
      image: '/images/blog/diaper-rash.jpg',
      author: 'Dr. Özlem Murzoğlu'
    },
    {
      id: 2,
      title: 'Emzikler ve Emzik Bırakma',
      slug: 'emzikler-ve-emzik-birakma',
      excerpt: 'Emzik kullanımının faydaları, zararları ve emzik bırakma sürecinde dikkat edilmesi gerekenler hakkında bilmeniz gerekenler.',
      category: 'Bebek Bakımı',
      date: '10 Aralık 2024',
      readTime: 7,
      image: '/images/blog/pacifier.jpg',
      author: 'Dr. Özlem Murzoğlu'
    },
    {
      id: 3,
      title: 'Ayrılık Kaygısı',
      slug: 'ayrilik-kaygisi',
      excerpt: 'Çocuklarda görülen ayrılık kaygısının nedenleri, belirtileri ve ebeveynlerin bu süreçte yapabilecekleri.',
      category: 'Çocuk Gelişimi',
      date: '5 Aralık 2024',
      readTime: 8,
      image: '/images/blog/separation-anxiety.jpg',
      author: 'Dr. Özlem Murzoğlu'
    },
    {
      id: 4,
      title: 'Diş Çıkarma Süreci',
      slug: 'dis-cikarma-sureci',
      excerpt: 'Bebeklerde diş çıkarma döneminin belirtileri ve bu süreçte bebeğinizi rahatlatmak için yapabilecekleriniz.',
      category: 'Bebek Bakımı',
      date: '1 Aralık 2024',
      readTime: 6,
      image: '/images/blog/teething.jpg',
      author: 'Dr. Özlem Murzoğlu'
    },
    {
      id: 5,
      title: 'Çocuklar Arasında Zorbalık',
      slug: 'cocuklar-arasinda-zorbalik',
      excerpt: 'Akran zorbalığının türleri, belirtileri ve çocuğunuzu zorbalıktan korumak için alabileceğiniz önlemler.',
      category: 'Çocuk Gelişimi',
      date: '25 Kasım 2024',
      readTime: 10,
      image: '/images/blog/bullying.jpg',
      author: 'Dr. Özlem Murzoğlu'
    },
    {
      id: 6,
      title: 'Güvenli Uyku ve SIDS Önlemi',
      slug: 'guvenli-uyku-sids-onlemi',
      excerpt: 'Ani bebek ölümü sendromunu (SIDS) önlemek için güvenli uyku ortamı oluşturma ve uyku güvenliği kuralları.',
      category: 'Bebek Bakımı',
      date: '20 Kasım 2024',
      readTime: 9,
      image: '/images/blog/safe-sleep.jpg',
      author: 'Dr. Özlem Murzoğlu'
    },
    {
      id: 7,
      title: 'Çocuklarda Bağışıklık Sistemi',
      slug: 'cocuklarda-bagisiklik-sistemi',
      excerpt: 'Çocukların bağışıklık sistemini güçlendirmek için beslenme önerileri ve yaşam tarzı değişiklikleri.',
      category: 'Beslenme',
      date: '15 Kasım 2024',
      readTime: 7,
      image: '/images/blog/immunity.jpg',
      author: 'Dr. Özlem Murzoğlu'
    },
    {
      id: 8,
      title: 'Aşı Takvimi 2024',
      slug: 'asi-takvimi-2024',
      excerpt: 'Sağlık Bakanlığı\'nın 2024 yılı güncel aşı takvimi ve aşılar hakkında merak edilenler.',
      category: 'Aşılar',
      date: '10 Kasım 2024',
      readTime: 12,
      image: '/images/blog/vaccination.jpg',
      author: 'Dr. Özlem Murzoğlu'
    }
  ];
  
  filteredPosts: BlogPost[] = [];
  displayCount = 6;
  
  constructor() {
    this.filterByCategory('Tümü');
  }
  
  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.displayCount = 6;
    
    if (category === 'Tümü') {
      this.filteredPosts = this.blogPosts.slice(0, this.displayCount);
    } else {
      const filtered = this.blogPosts.filter(post => post.category === category);
      this.filteredPosts = filtered.slice(0, this.displayCount);
    }
    
    this.updateHasMore();
  }
  
  loadMore() {
    this.displayCount += 3;
    
    if (this.selectedCategory === 'Tümü') {
      this.filteredPosts = this.blogPosts.slice(0, this.displayCount);
    } else {
      const filtered = this.blogPosts.filter(post => post.category === this.selectedCategory);
      this.filteredPosts = filtered.slice(0, this.displayCount);
    }
    
    this.updateHasMore();
  }
  
  updateHasMore() {
    if (this.selectedCategory === 'Tümü') {
      this.hasMore = this.displayCount < this.blogPosts.length;
    } else {
      const filtered = this.blogPosts.filter(post => post.category === this.selectedCategory);
      this.hasMore = this.displayCount < filtered.length;
    }
  }
  
  subscribeNewsletter() {
    if (this.newsletterEmail) {
      console.log('Newsletter subscription:', this.newsletterEmail);
      alert('Bültenimize abone olduğunuz için teşekkür ederiz!');
      this.newsletterEmail = '';
    }
  }
}