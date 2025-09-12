import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-ataturk',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './ataturk.component.html',
  styleUrl: './ataturk.component.css',
})
export class AtaturkComponent {
  breadcrumbs = [
    { label: 'Ana Sayfa', link: '/' },
    { label: 'Saygıyla', link: '/saygiyla' },
    { label: 'Mustafa Kemal Atatürk' }
  ];
  timeline = [
    { year: '1881', event: "19 Mayıs - Selanik'te doğdu" },
    { year: '1899', event: "İstanbul Harbiye Askeri İdadisi'nden mezun oldu" },
    { year: '1905', event: "Harbiye Nezareti'nde Kurmay Yüzbaşı oldu" },
    { year: '1915', event: 'Çanakkale Cephesi\'nde kahramanlık gösterdi' },
    { year: '1919', event: "19 Mayıs - Samsun'a çıkarak Kurtuluş Savaşı'nı başlattı" },
    { year: '1920', event: "23 Nisan - Türkiye Büyük Millet Meclisi'ni açtı" },
    { year: '1923', event: "29 Ekim - Türkiye Cumhuriyeti'ni kurdu" },
    { year: '1924', event: 'Halifeliği kaldırdı' },
    { year: '1928', event: 'Harf Devrimi\'ni gerçekleştirdi' },
    { year: '1934', event: '"Atatürk" soyadını aldı' },
    { year: '1938', event: '10 Kasım - 57 yaşında vefat etti' },
  ];

  contributions = [
    {
      icon: 'military_tech',
      title: 'Kurtuluş Savaşı Lideri',
      description:
        "Türk milletinin bağımsızlık mücadelesini örgütleyerek zafere ulaştırdı.",
    },
    {
      icon: 'account_balance',
      title: 'Cumhuriyet\'in Kurucusu',
      description: 'Modern, laik, demokratik Türkiye Cumhuriyeti\'ni kurdu.',
    },
    {
      icon: 'school',
      title: 'Eğitim Devrimcisi',
      description: 'Harf Devrimi ile eğitimi halka yaydı, okuma-yazma seferberliği başlattı.',
    },
    {
      icon: 'diversity_1',
      title: 'Kadın Hakları Öncüsü',
      description: "Kadınlara eşit haklar tanıyarak toplumsal dönüşümün liderliğini yaptı.",
    },
  ];

  quotes = [
    {
      text: 'Hayatta en hakiki mürşit ilimdir.',
      context: 'Eğitim ve ilim üzerine',
    },
    {
      text: 'Egemenlik kayıtsız şartsız milletindir.',
      context: 'Demokrasi ve egemenlik üzerine',
    },
    {
      text: 'Yurtta sulh, cihanda sulh.',
      context: 'Barış ve diplomasi üzerine',
    },
    {
      text: 'Ne mutlu Türküm diyene!',
      context: 'Millî kimlik üzerine',
    },
    {
      text: 'Geleceğin çocukları, tarihlerinizi yazarken...',
      context: 'Gelecek nesillere mesaj',
    },
    {
      text: 'Benim naçiz vücudum elbet bir gün toprak olacaktır, ancak Türkiye Cumhuriyeti ilelebet payidar kalacaktır.',
      context: 'Cumhuriyet\'in sürekliliği üzerine',
    },
  ];

  books = [
    { title: "Nutuk", year: '1927', genre: 'Tarihî Belge' },
    { title: 'Geometri', year: '1937', genre: 'Ders Kitabı' },
    { title: 'Vatandaş İçin Medeni Bilgiler', year: '1930', genre: 'Eğitim' },
  ];
}