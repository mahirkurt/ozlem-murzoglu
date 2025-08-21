import { HeroSection } from '@/components/sections/HeroSection'
import { ApproachSection } from '@/components/sections/ApproachSection'
import { BlogSection } from '@/components/sections/BlogSection'
import { TestimonialSection } from '@/components/sections/TestimonialSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { unstable_setRequestLocale } from 'next-intl/server'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  unstable_setRequestLocale(locale)
  
  return (
    <>
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
    </>
  )
}