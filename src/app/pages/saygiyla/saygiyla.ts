import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../components/shared/hero-section/hero-section.component';

interface Pioneer {
  id: string;
  name: string;
  title: string;
  lifespan: string;
  image?: string;
  contributions: string[];
  quote?: string;
  link: string;
  category?: 'turkish' | 'medical' | 'education';
}

@Component({
  selector: 'app-saygiyla',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeroSectionComponent],
  templateUrl: './saygiyla.html',
  styleUrl: './saygiyla.css'
})
export class SaygiylaComponent {
  breadcrumbs = [
    { label: 'Ana Sayfa', link: '/' },
    { label: 'Saygıyla' }
  ];
  
  pioneers: Pioneer[] = [
    {
      id: 'ataturk',
      name: 'Mustafa Kemal Atatürk',
      title: 'Türkiye Cumhuriyeti\'nin Kurucusu',
      lifespan: '1881 - 1938',
      contributions: [
        'Türkiye Cumhuriyeti\'ni kurdu',
        'Çağdaş eğitim sistemini oluşturdu',
        'Kadın haklarını savundu',
        'Bilim ve aklın öncülüğünü vurguladı'
      ],
      quote: 'Hayatta en hakiki mürşit ilimdir.',
      link: '/saygiyla/ataturk',
      category: 'turkish' as const
    },
    {
      id: 'turkan-saylan',
      name: 'Prof. Dr. Türkan Saylan',
      title: 'Tıp Doktoru ve Eğitim Gönüllüsü',
      lifespan: '1935 - 2009',
      contributions: [
        'Lepra hastalığı ile mücadele',
        'Çağdaş Yaşamı Destekleme Derneği\'ni kurdu',
        'Binlerce kız çocuğunun eğitimi için burs sağladı',
        'Bilimsel düşünceyi yaygınlaştırdı'
      ],
      quote: 'Aydınlık yarınlar, eğitimli gençlerle mümkün.',
      link: '/saygiyla/turkan-saylan',
      category: 'turkish' as const
    },
    {
      id: 'ihsan-dogramaci',
      name: 'Prof. Dr. İhsan Doğramacı',
      title: 'Pediatrist ve Eğitimci',
      lifespan: '1915 - 2010',
      contributions: [
        'Hacettepe Üniversitesi\'ni kurdu',
        'Türkiye\'de çocuk sağlığı hizmetlerini geliştirdi',
        'Bilkent Üniversitesi\'ni kurdu',
        'YÖK\'ün kurucularından'
      ],
      quote: 'Eğitim, bir milletin geleceğe yatırımıdır.',
      link: '/saygiyla/ihsan-dogramaci',
      category: 'turkish' as const
    },
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
      link: '/saygiyla/jonas-salk',
      category: 'medical' as const
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
      link: '/saygiyla/louis-pasteur',
      category: 'medical' as const
    },
    {
      id: 'virginia-apgar',
      name: 'Dr. Virginia Apgar',
      title: 'APGAR Skorunun Yaratıcısı',
      lifespan: '1909 - 1974',
      contributions: [
        'APGAR skorlama sistemini geliştirdi',
        'Yenidoğan ölüm oranlarını azalttı',
        'Perinatal tıbbın öncüsü',
        'Doğum defektleri araştırmalarına öncülük etti'
      ],
      quote: 'Hiç kimse hasta bir bebeğe, bir anne kadar iyi bakamaz.',
      link: '/saygiyla/virginia-apgar',
      category: 'medical' as const
    },
    {
      id: 'malala-yousafzai',
      name: 'Malala Yousafzai',
      title: 'Eğitim Aktivisti ve Nobel Ödüllü',
      lifespan: '1997 - ',
      contributions: [
        'Kız çocuklarının eğitim hakkını savundu',
        'En genç Nobel Barış Ödülü sahibi',
        'Malala Fonu\'nu kurdu',
        'Dünya çapında eğitim aktivisti'
      ],
      quote: 'Bir çocuk, bir öğretmen, bir kitap, bir kalem dünyayı değiştirebilir.',
      link: '/saygiyla/malala-yousafzai',
      category: 'education' as const
    },
    {
      id: 'nils-rosen',
      name: 'Nils Rosén',
      title: 'Modern Kuvöz Sisteminin Öncüsü',
      lifespan: '1884 - 1963',
      contributions: [
        'Modern kuvöz sistemini geliştirdi',
        'Prematüre bebek ölümlerini azalttı',
        'Yenidoğan termoregülasyon araştırmalarının öncüsü',
        'İsveç pediatri okulunun kurucularından'
      ],
      quote: 'Her prematüre bebek, yaşama şansını hak eder.',
      link: '/saygiyla/nils-rosen',
      category: 'medical' as const
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
      quote: 'Pediatri sadece bir tıp dalı değil, geleceğe yatırımdır.',
      link: '/saygiyla/waldo-nelson',
      category: 'medical' as const
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
      link: '/saygiyla/ursula-leguin',
      category: 'education' as const
    }
  ];

  getPioneersByCategory(category: 'turkish' | 'medical' | 'education'): Pioneer[] {
    return this.pioneers.filter(p => p.category === category);
  }

  getInitial(name: string): string {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      // Get the first letter of the second part of the name
      const secondPart = parts[1];
      // Check if it starts with "Dr." or "Prof."
      if (secondPart === 'Dr.' || secondPart === 'Prof.') {
        // Use the next part if available
        return parts.length > 2 ? parts[2][0] : parts[1][0];
      }
      return secondPart[0];
    }
    return name[0];
  }
}