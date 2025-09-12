import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-jonas-salk',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './jonas-salk.component.html',
  styleUrl: './jonas-salk.component.css',
})
export class JonasSalkComponent {
  breadcrumbs = [
    { label: 'Ana Sayfa', link: '/' },
    { label: 'Saygıyla', link: '/saygiyla' },
    { label: 'Jonas Salk' }
  ];
  timeline = [
    { year: '1914', event: "28 Ekim - New York'ta Rus-Yahudi göçmen ailenin çocuğu olarak doğdu" },
    { year: '1939', event: "New York Üniversitesi Tıp Fakültesi'nden mezun oldu" },
    { year: '1942', event: 'Thomas Francis Jr. ile influenza aşısı üzerinde çalışmaya başladı' },
    { year: '1947', event: "Pittsburgh Üniversitesi'nde kendi laboratuvarını kurdu" },
    { year: '1952', event: 'İlk başarılı polio aşı denemelerini gerçekleştirdi' },
    { year: '1953', event: 'Aşıyı kendi ailesi üzerinde denedi' },
    { year: '1954', event: '2 milyon çocukla tarihin en büyük tıbbi deneyi başladı' },
    { year: '1955', event: '12 Nisan - Polio aşısının başarısı dünyaya duyuruldu' },
    { year: '1963', event: "La Jolla'da Salk Biyolojik Araştırmalar Enstitüsü'nü kurdu" },
    { year: '1995', event: "23 Haziran - La Jolla, California'da 80 yaşında vefat etti" },
  ];

  contributions = [
    {
      icon: 'vaccines',
      title: 'Polio Aşısı',
      description: 'Milyonlarca çocuğu felçten koruyan ilk etkili polio aşısını geliştirdi.',
    },
    {
      icon: 'public',
      title: 'Patent Almama Kararı',
      description: 'Aşıyı patentlemeyerek tüm insanlığın erişimine açık bıraktı.',
    },
    {
      icon: 'biotech',
      title: 'Salk Enstitüsü',
      description: 'Biyolojik araştırmalar için öncü bir enstitü kurdu.',
    },
    {
      icon: 'science',
      title: 'AIDS Araştırmaları',
      description: 'Hayatının son yıllarında AIDS aşısı üzerinde çalıştı.',
    },
  ];

  quotes = [
    {
      text: 'Peki, insanlara ait diyebilirim. Patenti yok. Güneşi patentleyebilir misiniz?',
      context: "Edward R. Murrow'a verdiği röportajda",
    },
    {
      text: 'En büyük ödül, insanlığa hizmet etmektir.',
      context: 'Yaşam felsefesi üzerine',
    },
    {
      text: 'Umut, hayal ve ısrar ile her şey mümkündür.',
      context: 'Bilimsel araştırmalar hakkında',
    },
    {
      text: 'İnsanların acısını dindirmek için bilimi bir araç olarak kullanmak.',
      context: 'Tıp fakültesindeki hedefi',
    },
    {
      text: 'Hastalıkları tek tek tedavi etmek yerine, onları tamamen ortadan kaldırmanın yollarını arıyorum.',
      context: 'Araştırma vizyonu',
    },
    {
      text: 'Bilimin amacı insanlığın hizmetinde olmaktır.',
      context: 'Bilim anlayışı',
    },
  ];

  books = [
    { title: "Man Unfolding", year: '1972', genre: 'Bilim Felsefesi' },
    { title: 'Anatomy of Reality', year: '1983', genre: 'Bilim Felsefesi' },
    { title: 'The Survival of the Wisest', year: '1973', genre: 'Toplumsal Görüş' },
  ];
}
