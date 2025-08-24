import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { IllustrationComponent } from '../../shared/components/illustration/illustration.component';

interface Service {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  features: string[];
  color: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule, ScrollRevealDirective, IllustrationComponent],
  templateUrl: './services.html',
  styleUrl: './services.css'
})
export class ServicesComponent {
  services: Service[] = [
    {
      id: 'laboratuvar-goruntuleme',
      title: 'Laboratuvar ve Görüntüleme',
      subtitle: 'Tanı Hizmetleri',
      description: 'Biruni Laboratuvarları ve Sonomed Görüntüleme ortaklığı ile kapsamlı tanı hizmetleri sunuyoruz.',
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
      title: 'Triple P®',
      subtitle: 'Olumlu Ebeveynlik Programı',
      description: 'Queensland Üniversitesi tarafından geliştirilmiş, 25+ ülkede 4 milyondan fazla aileye ulaşmış dünya çapında kabul görmüş program.',
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
      title: 'Sağlıklı Uykular™',
      subtitle: 'Uyku Eğitimi ve Danışmanlığı',
      description: 'Çocuğunuzun uyku sorunlarını çözen, sağlıklı uyku rutini oluşturan bütüncül yaklaşımlı uyku eğitimi programı.',
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
      title: 'Bright Futures®',
      subtitle: 'Amerikan Pediatri Akademisi Sağlıklı Çocuk İzlemi',
      description: 'AAP standartlarında, bebeklikten yetişkinliğe çocuk sağlığı için bütüncül bir rehberlik programı.',
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
      title: 'Aşı Takibi',
      subtitle: 'Ulusal Aşı Takvimi',
      description: 'Sağlık Bakanlığı\'nın güncel aşı takvimine uygun, düzenli aşılama hizmeti.',
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
      title: 'Büyüme ve Gelişim Takibi',
      subtitle: 'Periyodik Kontroller',
      description: 'Çocuğunuzun fiziksel, zihinsel ve sosyal gelişiminin düzenli takibi.',
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