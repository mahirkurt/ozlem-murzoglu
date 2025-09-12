import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-waldo-nelson',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './waldo-nelson.component.html',
  styleUrl: './waldo-nelson.component.css',
})
export class WaldoNelsonComponent {
  breadcrumbs = [
    { label: 'Ana Sayfa', link: '/' },
    { label: 'Saygıyla', link: '/saygiyla' },
    { label: 'Waldo Nelson' }
  ];
  timeline = [
    { year: '1898', event: "24 Eylül - New York City'de doğdu" },
    { year: '1921', event: "Yale Üniversitesi'nden mezun oldu" },
    { year: '1925', event: "Johns Hopkins Tıp Okulu'ndan doktor olarak mezun oldu" },
    { year: '1927', event: 'Pediatri uzmanlık eğitimini tamamladı' },
    { year: '1930', event: "New York Üniversitesi'nde öğretim görevlisi oldu" },
    { year: '1937', event: 'İlk pediatri ders kitabını yayınladı' },
    { year: '1941', event: "Temple Üniversitesi'nde pediatri bölüm başkanı oldu" },
    { year: '1955', event: 'Nelson Textbook of Pediatrics\'in ilk baskısını çıkardı' },
    { year: '1963', event: "American Academy of Pediatrics'in başkanı oldu" },
    { year: '1997', event: '11 Mart - 98 yaşında Philadelphia\'da vefat etti' },
  ];

  contributions = [
    {
      icon: 'menu_book',
      title: 'Nelson Pediatri Kitabı',
      description:
        'Dünya çapında en kapsamlı ve güvenilir pediatri kaynağı olarak kabul edilen Nelson Textbook of Pediatrics\'i yazdı.',
    },
    {
      icon: 'school',
      title: 'Tıp Eğitimi',
      description: 'Modern pediatri eğitiminin temellerini atarak binlerce doktoru yetiştirdi.',
    },
    {
      icon: 'science',
      title: 'Çocuk Sağlığı Araştırmaları',
      description: 'Çocuk hastalıkları ve gelişimi konusunda öncü araştırmalar yürüttü.',
    },
    {
      icon: 'health_and_safety',
      title: 'Pediatrik Standartlar',
      description: 'Çocuk sağlığı bakımının standartlarını belirlemeye yardımcı oldu.',
    },
  ];

  quotes = [
    {
      text: 'Çocuklar küçük yetişkinler değildir. Onların kendilerine özgü tıbbi ihtiyaçları vardır.',
      context: 'Pediatrik tıp üzerine',
    },
    {
      text: 'İyi bir doktor, hasta çocuğun yanı sıra endişeli ebeveynleri de tedavi eder.',
      context: 'Aile merkezli bakım üzerine',
    },
    {
      text: 'Bilgi güçtür, ancak paylaşılan bilgi çocuk hayatlarını kurtarır.',
      context: 'Tıp eğitimi üzerine',
    },
    {
      text: 'Her çocuk özeldir ve her biri kişiye özel bakım hak eder.',
      context: 'Bireyselleştirilmiş tıp üzerine',
    },
    {
      text: 'Pediatri sadece hastalıkları tedavi etmek değil, sağlıklı büyümeyi desteklemektir.',
      context: 'Çocuk sağlığı felsefesi üzerine',
    },
  ];

  books = [
    { title: 'Pediatrics: Principles and Practice', year: '1937', genre: 'Ders Kitabı' },
    { title: 'Nelson Textbook of Pediatrics (1. Baskı)', year: '1955', genre: 'Kapsamlı Rehber' },
    { title: 'Child Health and Development', year: '1962', genre: 'Araştırma Eseri' },
    { title: 'Modern Approaches in Pediatrics', year: '1970', genre: 'Akademik Yayın' },
  ];
}