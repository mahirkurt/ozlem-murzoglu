import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

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
  imports: [CommonModule, RouterModule, ScrollRevealDirective],
  templateUrl: './services.html',
  styleUrl: './services.css'
})
export class ServicesComponent {
  services: Service[] = [
    {
      id: 'bright-futures',
      title: 'Bright Futures®',
      subtitle: 'Sağlıklı Çocuk İzlemi Programı',
      description: 'Amerikan Pediatri Akademisi tarafından geliştirilen, bebeklikten ergenliğe kadar çocuğunuzun sağlıklı büyüme ve gelişimini takip eden kapsamlı bir programdır.',
      icon: 'star',
      color: 'primary',
      features: [
        'Kanıta dayalı ve sistematik yaklaşım',
        'Her yaş grubuna özel değerlendirme formları',
        'Aile merkezli bakım',
        'Gelişimsel tarama ve değerlendirme',
        'Önleyici sağlık hizmetleri',
        'Minimum 1 saatlik kapsamlı muayene'
      ]
    },
    {
      id: 'saglikli-uykular',
      title: 'Sağlıklı Uykular™',
      subtitle: 'Uyku Danışmanlığı',
      description: 'Bebeğinizin ve çocuğunuzun sağlıklı uyku alışkanlıkları edinmesi için özel olarak tasarlanmış uyku danışmanlığı programı.',
      icon: 'bedtime',
      color: 'secondary',
      features: [
        'Yaşa uygun uyku planlaması',
        'Uyku problemlerinin çözümü',
        'Aile eğitimi ve desteği',
        'Güvenli uyku ortamı oluşturma',
        'SIDS önleme stratejileri',
        'Kişiselleştirilmiş uyku programları'
      ]
    },
    {
      id: 'triple-p',
      title: 'Triple P®',
      subtitle: 'Pozitif Ebeveynlik Programı',
      description: 'Dünya çapında kabul görmüş, kanıta dayalı pozitif ebeveynlik programı ile aile ilişkilerinizi güçlendirin.',
      icon: 'family_restroom',
      color: 'tertiary',
      features: [
        'Davranış yönetimi teknikleri',
        'Pozitif disiplin stratejileri',
        'Ebeveyn-çocuk iletişimi',
        'Problem çözme becerileri',
        'Stres yönetimi',
        'Bireysel veya grup seansları'
      ]
    },
    {
      id: 'laboratuvar',
      title: 'Laboratuvar ve Görüntüleme',
      subtitle: 'Tanı Hizmetleri',
      description: 'Modern cihazlarla donatılmış laboratuvarımızda hızlı ve güvenilir sonuçlar.',
      icon: 'biotech',
      color: 'primary',
      features: [
        'Kan tetkikleri',
        'İdrar tahlilleri',
        'Boğaz kültürü',
        'Hızlı test uygulamaları',
        'Ultrasonografi',
        'Alerji testleri'
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