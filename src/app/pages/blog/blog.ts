import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BlogService, BlogArticle } from '../../services/blog.service';
import { HeroSectionComponent } from '../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    HeroSectionComponent,
  ],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
})
export class BlogComponent implements OnInit, OnDestroy {
  private readonly categoryKeyMap: Record<string, string> = {
    'Bebek Bakımı': 'BABY_CARE',
    'Çocuk Psikolojisi': 'CHILD_PSYCHOLOGY',
    'Çocuk Gelişimi': 'CHILD_DEVELOPMENT',
    Ergenlik: 'ADOLESCENCE',
    Güvenlik: 'SAFETY',
    'Diş Sağlığı': 'DENTAL_HEALTH',
    BABY_CARE: 'BABY_CARE',
    CHILD_PSYCHOLOGY: 'CHILD_PSYCHOLOGY',
    CHILD_DEVELOPMENT: 'CHILD_DEVELOPMENT',
    ADOLESCENCE: 'ADOLESCENCE',
    SAFETY: 'SAFETY',
    DENTAL_HEALTH: 'DENTAL_HEALTH',
  };

  breadcrumbs = [
    { label: 'HEADER.NAV_HOME', link: '/' },
    { label: 'BLOG.TITLE' }
  ];

  articles$: Observable<BlogArticle[]> = new Observable();
  featuredArticles$: Observable<BlogArticle[]> = new Observable();
  categories: string[] = [];
  searchQuery: string = '';
  selectedCategory: string = '';

  private destroy$ = new Subject<void>();

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadContent();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadContent(): void {
    this.articles$ = this.blogService.getAllArticles();
    this.featuredArticles$ = this.blogService.getFeaturedArticles();
    this.categories = this.blogService.getCategories();
  }

  onSearchChange(): void {
    if (this.searchQuery.trim()) {
      this.articles$ = this.blogService.searchArticles(this.searchQuery);
    } else {
      this.onCategoryChange();
    }
  }

  onCategoryChange(): void {
    if (this.selectedCategory) {
      this.articles$ = this.blogService.getArticlesByCategory(this.selectedCategory);
    } else {
      this.articles$ = this.blogService.getAllArticles();
    }
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.articles$ = this.blogService.getAllArticles();
  }

  trackByArticleId(index: number, article: BlogArticle): string {
    return article.id;
  }

  getCategoryLabelKey(category: string): string {
    const mappedCategory = this.categoryKeyMap[category] ?? category;
    return `FAVORITES.BLOG.CATEGORIES.${mappedCategory}`;
  }
}
