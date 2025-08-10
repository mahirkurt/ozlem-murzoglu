import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { unstable_setRequestLocale } from 'next-intl/server'
import { HeroSection } from '@/components/sections/HeroSection'
import { ApproachSection } from '@/components/sections/ApproachSection'
import { BlogSection } from '@/components/sections/BlogSection'
import { TestimonialSection } from '@/components/sections/TestimonialSection'
import { ValuesSection } from '@/components/sections/ValuesSection'
import { ServicesSection } from '@/components/sections/ServicesSection'

interface HomePageProps {
  params: { locale: string }
}

export const metadata: Metadata = {
  title: 'Ana Sayfa',
  description: 'Dr. Özlem Murzoğlu Pediatri Kliniği - Sosyal Pediatri ve Çocuk Gelişimi uzmanlıklarını bütünleştiren, çocuğunuza özel bütüncül bakım.',
  openGraph: {
    title: 'Dr. Özlem Murzoğlu Pediatri Kliniği',
    description: 'Çocuğunuzun sağlıklı büyümesi için güvenilir pediatri hizmetleri',
    images: ['/og-home.jpg'],
  },
}

export default function HomePage({ params: { locale } }: HomePageProps) {
  // Enable static rendering
  unstable_setRequestLocale(locale)
  
  return (
    <div className="homepage">
      {/* Hero Section with Welcome Message */}
      <HeroSection locale={locale} />
      
      {/* Approach & Navigation Blocks */}
      <ApproachSection />
      
      {/* Values Section */}
      <ValuesSection />
      
      {/* Blog Posts Section */}
      <BlogSection />
      
      {/* Google Reviews Testimonial */}
      <TestimonialSection />
      
      {/* Services Overview */}
      <ServicesSection locale={locale} />
      
      {/* Final CTA Section */}
      <section className="final-cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">
              Çocuğunuzun Sağlığı İçin İlk Adımı Atın
            </h2>
            <p className="cta-subtitle">
              15 yıllık deneyimimizle, çocuğunuzun sağlıklı büyümesi ve gelişimi için yanınızdayız.
            </p>
            
            <div className="cta-buttons">
              <a href="/randevu" className="btn-cta-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                </svg>
                <span>Hemen Randevu Al</span>
              </a>
              
              <a href="https://saglikpetegim.com" target="_blank" rel="noopener noreferrer" className="btn-cta-secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>Hasta Girişi</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .homepage {
          min-height: 100vh;
          background: var(--md-sys-color-surface);
        }

        .final-cta {
          padding: 5rem 0;
          background: linear-gradient(135deg, 
            var(--md-sys-color-primary-container) 0%, 
            var(--md-sys-color-secondary-container) 100%
          );
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .cta-content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }

        .cta-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--md-sys-color-on-primary-container);
          margin-bottom: 1rem;
        }

        .cta-subtitle {
          font-size: 1.25rem;
          color: var(--md-sys-color-on-primary-container);
          opacity: 0.9;
          margin-bottom: 2rem;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-cta-primary,
        .btn-cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          border-radius: 28px;
          font-weight: 600;
          font-size: 1rem;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-cta-primary {
          background: var(--md-sys-color-primary);
          color: var(--md-sys-color-on-primary);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .btn-cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }

        .btn-cta-secondary {
          background: white;
          color: var(--md-sys-color-primary);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .btn-cta-secondary:hover {
          background: var(--md-sys-color-surface);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        @media (max-width: 768px) {
          .cta-title {
            font-size: 2rem;
          }

          .cta-subtitle {
            font-size: 1.125rem;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .btn-cta-primary,
          .btn-cta-secondary {
            width: 100%;
            max-width: 300px;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}