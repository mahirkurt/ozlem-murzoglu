import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-saglikli-uykular',
  standalone: true,
  imports: [RouterLink, RouterModule, TranslateModule, CommonModule, HeroSectionComponent],
  templateUrl: './saglikli-uykular.component.html',
  styleUrl: './saglikli-uykular.component.css'
})
export class SaglikliUykularComponent implements OnInit, AfterViewInit {

  ngOnInit(): void {
    this.animateStatNumbers();
  }

  ngAfterViewInit(): void {
    this.observeStatNumbers();
  }

  toggleAccordion(event: Event): void {
    const button = event.currentTarget as HTMLElement;
    const accordionItem = button.closest('.md3-accordion-item');
    const content = accordionItem?.querySelector('.md3-accordion-content') as HTMLElement;

    if (accordionItem && content) {
      // Close all other accordion items
      const allItems = document.querySelectorAll('.md3-accordion-item');
      allItems.forEach(item => {
        if (item !== accordionItem && item.classList.contains('active')) {
          item.classList.remove('active');
        }
      });

      // Toggle current item
      accordionItem.classList.toggle('active');
    }
  }

  private animateStatNumbers(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          this.animateNumber(element);
          observer.unobserve(element);
        }
      });
    }, { threshold: 0.5 });

    setTimeout(() => {
      const statNumbers = document.querySelectorAll('.md3-stat-number');
      statNumbers.forEach(num => observer.observe(num));
    }, 100);
  }

  private animateNumber(element: HTMLElement): void {
    const target = parseInt(element.getAttribute('data-count') || '0');
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current).toString();
    }, 16);
  }

  private observeStatNumbers(): void {
    const options = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, options);

    document.querySelectorAll('.md3-stat-card').forEach(card => {
      observer.observe(card);
    });
  }
}
