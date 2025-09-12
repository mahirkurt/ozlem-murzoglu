import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-nils-rosen',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './nils-rosen.component.html',
  styleUrl: './nils-rosen.component.css',
})
export class NilsRosenComponent {
  breadcrumbs = [
    { label: 'Ana Sayfa', link: '/' },
    { label: 'Saygıyla', link: '/saygiyla' },
    { label: 'Nils Rosén' }
  ];
  timeline = [
    { year: '1884', event: "16 Temmuz - İsveç'in Växjö şehrinde doğdu" },
    { year: '1909', event: "Karolinska Institute'den tıp doktoru olarak mezun oldu" },
    { year: '1912', event: 'Pediatri alanında uzmanlık eğitimine başladı' },
    { year: '1920', event: "Stockholm Çocuk Hastanesi'nde çalışmaya başladı" },
    { year: '1928', event: 'Modern inkübatör sistemini geliştirdi' },
    { year: '1935', event: 'Prematüre bebek bakımında devrim yaratacak araştırmaları yayınladı' },
    { year: '1940', event: "Karolinska Institute'de pediatri profesörü oldu" },
    { year: '1945', event: 'İkinci Dünya Savaşı sırasında çocuk sağlığı programları geliştirdi' },
    { year: '1950', event: 'Emekli oldu ancak araştırmalarına devam etti' },
    { year: '1963', event: '26 Şubat - 78 yaşında Stockholm\'de vefat etti' },
  ];

  contributions = [
    {
      icon: 'child_care',
      title: 'Modern İnkübatör Geliştirme',
      description:
        'Prematüre bebeklerin yaşam şansını artıran modern inkübatör sistemini tasarlayarak neonatal tıp alanında devrim yaratttı.',
    },
    {
      icon: 'thermostat',
      title: 'Sıcaklık Kontrolü',
      description: 'Bebeklerin vücut ısısını optimal düzeyde tutacak hassas sıcaklık kontrol sistemleri geliştirdi.',
    },
    {
      icon: 'healing',
      title: 'Neonatal Bakım',
      description: 'Yenidoğan yoğun bakım ünitelerinin temellerini atarak binlerce bebeğin yaşamını kurtardı.',
    },
    {
      icon: 'science',
      title: 'Pediatrik Araştırmalar',
      description: "İsveç'te çocuk sağlığı araştırmalarının gelişmesinde öncü rol oynadı.",
    },
  ];

  quotes = [
    {
      text: 'Prematüre bir bebek için her dakika değerlidir. Modern teknoloji onlara bu zamanı kazandırır.',
      context: 'İnkübatör teknolojisi üzerine',
    },
    {
      text: 'Tıbbın görevi, en savunmasız olanları korumaktır. Prematüre bebekler bunların en başında gelir.',
      context: 'Neonatal tıp üzerine',
    },
    {
      text: 'Bir bebeğin ilk nefesi, tüm insanlığın umududur.',
      context: 'Çocuk sağlığı üzerine',
    },
    {
      text: 'Bilim ve şefkat bir araya geldiğinde, mucizeler yaratılır.',
      context: 'Tıbbi araştırmalar üzerine',
    },
  ];

  books = [
    { title: 'Prematüre Bebek Bakımı', year: '1935', genre: 'Tıbbi Araştırma' },
    { title: 'Modern İnkübatör Sistemleri', year: '1940', genre: 'Teknik El Kitabı' },
    { title: 'Neonatal Tıptan Perspektifler', year: '1955', genre: 'Akademik Çalışma' },
  ];
}