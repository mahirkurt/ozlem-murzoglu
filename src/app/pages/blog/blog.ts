import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BlogService, BlogArticle } from '../../services/blog.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './blog.html',
  styleUrl: './blog.css'
})
export class BlogComponent implements OnInit {
  categories: string[] = [];
  selectedCategory = 'Tümü';
  newsletterEmail = '';
  hasMore = true;
  
  articles: BlogArticle[] = [];
  filteredPosts: BlogArticle[] = [];
  displayCount = 6;
  
  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadArticles();
    this.loadCategories();
    
    // Handle category filtering from query parameters
    this.route.queryParams.subscribe(params => {
      const category = params['category'];
      if (category) {
        this.filterByCategory(category);
      }
    });
  }

  loadArticles() {
    this.blogService.getAllArticles().subscribe(articles => {
      this.articles = articles;
      this.filterByCategory('Tümü');
    });
  }

  loadCategories() {
    this.categories = this.blogService.getCategories();
  }
  
  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.displayCount = 6;
    
    this.blogService.getArticlesByCategory(category).subscribe(articles => {
      this.filteredPosts = articles.slice(0, this.displayCount);
      this.updateHasMore();
    });
  }
  
  loadMore() {
    this.displayCount += 3;
    
    this.blogService.getArticlesByCategory(this.selectedCategory).subscribe(articles => {
      this.filteredPosts = articles.slice(0, this.displayCount);
      this.updateHasMore();
    });
  }
  
  updateHasMore() {
    this.blogService.getArticlesByCategory(this.selectedCategory).subscribe(articles => {
      this.hasMore = this.displayCount < articles.length;
    });
  }
  
  subscribeNewsletter() {
    if (this.newsletterEmail) {
      console.log('Newsletter subscription:', this.newsletterEmail);
      alert('Bültenimize abone olduğunuz için teşekkür ederiz!');
      this.newsletterEmail = '';
    }
  }
}