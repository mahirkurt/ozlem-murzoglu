import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../components/shared/hero-section/hero-section.component';

interface FAQ {
  question: string;
  answer: string;
  category: string;
  isOpen?: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, TranslateModule, HeroSectionComponent],
  templateUrl: './faq.html',
  styleUrl: './faq.css'
})
export class FaqComponent {
  breadcrumbs = [
    { label: 'Ana Sayfa', link: '/' },
    { label: 'S.S.S.' }
  ];

  selectedCategory = 'all';
  categories = [
    { key: 'all', label: 'FAQ.CATEGORY_ALL' },
    { key: 'appointment', label: 'FAQ.CATEGORY_APPOINTMENT' },
    { key: 'services', label: 'FAQ.CATEGORY_SERVICES' },
    { key: 'payment', label: 'FAQ.CATEGORY_PAYMENT' },
    { key: 'general', label: 'FAQ.CATEGORY_GENERAL' }
  ];
  
  phoneNumber = '+90 216 688 44 83';
  whatsappNumber = '+90 546 688 44 83';
  
  constructor(private translate: TranslateService) {}
  
  faqs: FAQ[] = [
    {
      question: 'FAQ.Q1',
      answer: 'FAQ.A1',
      category: 'general'
    },
    {
      question: 'FAQ.Q2',
      answer: 'FAQ.A2',
      category: 'appointment'
    },
    {
      question: 'FAQ.Q3',
      answer: 'FAQ.A3',
      category: 'payment'
    },
    {
      question: 'FAQ.Q4',
      answer: 'FAQ.A4',
      category: 'payment'
    },
    {
      question: 'FAQ.Q5',
      answer: 'FAQ.A5',
      category: 'services'
    },
    {
      question: 'FAQ.Q6',
      answer: 'FAQ.A6',
      category: 'general'
    },
    {
      question: 'FAQ.Q7',
      answer: 'FAQ.A7',
      category: 'services'
    },
    {
      question: 'FAQ.Q8',
      answer: 'FAQ.A8',
      category: 'services'
    },
    {
      question: 'FAQ.Q9',
      answer: 'FAQ.A9',
      category: 'services'
    },
    {
      question: 'FAQ.Q10',
      answer: 'FAQ.A10',
      category: 'appointment'
    },
    {
      question: 'FAQ.Q11',
      answer: 'FAQ.A11',
      category: 'general'
    },
    {
      question: 'FAQ.Q12',
      answer: 'FAQ.A12',
      category: 'general'
    }
  ];
  
  get filteredFaqs(): FAQ[] {
    if (this.selectedCategory === 'all') {
      return this.faqs;
    }
    return this.faqs.filter(faq => faq.category === this.selectedCategory);
  }
  
  getCategoryCount(category: string): number {
    if (category === 'all') {
      return this.faqs.length;
    }
    return this.faqs.filter(faq => faq.category === category).length;
  }
  
  selectCategory(category: string) {
    this.selectedCategory = category;
    this.faqs.forEach(faq => faq.isOpen = false);
  }
  
  toggleFaq(faq: FAQ) {
    faq.isOpen = !faq.isOpen;
  }
}