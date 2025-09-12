import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-ihsan-dogramaci',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './ihsan-dogramaci.component.html',
  styleUrl: './ihsan-dogramaci.component.css',
})
export class IhsanDogramaciComponent {
  breadcrumbs = [
    { label: 'Ana Sayfa', link: '/' },
    { label: 'Saygıyla', link: '/saygiyla' },
    { label: 'İhsan Doğramacı' }
  ];
  timeline = [
    { year: '1915', event: "3 Nisan - Erbil'de doğdu" },
    { year: '1938', event: "İstanbul Üniversitesi Tıp Fakültesi'nden mezun oldu" },
    { year: '1940', event: "Washington Üniversitesi'nde pediatri ihtisasına başladı" },
    {
      year: '1946',
      event: "Ankara Üniversitesi Tıp Fakültesi'nde Çocuk Sağlığı ve Hastalıkları Kürsüsü'nü kurdu",
    },
    { year: '1958', event: "Hacettepe Çocuk Sağlığı Enstitüsü'nü kurdu" },
    { year: '1963', event: "Hacettepe Üniversitesi'nin kuruluşuna öncülük etti" },
    { year: '1967', event: "Hacettepe Üniversitesi'nin ilk rektörü oldu" },
    { year: '1973', event: 'Dünya Sağlık Örgütü Yönetim Kurulu üyeliğine seçildi' },
    { year: '1975', event: 'Dünya Sağlık Örgütü Yönetim Kurulu Başkanı oldu' },
    { year: '1980', event: "YÖK'ün kuruluşunda görev aldı ve ilk başkanı oldu" },
    { year: '1984', event: "Bilkent Üniversitesi'ni kurdu" },
    { year: '1986', event: 'UNICEF İcra Kurulu Başkanı seçildi' },
    { year: '2010', event: "25 Şubat - 94 yaşında Ankara'da vefat etti" },
  ];

  contributions = [
    {
      icon: 'healing',
      title: 'Çocuk Sağlığı Öncüsü',
      description:
        "Türkiye'de modern pediatrinin kurucusu ve bebek ölüm oranlarının azaltılmasında öncü rol oynadı.",
    },
    {
      icon: 'school',
      title: 'Eğitim Reformcusu',
      description:
        "Hacettepe ve Bilkent Üniversitelerini kurarak Türkiye'de yükseköğretimi dönüştürdü.",
    },
    {
      icon: 'account_balance',
      title: 'Kurum İnşa Edici',
      description:
        "YÖK'ün kuruluşunda rol alarak Türk yükseköğretim sistemini yeniden yapılandırdı.",
    },
    {
      icon: 'public',
      title: 'Uluslararası Lider',
      description:
        "WHO ve UNICEF'te üst düzey görevlerde bulunarak küresel sağlık politikalarına yön verdi.",
    },
  ];

  quotes = [
    {
      text: 'Daha ileriye, en iyiye.',
      context: 'Hacettepe Üniversitesi mottosu',
    },
    {
      text: 'Bir milletin geleceği, çocuklarının sağlığı ile başlar.',
      context: 'Çocuk sağlığı üzerine',
    },
    {
      text: 'Eğitim, bir ülkenin kalkınmasının temelidir.',
      context: 'Eğitimin önemi üzerine',
    },
    {
      text: 'Kurumlar insanlardan daha uzun yaşar, onları iyi kurmak gerekir.',
      context: 'Kurumsal yapılanma üzerine',
    },
    {
      text: 'Bilim evrenseldir, ama bilim insanının vatanı vardır.',
      context: 'Bilim ve vatan sevgisi üzerine',
    },
    {
      text: 'Başarının sırrı, hayalleri gerçeğe dönüştürecek azim ve çalışmadır.',
      context: 'Başarı felsefesi',
    },
  ];

  books = [
    { title: 'Hacettepe Çocuk Sağlığı Enstitüsü', year: '1958', genre: 'Kuruluş' },
    { title: 'Hacettepe Üniversitesi', year: '1967', genre: 'Kuruluş' },
    { title: 'YÖK Başkanlığı', year: '1980-1982', genre: 'Görev' },
    { title: 'Bilkent Üniversitesi', year: '1984', genre: 'Kuruluş' },
  ];
}
