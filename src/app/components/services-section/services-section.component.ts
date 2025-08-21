import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Service {
  key: string;
  title: string;
  description: string;
  icon: string;
  color: 'primary' | 'secondary' | 'tertiary';
  href: string;
}

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './services-section.component.html',
  styleUrl: './services-section.component.css'
})
export class ServicesSectionComponent {
  @Input() locale: string = 'tr';

  services: Service[] = [
    {
      key: 'checkup',
      title: 'Rutin Kontroller',
      description: 'Büyüme ve gelişim takibi, periyodik muayeneler',
      icon: 'fact_check',
      color: 'primary',
      href: '/hizmetlerimiz/rutin-kontroller'
    },
    {
      key: 'vaccination',
      title: 'Aşılama',
      description: 'Sağlık Bakanlığı aşı takvimi ve özel aşılar',
      icon: 'vaccines',
      color: 'secondary',
      href: '/hizmetlerimiz/asilama'
    },
    {
      key: 'illness',
      title: 'Hastalık Tedavisi',
      description: 'Akut ve kronik çocuk hastalıklarının tanı ve tedavisi',
      icon: 'medical_services',
      color: 'tertiary',
      href: '/hizmetlerimiz/hastalik-tedavisi'
    },
    {
      key: 'nutrition',
      title: 'Beslenme Danışmanlığı',
      description: 'Anne sütü, ek gıda ve beslenme programları',
      icon: 'restaurant',
      color: 'primary',
      href: '/hizmetlerimiz/beslenme-danismanligi'
    },
    {
      key: 'development',
      title: 'Gelişim Değerlendirmesi',
      description: 'Fiziksel ve zihinsel gelişim takibi',
      icon: 'trending_up',
      color: 'secondary',
      href: '/hizmetlerimiz/gelisim-degerlendirmesi'
    },
    {
      key: 'sleep',
      title: 'Uyku Danışmanlığı',
      description: 'Bebek ve çocuk uyku sorunlarına çözüm',
      icon: 'bedtime',
      color: 'tertiary',
      href: '/hizmetlerimiz/uyku-danismanligi'
    }
  ];
}