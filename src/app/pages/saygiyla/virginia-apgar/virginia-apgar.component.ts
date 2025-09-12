import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../../components/shared/hero-section/hero-section.component';

@Component({
  selector: 'app-virginia-apgar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './virginia-apgar.component.html',
  styleUrl: './virginia-apgar.component.css',
})
export class VirginiaApgarComponent {
  breadcrumbs = [
    { label: 'Ana Sayfa', link: '/' },
    { label: 'Saygıyla', link: '/saygiyla' },
    { label: 'Virginia Apgar' }
  ];
  timeline = [
    { year: '1909', event: "7 Haziran - New Jersey, ABD'de doğdu" },
    { year: '1929', event: "Mount Holyoke College'dan mezun oldu" },
    { year: '1933', event: "Columbia Üniversitesi Tıp Fakültesi'nden mezun oldu" },
    { year: '1937', event: 'Anesteziyoloji uzmanlığına başladı' },
    { year: '1938', event: "Columbia'da anesteziyoloji bölümünü kurdu" },
    { year: '1949', event: "Columbia'da ilk kadın profesör oldu" },
    { year: '1952', event: 'Apgar Skorunu geliştirdi' },
    { year: '1953', event: 'Apgar Skoru yöntemini yayınladı' },
    { year: '1959', event: "Johns Hopkins'te Halk Sağlığı yüksek lisansı yaptı" },
    { year: '1959', event: "March of Dimes'ta çalışmaya başladı" },
    { year: '1973', event: "Ulusal Kadın Onur Listesi'ne girdi" },
    { year: '1974', event: '7 Ağustos - 65 yaşında vefat etti' },
  ];

  contributions = [
    {
      icon: 'child_care',
      title: 'Apgar Skoru',
      description: 'Yenidoğan sağlığını değerlendiren evrensel skorlama sistemini geliştirdi.',
    },
    {
      icon: 'local_hospital',
      title: 'Anesteziyoloji Öncüsü',
      description: 'Anesteziyolojiyi tıbbi bir uzmanlık alanı haline getirdi.',
    },
    {
      icon: 'pregnant_woman',
      title: 'Obstetrik Anestezi',
      description: 'Doğum anestezisinde çığır açan çalışmalar yaptı.',
    },
    {
      icon: 'campaign',
      title: 'Doğum Kusurları Savunucusu',
      description: "March of Dimes'ta doğum kusurlarının önlenmesi için çalıştı.",
    },
  ];

  quotes = [
    {
      text: 'Hiç kimse senden yola koyulmanı beklemez. Sadece git ve yap.',
      context: 'Kadınların tıptaki yeri üzerine',
    },
    {
      text: 'Her bebek yaşama şansını hak eder.',
      context: 'Yenidoğan bakımı üzerine',
    },
    {
      text: 'Doğru yapılan her şey basittir.',
      context: "Apgar Skoru'nun basitliği üzerine",
    },
    {
      text: 'Eğer bir çocuğun hayatını kurtarabiliyorsanız, bütün dünyayı kurtarmış olursunuz.',
      context: 'Pediatrik tıbbın önemi üzerine',
    },
    {
      text: 'Bilim, cinsiyet tanımaz. Sadece merak ve azim tanır.',
      context: 'Bilimde kadın olmak üzerine',
    },
    {
      text: 'En iyi tıp, önleyici tıptır.',
      context: 'Halk sağlığı üzerine',
    },
  ];

  apgarScore = [
    {
      criterion: 'Appearance (Görünüm)',
      score0: 'Tüm vücut soluk/mavi',
      score1: 'Pembe gövde, mavi ekstremiteler',
      score2: 'Tamamen pembe',
    },
    { criterion: 'Pulse (Nabız)', score0: 'Yok', score1: '<100/dk', score2: '>100/dk' },
    {
      criterion: 'Grimace (Refleks)',
      score0: 'Tepki yok',
      score1: 'Yüz buruşturma',
      score2: 'Ağlama, öksürme',
    },
    {
      criterion: 'Activity (Aktivite)',
      score0: 'Gevşek',
      score1: 'Biraz hareket',
      score2: 'Aktif hareket',
    },
    {
      criterion: 'Respiration (Solunum)',
      score0: 'Yok',
      score1: 'Yavaş, düzensiz',
      score2: 'İyi, ağlama',
    },
  ];

  books = [
    { title: 'Is My Baby All Right?', year: '1972', genre: 'Tıbbi Rehber' },
    { title: 'Birth Defects: The Tragedy and the Hope', year: '1967', genre: 'Tıbbi Araştırma' },
    { title: 'Manual of Anesthesia', year: '1954', genre: 'Tıbbi Ders Kitabı' },
  ];
}
