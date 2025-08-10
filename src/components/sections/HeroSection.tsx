'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { fadeInUp, stagger, float } from '@/lib/motion'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

interface HeroSectionProps {
  locale: string
}

const HeroSection: React.FC<HeroSectionProps> = ({ locale }) => {
  const t = useTranslations('home.hero')
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true
  })

  return (
    <section 
      ref={ref}
      className="relative bg-gradient-to-br from-surface via-surface-container-low to-primary-container min-h-screen flex items-center overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          variants={float}
          animate="animate"
          className="absolute top-20 right-10 w-32 h-32 bg-brand-accent/10 rounded-full blur-xl"
        />
        <motion.div
          variants={float}
          animate="animate"
          style={{ animationDelay: '1s' }}
          className="absolute bottom-40 left-20 w-48 h-48 bg-primary/10 rounded-full blur-xl"
        />
        <motion.div
          variants={float}
          animate="animate"
          style={{ animationDelay: '2s' }}
          className="absolute top-1/2 left-1/3 w-24 h-24 bg-secondary/10 rounded-full blur-xl"
        />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Content */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            className="space-y-6"
          >
            <motion.div variants={fadeInUp} className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-on-surface leading-tight">
                {t('title')}
              </h1>
              
              <h2 className="text-xl md:text-2xl text-primary font-medium">
                {t('subtitle')}
              </h2>
              
              <p className="text-lg text-on-surface-variant max-w-2xl">
                {t('description')}
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <Button
                href={`/${locale}/appointment`}
                variant="primary"
                size="lg"
                className="text-lg px-8 py-4"
              >
                {t('cta.appointment')}
              </Button>
              
              <Button
                href={`/${locale}/services`}
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4"
              >
                {t('cta.services')}
              </Button>
            </motion.div>

            {/* Emergency Button */}
            <motion.div variants={fadeInUp}>
              <a
                href={`tel:${process.env.NEXT_PUBLIC_EMERGENCY_PHONE || '+90 555 123 4568'}`}
                className="inline-flex items-center space-x-2 text-error hover:text-error/80 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>{t('cta.emergency')}: {process.env.NEXT_PUBLIC_EMERGENCY_PHONE}</span>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeInUp} className="pt-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { key: 'experience', value: '15+' },
                  { key: 'patients', value: '5000+' },
                  { key: 'services', value: '20+' },
                  { key: 'availability', value: '7/24' }
                ].map((stat) => (
                  <div key={stat.key} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-on-surface-variant">
                      {t(`stats.${stat.key}`)}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-elevation-3">
              <Image
                src="/hero-doctor.jpg"
                alt="Dr. Özlem Murzoğlu"
                width={600}
                height={800}
                className="w-full h-auto object-cover"
                priority
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
              
              {/* Floating Elements */}
              <motion.div
                variants={float}
                animate="animate"
                className="absolute -top-6 -right-6 bg-brand-accent p-4 rounded-full shadow-elevation-2"
              >
                <svg className="w-8 h-8 text-on-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 47.48 47.48 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662C3.18 8.54 1.5 10.476 1.5 12.85V14a2 2 0 1 0 4 0v-1.15c0-.48.952-1.85 2.5-1.85s2.5 1.37 2.5 1.85V14a2 2 0 1 0 4 0v-1.15c0-.48.952-1.85 2.5-1.85s2.5 1.37 2.5 1.85V14a2 2 0 1 0 4 0v-1.15c0-2.374-1.68-4.31-3.862-4.75-.014-.221-.029-.442-.046-.662A4.006 4.006 0 0 0 16.838 4.638a47.48 47.48 0 0 0-7.324 0z"/>
                </svg>
              </motion.div>

              <motion.div
                variants={float}
                animate="animate"
                style={{ animationDelay: '1.5s' }}
                className="absolute -bottom-4 -left-4 bg-primary p-3 rounded-full shadow-elevation-2"
              >
                <svg className="w-6 h-6 text-on-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.25-4.836.002-.006-.002.006Zm.384.835a3.75 3.75 0 0 1-2.134 2.134 3.75 3.75 0 0 1-2.134-2.134 3.75 3.75 0 0 1 2.134-2.134 3.75 3.75 0 0 1 2.134 2.134ZM16.5 12V9a1.5 1.5 0 0 0-1.5-1.5h-6A1.5 1.5 0 0 0 7.5 9v3a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5Z"/>
                </svg>
              </motion.div>
            </div>

            {/* Trust indicators */}
            <motion.div
              variants={fadeInUp}
              className="absolute -bottom-8 left-8 right-8"
            >
              <div className="bg-surface/90 backdrop-blur-sm rounded-xl p-4 shadow-elevation-2 border border-outline-variant">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-primary flex items-center justify-center border-2 border-surface text-on-primary text-xs font-bold"
                        >
                          {i}
                        </div>
                      ))}
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-on-surface">
                        {locale === 'tr' ? 'Mutlu aileler' : 'Happy families'}
                      </div>
                      <div className="text-on-surface-variant text-xs">5000+ çocuk</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-brand-accent"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm font-medium text-on-surface ml-1">4.9</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export { HeroSection }