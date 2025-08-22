import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BlogService, BlogArticle } from '../../services/blog.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-blog-article',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-article.component.html',
  styleUrl: './blog-article.component.css'
})
export class BlogArticleComponent implements OnInit {
  article: BlogArticle | undefined;
  relatedArticles: BlogArticle[] = [];
  isLoading = true;
  isDark = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    // Check if current theme is dark
    this.updateThemeStatus();
    
    // Listen for theme changes if needed
    // Note: This is a simple check, you might want to implement a proper observable in ThemeService
    
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.loadArticle(slug);
      }
    });
  }

  private updateThemeStatus() {
    const theme = this.themeService.getTheme();
    const root = document.documentElement;
    
    if (theme === 'dark') {
      this.isDark = true;
    } else if (theme === 'light') {
      this.isDark = false;
    } else { // auto
      this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  }

  loadArticle(slug: string) {
    this.isLoading = true;
    this.blogService.getArticleBySlug(slug).subscribe(article => {
      if (article) {
        this.article = article;
        this.loadRelatedArticles();
      } else {
        // Article not found, redirect to blog
        this.router.navigate(['/blog']);
      }
      this.isLoading = false;
    });
  }

  loadRelatedArticles() {
    if (this.article) {
      this.blogService.getArticlesByCategory(this.article.category).subscribe(articles => {
        this.relatedArticles = articles
          .filter(a => a.id !== this.article!.id)
          .slice(0, 3);
      });
    }
  }

  shareArticle(platform: string) {
    if (!this.article) return;

    const url = window.location.href;
    const title = this.article.title;
    const text = this.article.excerpt;

    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  }

  copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      // You could show a toast notification here
      console.log('Link copied to clipboard');
    });
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  printArticle() {
    window.print();
  }

  getArticleIcon(slug: string): string {
    const iconMap: { [key: string]: string } = {
      'dis-cikarma-sureci': 'child_care',
      'cocuklar-arasi-zorbalik': 'groups',
      'emzik-ve-emzik-birakma': 'baby_changing_station',
      'tuvalet-egitimi': 'wc',
      'bir-ergenle-iletisim-kurmak': 'forum',
      'araba-guvenlik-koltuklari': 'car_repair',
      'guvenli-uyku': 'bedtime',
      'saglikli-disler': 'medical_services',
      'emzik-parmak-emme': 'baby_changing_station',
      'kolik': 'child_care',
      'ayrilik-kaygisi': 'favorite',
      'pisikler': 'healing'
    };
    return iconMap[slug] || 'medical_services';
  }
}