'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/Card'
import { fadeInUp, stagger } from '@/lib/motion'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

const ValuesSection: React.FC = () => {
  const t = useTranslations('home.values')
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true
  })

  const values = [
    {
      key: 'calming',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      key: 'empathy',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      key: 'professional',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a1.5 1.5 0 011.5 1.5S10.5 14 9 14s-3-1.5-3-3 1.5-1.5 1.5-1.5H9zm6 0h1.5a1.5 1.5 0 011.5 1.5s-1.5 2.5-3 2.5-3-1.5-3-3 1.5-1.5 1.5-1.5H15z" />
        </svg>
      ),
      color: 'text-brand-accent',
      bgColor: 'bg-brand-accent/10'
    }
  ]

  return (
    <section ref={ref} className="py-16 bg-surface-container-low">
      <div className="container mx-auto px-4">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="max-w-4xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">
              {t('title')}
            </h2>
            <p className="text-xl text-on-surface-variant max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </motion.div>

          {/* Values Grid */}
          <motion.div 
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {values.map((value) => (
              <motion.div key={value.key} variants={fadeInUp}>
                <Card className="h-full text-center hover:shadow-elevation-3 transition-all duration-300 group">
                  <CardContent className="p-8">
                    {/* Icon */}
                    <motion.div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${value.bgColor} ${value.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {value.icon}
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-on-surface mb-4">
                      {t(`${value.key}.title`)}
                    </h3>

                    {/* Description */}
                    <p className="text-on-surface-variant leading-relaxed">
                      {t(`${value.key}.description`)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom decoration */}
          <motion.div variants={fadeInUp} className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 text-on-surface-variant">
              <div className="w-8 h-px bg-outline-variant"></div>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <div className="w-8 h-px bg-outline-variant"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export { ValuesSection }