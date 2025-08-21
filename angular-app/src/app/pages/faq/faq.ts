import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FAQ {
  question: string;
  answer: string;
  category: string;
  isOpen?: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.html',
  styleUrl: './faq.css'
})
export class FaqComponent {
  selectedCategory = 'Tümü';
  categories = ['Tümü', 'Randevu', 'Hizmetler', 'Ödeme', 'Genel'];
  
  faqs: FAQ[] = [
    {
      question: 'Kliniğinizde hangi yaş grubu çocuklara bakıyorsunuz?',
      answer: 'Kliniğimizde 0-18 yaş arası tüm çocuklara hizmet vermekteyiz. Yenidoğan döneminden ergenlik döneminin sonuna kadar her yaş grubuna özel yaklaşımlarımız bulunmaktadır.',
      category: 'Genel'
    },
    {
      question: 'Randevu almak için ne yapmam gerekiyor?',
      answer: 'Web sitemizden online randevu alabilir, 0222 237 84 00 numaralı telefondan bizi arayabilir veya WhatsApp hattımızdan mesaj gönderebilirsiniz. Online randevu sistemimiz 7/24 hizmet vermektedir.',
      category: 'Randevu'
    },
    {
      question: 'Muayene ücreti ne kadar?',
      answer: 'Muayene ücretlerimiz hizmetin kapsamına göre değişmektedir. Bright Futures kapsamlı muayene, standart muayene ve kontrol muayenesi için farklı ücretlendirmelerimiz bulunmaktadır. Detaylı bilgi için bizi arayabilirsiniz.',
      category: 'Ödeme'
    },
    {
      question: 'Özel sağlık sigortam geçerli mi?',
      answer: 'Anlaşmalı olduğumuz özel sağlık sigortaları bulunmaktadır. Sigortanızın geçerli olup olmadığını öğrenmek için muayene öncesinde bizi arayarak bilgi alabilirsiniz.',
      category: 'Ödeme'
    },
    {
      question: 'Bright Futures programı nedir?',
      answer: 'Bright Futures, Amerikan Pediatri Akademisi tarafından geliştirilen, çocuğunuzun doğumdan ergenliğe kadar olan süreçte fiziksel, zihinsel ve sosyal gelişimini takip eden kapsamlı bir sağlık izlem programıdır. Her yaş grubuna özel değerlendirme formları ve en az 1 saatlik detaylı muayene içerir.',
      category: 'Hizmetler'
    },
    {
      question: 'Acil durumlarda kliniğinize gelebilir miyim?',
      answer: 'Kliniğimiz randevu sistemi ile çalışmaktadır. Acil durumlar için en yakın hastane acil servisine başvurmanızı öneririz. Ancak randevulu hastalarımız için acil danışmanlık hizmeti vermekteyiz.',
      category: 'Genel'
    },
    {
      question: 'Aşı takvimine uygun aşılarımızı yaptırabilir miyiz?',
      answer: 'Evet, kliniğimizde Sağlık Bakanlığı\'nın güncel aşı takvimine uygun tüm rutin aşılar ve özel aşılar uygulanmaktadır. Aşı takibi dijital olarak yapılmakta ve hatırlatma servisi sunulmaktadır.',
      category: 'Hizmetler'
    },
    {
      question: 'Online danışmanlık hizmeti veriyor musunuz?',
      answer: 'Evet, özellikle takip hastalarımız için online danışmanlık hizmeti vermekteyiz. Video konferans yöntemiyle uzaktan muayene ve danışmanlık hizmetlerimiz bulunmaktadır.',
      category: 'Hizmetler'
    },
    {
      question: 'Laboratuvar tetkikleri klinikte mi yapılıyor?',
      answer: 'Kliniğimizde kan sayımı, idrar tahlili, hızlı testler gibi temel laboratuvar tetkikleri yapılabilmektedir. Daha kapsamlı tetkikler için anlaşmalı laboratuvarlarımıza yönlendirme yapmaktayız.',
      category: 'Hizmetler'
    },
    {
      question: 'Randevumu iptal etmek veya değiştirmek istiyorum, ne yapmalıyım?',
      answer: 'Randevunuzu en az 24 saat öncesinden iptal edebilir veya değiştirebilirsiniz. Online sistem üzerinden, telefonla veya WhatsApp\'tan bize ulaşarak randevu değişikliği yapabilirsiniz.',
      category: 'Randevu'
    },
    {
      question: 'İlk muayeneye gelirken neleri getirmeliyim?',
      answer: 'İlk muayeneye gelirken çocuğunuzun kimlik bilgileri, varsa önceki tıbbi raporları, aşı kartı, kullandığı ilaçların listesi ve sigortanız varsa sigorta evraklarınızı getirmenizi rica ederiz.',
      category: 'Genel'
    },
    {
      question: 'Muayene ne kadar sürer?',
      answer: 'Standart muayenelerimiz ortalama 30-45 dakika, Bright Futures kapsamlı muayenelerimiz ise minimum 1 saat sürmektedir. İlk muayeneler genellikle daha uzun sürmektedir.',
      category: 'Genel'
    }
  ];
  
  get filteredFaqs(): FAQ[] {
    if (this.selectedCategory === 'Tümü') {
      return this.faqs;
    }
    return this.faqs.filter(faq => faq.category === this.selectedCategory);
  }
  
  selectCategory(category: string) {
    this.selectedCategory = category;
    // Close all FAQs when changing category
    this.faqs.forEach(faq => faq.isOpen = false);
  }
  
  toggleFaq(faq: FAQ) {
    faq.isOpen = !faq.isOpen;
  }
}