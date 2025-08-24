import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { IllustrationComponent } from '../../shared/components/illustration/illustration.component';

interface Service {
  id: string;
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
  icon: string;
  features: string[];
  color: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, ScrollRevealDirective, IllustrationComponent],
  templateUrl: './services.html',
  styleUrl: './services.css'
})
export class ServicesComponent {
  private translate = inject(TranslateService);
  services: Service[] = [
    {
      id: 'laboratuvar-goruntuleme',
      titleKey: 'SERVICES.SERVICE_LAB.TITLE',
      subtitleKey: 'Tanı Hizmetleri',
      descriptionKey: 'SERVICES.SERVICE_LAB.DESC',
      icon: 'biotech',
      color: 'primary',
      features: [
        'Biyokimya testleri',
        'Mikrobiyoloji tetkikleri',
        'COVID-19 ve enfeksiyon testleri',
        'MR, BT, Ultrasonografi',
        'Dijital röntgen',
        'Sigorta provizyon işlemleri'
      ]
    },
    {
      id: 'triple-p',
      titleKey: 'SERVICES.SERVICE_TRIPLE_P.TITLE',
      subtitleKey: 'Olumlu Ebeveynlik Programı',
      descriptionKey: 'SERVICES.SERVICE_TRIPLE_P.DESC',
      icon: 'family_restroom',
      color: 'secondary',
      features: [
        '35+ yıllık deneyim',
        '20+ dilde hizmet',
        '830+ akademik makale',
        'Grup eğitim programları',
        'Davranış yönetimi teknikleri',
        'Pozitif disiplin stratejileri'
      ]
    },
    {
      id: 'saglikli-uykular',
      titleKey: 'SERVICES.SERVICE_SLEEP.TITLE',
      subtitleKey: 'Uyku Eğitimi ve Danışmanlığı',
      descriptionKey: 'SERVICES.SERVICE_SLEEP.DESC',
      icon: 'bedtime',
      color: 'tertiary',
      features: [
        'Ön değerlendirme ve muayene',
        'Kişiselleştirilmiş uyku planı',
        '2 haftalık yoğun takip',
        'Uyku günlüğü desteği',
        'WhatsApp destek hattı',
        'Mezuniyet sonrası takip'
      ]
    },
    {
      id: 'bright-futures-program',
      titleKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.TITLE',
      subtitleKey: 'Amerikan Pediatri Akademisi Sağlıklı Çocuk İzlemi',
      descriptionKey: 'SERVICES.SERVICE_BRIGHT_FUTURES.DESC',
      icon: 'star',
      color: 'primary',
      features: [
        'Ziyaret öncesi hazırlık formları',
        'Minimum 1 saatlik muayene',
        'Yaşa özel bilgilendirme',
        'Gelişimsel tarama testleri',
        'Aile merkezli bakım',
        'Kanıta dayalı yaklaşım'
      ]
    },
    {
      id: 'asi-takibi',
      titleKey: 'SERVICES.SERVICE_VACCINATION.TITLE',
      subtitleKey: 'Ulusal Aşı Takvimi',
      descriptionKey: 'SERVICES.SERVICE_VACCINATION.DESC',
      icon: 'vaccines',
      color: 'secondary',
      features: [
        'Ulusal aşı takvimi takibi',
        'Özel aşı uygulamaları',
        'Aşı sonrası takip',
        'Aşı bilgilendirme',
        'Dijital aşı kartı',
        'Hatırlatma servisi'
      ]
    },
    {
      id: 'gelisim-takibi',
      titleKey: 'SERVICES.SERVICE_GROWTH.TITLE',
      subtitleKey: 'Periyodik Kontroller',
      descriptionKey: 'SERVICES.SERVICE_GROWTH.DESC',
      icon: 'trending_up',
      color: 'tertiary',
      features: [
        'Boy-kilo takibi',
        'Baş çevresi ölçümü',
        'Gelişimsel kilometre taşları',
        'Denver II gelişim testi',
        'Büyüme eğrisi analizi',
        'Erken müdahale programları'
      ]
    }
  ];

  getServicesByRow(): Service[][] {
    const result: Service[][] = [];
    for (let i = 0; i < this.services.length; i += 3) {
      result.push(this.services.slice(i, i + 3));
    }
    return result;
  }
}