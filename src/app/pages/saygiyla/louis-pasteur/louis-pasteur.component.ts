import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-louis-pasteur',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './louis-pasteur.component.html',
  styleUrl: './louis-pasteur.component.css',
})
export class LouisPasteurComponent {
  breadcrumbs = [
    { label: 'Ana Sayfa', link: '/' },
    { label: 'Saygıyla', link: '/saygiyla' },
    { label: 'Louis Pasteur' }
  ];
  timeline = [
    { year: '1822', event: "27 Aralık - Dole, Fransa'da bir deri tabakçısının oğlu olarak doğdu" },
    { year: '1847', event: "École Normale Supérieure'den kimya ve fizik doktorası aldı" },
    { year: '1848', event: 'Kristallerin optik aktivitesi üzerine çığır açan keşfini yaptı' },
    { year: '1857', event: "Lille Üniversitesi'nde Fen Fakültesi dekanı oldu" },
    {
      year: '1862',
      event: 'Kendiliğinden oluşum teorisini çürüten kuğu boyunlu şişe deneyini gerçekleştirdi',
    },
    { year: '1864', event: 'Pastörizasyon yöntemini geliştirdi' },
    { year: '1865', event: 'İpekböceği hastalıklarını çözmeye başladı' },
    { year: '1881', event: 'Şarbon aşısını başarıyla test etti' },
    { year: '1885', event: "6 Temmuz - Joseph Meister'e kuduz aşısını uyguladı" },
    { year: '1888', event: 'Pasteur Enstitüsü kuruldu' },
    { year: '1895', event: '28 Eylül - Paris yakınlarında 72 yaşında vefat etti' },
  ];

  contributions = [
    {
      icon: 'science',
      title: 'Mikrop Teorisi',
      description:
        'Hastalıkların mikroorganizmalardan kaynaklandığını kanıtlayarak modern tıbbın temelini attı.',
    },
    {
      icon: 'vaccines',
      title: 'Aşı Bilimi',
      description:
        'Zayıflatılmış mikroplarla aşı geliştirme yöntemini buldu ve kuduz aşısını keşfetti.',
    },
    {
      icon: 'restaurant',
      title: 'Pastörizasyon',
      description: 'Gıdaları koruma yöntemiyle milyonlarca hayat kurtardı.',
    },
    {
      icon: 'biotech',
      title: 'Sterilizasyon',
      description: 'Cerrahi aletlerin ve tıbbi malzemelerin sterilizasyonunun önemini gösterdi.',
    },
  ];

  quotes = [
    {
      text: 'Şans, hazırlıklı zihinleri tercih eder.',
      context: 'Bilimsel keşifler üzerine',
    },
    {
      text: 'Bilim, hiçbir ülkeye ait değildir, çünkü bilgi insanlığa aittir ve dünyayı aydınlatan meşaledir.',
      context: 'Bilimin evrenselliği üzerine',
    },
    {
      text: 'Çalışmaktan yorulmam, çünkü çalışmalarım meyvelerini veriyor.',
      context: 'Araştırma tutkusu',
    },
    {
      text: 'Hayat, hayattan gelir. Omne vivum ex vivo.',
      context: 'Kendiliğinden oluşum teorisini çürütürken',
    },
    {
      text: 'Bir damla su içinde, bir mikroskop altında, yaşam için savaşan varlıklar vardır.',
      context: 'Mikroorganizmalar üzerine',
    },
    {
      text: 'Bilimin sınırı yoktur, çünkü insan zihni sınırsızdır.',
      context: 'Bilimsel ilerleme üzerine',
    },
  ];

  books = [
    { title: 'Études sur le vin', year: '1866', genre: 'Bilimsel Araştırma' },
    { title: 'Études sur la bière', year: '1876', genre: 'Bilimsel Araştırma' },
    { title: 'Études sur la maladie des vers à soie', year: '1870', genre: 'Hastalık Araştırması' },
  ];
}
