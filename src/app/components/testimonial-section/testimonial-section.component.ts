import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonial {
  id: number;
  author: string;
  initials: string;
  text: string;
  rating: number;
  date: string;
}

@Component({
  selector: 'app-testimonial-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonial-section.component.html',
  styleUrl: './testimonial-section.component.css'
})
export class TestimonialSectionComponent implements OnInit, OnDestroy {
  rating = 4.9;
  ratingArray = Array(5).fill(0);
  currentTestimonialIndex = 0;
  private testimonialInterval: any;

  testimonials: Testimonial[] = [
    {
      id: 1,
      author: 'Ayşe Y.',
      initials: 'AY',
      text: 'Dr. Özlem Hanım gerçekten çocuklara nasıl yaklaşılacağını bilen çok özel bir doktor. Oğlumun her kontrolünde gösterdiği özen ve sabır, verdiği detaylı bilgiler sayesinde kendimi çok daha güvende hissediyorum. Çocuk doktoru seçerken çok araştırdım, kesinlikle doğru tercih yapmışım.',
      rating: 5,
      date: '3 ay önce'
    },
    {
      id: 2,
      author: 'Mehmet K.',
      initials: 'MK',
      text: 'Kliniğin temizliği ve modern ekipmanları dikkatimi çekti. Dr. Özlem Hanım\'ın sosyal pediatri yaklaşımı sayesinde kızımın doktor korkusu tamamen geçti. Randevu almak da çok kolay, asistanları da son derece ilgili ve yardımcı.',
      rating: 5,
      date: '2 ay önce'
    },
    {
      id: 3,
      author: 'Fatma S.',
      initials: 'FS',
      text: 'Çocuğumun sürekli tekrarlanan enfeksiyonu vardı. Dr. Özlem Hanım\'ın doğru teşhisi ve sabırlı tedavisi sayesinde artık çok daha sağlıklı. Hem bilgisi hem de çocuklara karşı yaklaşımı mükemmel. Ailem olarak çok memnunuz.',
      rating: 5,
      date: '1 ay önce'
    },
    {
      id: 4,
      author: 'Ali R.',
      initials: 'AR',
      text: 'Oğlumun büyüme-gelişim takibi için gidiyoruz. Dr. Özlem Hanım her seferinde çok detaylı muayene yapıyor ve merak ettiğimiz her soruyu sabırla yanıtlıyor. Kliniğin atmosferi de çocuklar için çok rahat ve huzurlu.',
      rating: 5,
      date: '3 hafta önce'
    },
    {
      id: 5,
      author: 'Zeynep T.',
      initials: 'ZT',
      text: 'İkiz bebeklerim için başvurduğumuzda Dr. Özlem Hanım bize çok destek oldu. Beslenme sorunlarımızı çözdü ve uyku düzenlerini oturtmamıza yardım etti. Gerçekten deneyimli ve çocuk seven bir doktor. Herkese tavsiye ederim.',
      rating: 5,
      date: '2 hafta önce'
    },
    {
      id: 6,
      author: 'Burak M.',
      initials: 'BM',
      text: 'Çocuğumun aşı takibi için düzenli gidiyoruz. Dr. Özlem Hanım aşılar hakkında çok detaylı bilgi veriyor ve hiç acele etmiyor. Klinikte bekleme süremiz de hiç uzun olmuyor. Randevu sistemi çok düzenli çalışıyor.',
      rating: 5,
      date: '1 hafta önce'
    }
  ];

  get currentTestimonials(): Testimonial[] {
    const testimonials = [];
    for (let i = 0; i < 2; i++) {
      const index = (this.currentTestimonialIndex + i) % this.testimonials.length;
      testimonials.push(this.testimonials[index]);
    }
    return testimonials;
  }

  ngOnInit() {
    this.startTestimonialRotation();
  }

  ngOnDestroy() {
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
    }
  }

  private startTestimonialRotation() {
    this.testimonialInterval = setInterval(() => {
      this.currentTestimonialIndex = (this.currentTestimonialIndex + 2) % this.testimonials.length;
    }, 8000); // Change every 8 seconds
  }

  trackByTestimonialId(index: number, testimonial: Testimonial): number {
    return testimonial.id;
  }
}