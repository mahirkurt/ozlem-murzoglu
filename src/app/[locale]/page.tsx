import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { unstable_setRequestLocale } from 'next-intl/server'
import { HeroSection } from '@/components/sections/HeroSection'
import { ValuesSection } from '@/components/sections/ValuesSection'
import { ServicesSection } from '@/components/sections/ServicesSection'

interface HomePageProps {
  params: { locale: string }
}

export const metadata: Metadata = {
  title: 'Ana Sayfa',
  description: 'Dr. Özlem Murzoğlu Pediatri Kliniği - Çocuğunuzun sağlıklı büyümesi için güvenilir adres. Modern tıp ile sevgi dolu yaklaşımı birleştiren uzman pediatri hizmetleri.',
  openGraph: {
    title: 'Dr. Özlem Murzoğlu Pediatri Kliniği - Sağlık Peteğim',
    description: 'Çocuğunuzun sağlıklı büyümesi için güvenilir pediatri hizmetleri',
    images: ['/og-home.jpg'],
  },
}

export default function HomePage({ params: { locale } }: HomePageProps) {
  // Enable static rendering
  unstable_setRequestLocale(locale)
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection locale={locale} />
      
      {/* Values Section */}
      <ValuesSection />
      
      {/* Services Section */}
      <ServicesSection locale={locale} />
      
      {/* CTA Section */}
      <section className="py-16 bg-primary-container">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-on-primary-container mb-4">
              {locale === 'tr' 
                ? 'Çocuğunuzun Sağlığı İçin Bugün Başlayın'
                : 'Start Today for Your Child\'s Health'
              }
            </h2>
            <p className="text-xl text-on-primary-container/80 mb-8 max-w-2xl mx-auto">
              {locale === 'tr'
                ? 'Uzman pediatrist Dr. Özlem Murzoğlu ile randevu alın ve çocuğunuzun sağlıklı büyümesine destek olun.'
                : 'Book an appointment with pediatric specialist Dr. Özlem Murzoğlu and support your child\'s healthy growth.'
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-primary text-lg px-8 py-4">
                {locale === 'tr' ? 'Randevu Al' : 'Book Appointment'}
              </button>
              <button className="btn btn-outline text-lg px-8 py-4 border-on-primary-container text-on-primary-container hover:bg-on-primary-container hover:text-primary-container">
                {locale === 'tr' ? 'Ücretsiz Danışmanlık' : 'Free Consultation'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}