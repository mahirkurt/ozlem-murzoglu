'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { fadeInUp, stagger, cardHover } from '@/lib/motion'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

interface ServicesSectionProps {
  locale: string
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ locale }) => {
  const t = useTranslations('home.services')
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true
  })

  const services = [
    {
      key: 'checkup',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-success',
      bgColor: 'bg-success/10',
      href: `/${locale}/services/checkup`
    },
    {
      key: 'vaccination',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      href: `/${locale}/services/vaccination`
    },
    {
      key: 'illness',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      href: `/${locale}/services/illness`
    },
    {
      key: 'nutrition',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
      color: 'text-brand-accent',
      bgColor: 'bg-brand-accent/10',
      href: `/${locale}/services/nutrition`
    },
    {
      key: 'development',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'text-tertiary',
      bgColor: 'bg-tertiary/10',
      href: `/${locale}/services/development`
    },
    {
      key: 'emergency',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      color: 'text-error',
      bgColor: 'bg-error/10',
      href: `/${locale}/services/emergency`
    }
  ]

  return (
    <section ref={ref} className="py-16 bg-surface">
      <div className="container mx-auto px-4">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">
              {t('title')}
            </h2>
            <p className="text-xl text-on-surface-variant max-w-2xl mx-auto mb-8">
              {t('subtitle')}
            </p>
          </motion.div>

          {/* Services Grid */}
          <motion.div 
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            {services.map((service) => (
              <motion.div key={service.key} variants={fadeInUp}>
                <motion.div
                  variants={cardHover}
                  initial="rest"
                  whileHover="hover"
                  className="h-full"
                >
                  <Card className="h-full group hover:shadow-elevation-3 transition-all duration-300">
                    <CardHeader className="text-center">
                      {/* Service Icon */}
                      <motion.div
                        className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${service.bgColor} ${service.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {service.icon}
                      </motion.div>
                      
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {t(`${service.key}.title`)}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="text-center">
                      <CardDescription className="text-on-surface-variant leading-relaxed mb-6">
                        {t(`${service.key}.description`)}
                      </CardDescription>
                      
                      <Button
                        href={service.href}
                        variant="ghost"
                        size="sm"
                        className="group-hover:text-primary group-hover:bg-primary/10"
                      >
                        {locale === 'tr' ? 'Detaylar' : 'Learn More'}
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* View All Services Button */}
          <motion.div variants={fadeInUp} className="text-center">
            <Button
              href={`/${locale}/services`}
              variant="primary"
              size="lg"
              className="px-8 py-4"
            >
              {t('viewAll')}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </motion.div>

          {/* Background decoration */}
          <motion.div
            variants={fadeInUp}
            className="mt-16 text-center opacity-20"
          >
            <div className="inline-flex items-center space-x-4">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-primary"></div>
              <div className="flex space-x-2">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-primary"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export { ServicesSection }