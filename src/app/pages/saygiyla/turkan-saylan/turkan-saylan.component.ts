import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-turkan-saylan',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './turkan-saylan.component.html',
  styleUrl: './turkan-saylan.component.css',
})
export class TurkanSaylanComponent {
  breadcrumbs = [
    { label: 'Ana Sayfa', link: '/' },
    { label: 'Saygıyla', link: '/saygiyla' },
    { label: 'Türkan Saylan' }
  ];
  timeline = [
    { year: '1935', event: "3 Mayıs - İstanbul'da doğdu" },
    { year: '1963', event: "İstanbul Üniversitesi Tıp Fakültesi'nden mezun oldu" },
    { year: '1968', event: 'Deri ve Zührevi Hastalıklar uzmanlığını tamamladı' },
    { year: '1976', event: "İstanbul Üniversitesi'nde doçent oldu" },
    { year: '1982', event: 'Profesör unvanını aldı' },
    { year: '1988', event: "İstanbul Lepra Hastanesi'nin başhekimi oldu" },
    { year: '1989', event: "Çağdaş Yaşamı Destekleme Derneği'ni (ÇYDD) kurdu" },
    { year: '1991', event: 'Kardelenler projesi başladı' },
    { year: '2009', event: 'Ergenekon davası kapsamında gözaltına alındı' },
    { year: '2009', event: '18 Mayıs - 74 yaşında vefat etti' },
  ];

  contributions = [
    {
      icon: 'healing',
      title: 'Lepra ile Mücadele',
      description:
        "Türkiye'de lepra hastalığının tedavisi ve toplumsal önyargılarla mücadelede öncü oldu.",
    },
    {
      icon: 'school',
      title: 'Kız Çocuklarının Eğitimi',
      description: 'ÇYDD ve Kardelenler projesiyle binlerce kız çocuğunun eğitim almasını sağladı.',
    },
    {
      icon: 'volunteer_activism',
      title: 'Toplumsal Dönüşüm',
      description: 'Eğitim yoluyla toplumsal kalkınma ve çağdaşlaşma için ömür boyu mücadele etti.',
    },
    {
      icon: 'groups',
      title: 'Sivil Toplum Öncüsü',
      description: "Türkiye'nin en etkili sivil toplum örgütlerinden birini kurdu ve yönetti.",
    },
  ];

  quotes = [
    {
      text: 'Benim tek derdim, kız çocuklarımızın okuyabilmesi.',
      context: 'Eğitim mücadelesi üzerine',
    },
    {
      text: 'Bir ülkenin gelişmişlik düzeyi, kadınlarının statüsüyle ölçülür.',
      context: 'Kadın hakları üzerine',
    },
    {
      text: 'Eğitim, karanlıkları aydınlatan tek ışıktır.',
      context: 'Eğitimin önemi üzerine',
    },
    {
      text: 'Çocuklar bizim geleceğimiz, onlara yatırım yapmak en büyük görevimiz.',
      context: 'Gelecek nesiller üzerine',
    },
    {
      text: 'Bilim ve akıl, her şeyin üstündedir.',
      context: 'Bilimsel düşünce üzerine',
    },
    {
      text: 'Korkmayın, düşünün ve üretin.',
      context: 'Gençlere mesajı',
    },
  ];

  books = [
    { title: "Cumhuriyet'in Kızları", year: '2006', genre: 'Anı/Deneme' },
    { title: 'Gözlerim Kapalı Uçtum', year: '2008', genre: 'Otobiyografi' },
    {
      title: 'Türkan Saylan: Yaşamı ve Yapıtı',
      year: '2010',
      genre: 'Biyografi (Ölümünden sonra)',
    },
  ];
}
