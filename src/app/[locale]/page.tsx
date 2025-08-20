'use client'

import { HeroSection } from '@/components/sections/HeroSection'
import { ApproachSection } from '@/components/sections/ApproachSection'
import { BlogSection } from '@/components/sections/BlogSection'
import { TestimonialSection } from '@/components/sections/TestimonialSection'
import { ServicesSection } from '@/components/sections/ServicesSection'

interface HomePageProps {
  params: { locale: string }
}

export default function HomePage({ params: { locale } }: HomePageProps) {
  
  return (
    <div className="homepage">
      {/* Hero Section with Welcome Message */}
      <HeroSection locale={locale} />
      
      {/* Approach & Navigation Blocks */}
      <ApproachSection />
      
      {/* Blog Posts Section */}
      <BlogSection />
      
      {/* Google Reviews Testimonial */}
      <TestimonialSection />
      
      {/* Services Overview */}
      <ServicesSection locale={locale} />

      <style jsx>{`
        .homepage {
          min-height: 100vh;
          background: var(--md-sys-color-surface);
          padding-top: 120px; /* Header offset */
        }

        @media (min-width: 968px) {
          .homepage {
            padding-top: 140px; /* Desktop header with top bar */
          }
        }
      `}</style>
    </div>
  )
}