import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Pioneer {
  id: string;
  name: string;
  title: string;
  lifespan: string;
  image?: string;
  contributions: string[];
  quote?: string;
  link: string;
}

@Component({
  selector: 'app-saygiyla',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './saygiyla.html',
  styleUrl: './saygiyla.css'
})
export class SaygiylaComponent {
  pioneers: Pioneer[] = [
    {
      id: 'jonas-salk',
      name: 'Dr. Jonas Salk',
      title: 'Çocuk Felci Aşısının Mucidi',
      lifespan: '1914 - 1995',
      contributions: [
        'Polyo (çocuk felci) aşısını geliştirdi',
        'Milyonlarca çocuğun hayatını kurtardı',
        'Aşı patentini almayarak insanlığa armağan etti',
        'Salk Enstitüsü\'nü kurdu'
      ],
      quote: 'Güneşi patentleyebilir misiniz?',
      link: '/saygiyla/jonas-salk'
    },
    {
      id: 'louis-pasteur',
      name: 'Louis Pasteur',
      title: 'Mikrobiyolojinin Babası',
      lifespan: '1822 - 1895',
      contributions: [
        'Pastörizasyon yöntemini geliştirdi',
        'Kuduz aşısını buldu',
        'Mikrop teorisini kanıtladı',
        'Modern tıbbın temellerini attı'
      ],
      quote: 'Bilim bir ülkeye değil, insanlığa aittir.',
      link: '/saygiyla/louis-pasteur'
    },
    {
      id: 'nils-rosen',
      name: 'Nils Rosén von Rosenstein',
      title: 'Modern Pediatrinin Kurucusu',
      lifespan: '1706 - 1773',
      contributions: [
        'İlk pediatri ders kitabını yazdı',
        'Çocuk hastalıklarını sistematik olarak sınıflandırdı',
        'Çocuk ölüm oranlarının azalmasına katkıda bulundu',
        'Uppsala Üniversitesi\'nde pediatri eğitimini başlattı'
      ],
      quote: 'Çocukların sağlığı, bir ulusun geleceğidir.',
      link: '/saygiyla/nils-rosen'
    },
    {
      id: 'waldo-nelson',
      name: 'Dr. Waldo Nelson',
      title: 'Nelson Pediatri Ders Kitabının Yazarı',
      lifespan: '1898 - 1997',
      contributions: [
        'Nelson Textbook of Pediatrics\'in yazarı',
        'Modern pediatri eğitiminin öncüsü',
        'Çocuk sağlığı araştırmalarına öncülük etti',
        'Pediatri uzmanlık eğitimini standartlaştırdı'
      ],
      link: '/saygiyla/waldo-nelson'
    },
    {
      id: 'ursula-leguin',
      name: 'Ursula K. Le Guin',
      title: 'Yazar ve Düşünür',
      lifespan: '1929 - 2018',
      contributions: [
        'Bilimkurgu ve fantezi edebiyatının öncüsü',
        'Çocuk edebiyatına katkıları',
        'Toplumsal cinsiyet ve eşitlik konularında öncü',
        'Earthsea serisi ile çocuk edebiyatını zenginleştirdi'
      ],
      quote: 'Çocuklar yetişkinlerden daha az ciddi okuyucular değildir.',
      link: '/saygiyla/ursula-leguin'
    }
  ];
}