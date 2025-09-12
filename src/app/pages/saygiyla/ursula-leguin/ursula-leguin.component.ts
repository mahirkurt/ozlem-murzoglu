import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-ursula-leguin',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './ursula-leguin.component.html',
  styleUrl: './ursula-leguin.component.css',
})
export class UrsulaLeguinComponent {
  breadcrumbs = [
    { label: 'Ana Sayfa', link: '/' },
    { label: 'Saygıyla', link: '/saygiyla' },
    { label: 'Ursula K. Le Guin' }
  ];
  timeline = [
    { year: '1929', event: "Berkeley, California'da doğdu" },
    { year: '1951', event: "Radcliffe College'dan mezun oldu" },
    { year: '1952', event: "Columbia Üniversitesi'nde yüksek lisansını tamamladı" },
    { year: '1968', event: "Yerdeniz Büyücüsü'nü yayınladı" },
    { year: '1969', event: 'Karanlığın Sol Eli ile Hugo ve Nebula ödüllerini kazandı' },
    { year: '1974', event: 'Mülksüzler ile Hugo, Nebula ve Locus ödüllerini kazandı' },
    { year: '2003', event: 'SFWA Grand Master ödülünü aldı' },
    { year: '2018', event: "Portland, Oregon'da vefat etti" },
  ];

  contributions = [
    {
      icon: 'menu_book',
      title: 'Yerdeniz Serisi',
      description:
        'Fantezi edebiyatının en önemli eserlerinden biri olan Yerdeniz serisiyle çocuk ve yetişkin okurları büyüledi.',
    },
    {
      icon: 'diversity_3',
      title: 'Toplumsal Cinsiyet ve Irk',
      description: 'Eserlerinde toplumsal cinsiyet, ırk ve güç ilişkilerini cesurca sorguladı.',
    },
    {
      icon: 'psychology',
      title: 'Felsefi Derinlik',
      description: 'Bilimkurgu ve fantezi türüne felsefi derinlik ve edebi kalite kazandırdı.',
    },
    {
      icon: 'child_care',
      title: 'Çocuk Edebiyatı',
      description: 'Çocukları ciddiye alan, onların zekasına hitap eden eserler yazdı.',
    },
  ];

  quotes = [
    {
      text: 'Yetişkin olmak özgür olmak değildir. Sorumlu olmaktır.',
      context: 'Yerdeniz serisi',
    },
    {
      text: 'Kelimeler eylemlerdir.',
      context: 'Yazarlık üzerine',
    },
    {
      text: 'Aydınlık ile karanlık arasındaki dengeyi bulmak, yaşamın özüdür.',
      context: 'Yerdeniz felsefesi',
    },
    {
      text: 'Çocuk kitapları yazmak, çocukların zekasına saygı göstermektir.',
      context: 'Çocuk edebiyatı üzerine',
    },
  ];

  books = [
    { title: 'Yerdeniz Büyücüsü', year: '1968', genre: 'Fantezi' },
    { title: 'Karanlığın Sol Eli', year: '1969', genre: 'Bilimkurgu' },
    { title: 'Atuan Mezarları', year: '1970', genre: 'Fantezi' },
    { title: 'En Uzak Sahil', year: '1972', genre: 'Fantezi' },
    { title: 'Mülksüzler', year: '1974', genre: 'Bilimkurgu' },
    { title: 'Tehanu', year: '1990', genre: 'Fantezi' },
  ];
}
