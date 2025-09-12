import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-malala-yousafzai',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './malala-yousafzai.component.html',
  styleUrl: './malala-yousafzai.component.css',
})
export class MalalaYousafzaiComponent {
  breadcrumbs = [
    { label: 'Ana Sayfa', link: '/' },
    { label: 'Saygıyla', link: '/saygiyla' },
    { label: 'Malala Yousafzai' }
  ];
  timeline = [
    { year: '1997', event: "12 Temmuz - Pakistan'ın Swat Vadisi'nde doğdu" },
    { year: '2008', event: "Taliban Swat Vadisi'ni ele geçirdi, kız okullarını kapatmaya başladı" },
    { year: '2009', event: 'BBC Urdu için "Gül Makai" takma adıyla blog yazmaya başladı' },
    { year: '2011', event: "Pakistan'ın ilk Ulusal Gençlik Barış Ödülü'nü kazandı" },
    { year: '2012', event: 'New York Times belgeselinde yer aldı' },
    { year: '2012', event: '9 Ekim - Taliban tarafından vuruldu' },
    { year: '2013', event: "12 Temmuz - BM'de konuşma yaptı (Malala Günü)" },
    { year: '2013', event: 'Otobiyografisi "Ben Malala" yayınlandı' },
    { year: '2013', event: 'Malala Fonu kuruldu' },
    { year: '2014', event: "Nobel Barış Ödülü'nü kazandı (en genç Nobel ödüllü)" },
    { year: '2017', event: 'BM Barış Elçisi oldu' },
    { year: '2020', event: "Oxford Üniversitesi'nden mezun oldu" },
    { year: '2021', event: 'Asser Malik ile evlendi' },
  ];

  contributions = [
    {
      icon: 'school',
      title: 'Eğitim Savunucusu',
      description: 'Kız çocuklarının eğitim hakkı için küresel bir ses oldu.',
    },
    {
      icon: 'campaign',
      title: 'Malala Fonu',
      description: '12 yıllık ücretsiz, güvenli ve kaliteli eğitim için çalışan vakfı kurdu.',
    },
    {
      icon: 'public',
      title: 'Küresel Aktivist',
      description: 'Dünya liderleriyle görüşerek eğitim politikalarını etkiledi.',
    },
    {
      icon: 'auto_stories',
      title: 'Yazar ve Konuşmacı',
      description: 'Kitapları ve konuşmalarıyla milyonlara ilham verdi.',
    },
  ];

  quotes = [
    {
      text: 'Bir çocuk, bir öğretmen, bir kitap ve bir kalem dünyayı değiştirebilir.',
      context: 'BM konuşması, 2013',
    },
    {
      text: 'Eğitim bir lüks değil, bir zorunluluktur.',
      context: 'Eğitim hakkı üzerine',
    },
    {
      text: 'Ben sadece haklarım için konuşan bir kızım. Eğitim hakkım, barış içinde yaşama hakkım, eşit muamele görme hakkım.',
      context: 'BBC röportajı',
    },
    {
      text: 'Zayıflık, korku ve umutsuzluk öldü. Güç, cesaret ve şevk doğdu.',
      context: 'Saldırıdan sonra',
    },
    {
      text: 'Teröristler kitaplarımdan ve kalemlerimden korkuyorlar. Eğitimin gücü onları korkutuyor.',
      context: "Taliban'a mesajı",
    },
    {
      text: 'Sessiz kaldığımızda öldürülürüz. Konuştuğumuzda da öldürülürüz. O zaman konuşalım.',
      context: 'Cesaret üzerine',
    },
  ];

  books = [
    { title: 'Ben Malala (I Am Malala)', year: '2013', genre: 'Otobiyografi' },
    { title: "Malala'nın Sihirli Kalemi", year: '2017', genre: 'Çocuk Kitabı' },
    { title: 'Yer Açın: 12 Kadının Değişim Hikayeleri', year: '2019', genre: 'Biyografi' },
  ];
}
