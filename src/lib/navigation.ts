export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

export const navigation: NavItem[] = [
  {
    label: 'Ana Sayfa',
    href: '/',
  },
  {
    label: 'Hakkımızda',
    href: '/hakkimizda',
    children: [
      {
        label: 'Dr. Özlem Murzoğlu',
        href: '/hakkimizda/dr-ozlem-murzoglu',
      },
      {
        label: 'Kliniğimiz',
        href: '/hakkimizda/klinigimiz',
      },
      {
        label: 'Misyon & Vizyon',
        href: '/hakkimizda/misyon-vizyon',
      },
      {
        label: 'Sıkça Sorulan Sorular',
        href: '/sss',
      },
    ],
  },
  {
    label: 'Hizmetlerimiz',
    href: '/hizmetlerimiz',
    children: [
      {
        label: 'Bright Futures - Sağlıklı Çocuk İzlemi',
        href: '/hizmetlerimiz/bright-futures',
      },
      {
        label: 'Sağlıklı Uykular - Uyku Danışmanlığı',
        href: '/hizmetlerimiz/uyku-danismanligi',
      },
      {
        label: 'Triple P - Olumlu Ebeveynlik Programı',
        href: '/hizmetlerimiz/triple-p',
      },
      {
        label: 'Laboratuvar ve Görüntüleme',
        href: '/hizmetlerimiz/laboratuvar-goruntuleme',
      },
      {
        label: 'Aşılama Hizmetleri',
        href: '/hizmetlerimiz/asilama',
      },
      {
        label: 'Online Konsültasyon',
        href: '/hizmetlerimiz/online-konsultasyon',
      },
    ],
  },
  {
    label: 'Makaleler',
    href: '/makaleler',
  },
  {
    label: 'İletişim',
    href: '/iletisim',
  },
  {
    label: 'Randevu',
    href: '/randevu',
  },
]

export const socialLinks = [
  { platform: 'instagram', url: 'https://instagram.com/drozlemmurzoglu' },
  { platform: 'facebook', url: 'https://facebook.com/drozlemmurzoglu' },
  { platform: 'twitter', url: 'https://twitter.com/drozlemmurzoglu' },
  { platform: 'linkedin', url: 'https://linkedin.com/in/drozlemmurzoglu' },
  { platform: 'youtube', url: 'https://youtube.com/@drozlemmurzoglu' },
]

export const contactInfo = {
  phone: '0216 688 44 83',
  mobile: '0546 688 44 83',
  email: 'klinik@drmurzoglu.com',
  address: {
    street: 'Barbaros Mah. Ak Zambak Sok. No:3',
    building: 'Uphill Towers, A Blok - Daire 30',
    district: 'Ataşehir',
    city: 'İstanbul',
    zipCode: '34746',
    country: 'Türkiye',
  },
  workingHours: {
    weekdays: '09:00 - 18:00',
    saturday: '09:00 - 14:00',
    sunday: 'Kapalı',
  },
}