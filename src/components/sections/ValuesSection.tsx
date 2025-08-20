'use client'

import React from 'react'
import { useTranslations } from 'next-intl'

const ValuesSection: React.FC = () => {
  const t = useTranslations('home.values')

  const values = [
    {
      key: 'calming',
      icon: (
        <svg className="value-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: 'primary'
    },
    {
      key: 'empathy',
      icon: (
        <svg className="value-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: 'secondary'
    },
    {
      key: 'professional',
      icon: (
        <svg className="value-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a1.5 1.5 0 011.5 1.5S10.5 14 9 14s-3-1.5-3-3 1.5-1.5 1.5-1.5H9zm6 0h1.5a1.5 1.5 0 011.5 1.5s-1.5 2.5-3 2.5-3-1.5-3-3 1.5-1.5 1.5-1.5H15z" />
        </svg>
      ),
      color: 'tertiary'
    }
  ]

  return (
    <section className="values-section">
      <div className="container">
        <div className="section-content">
          {/* Section Header */}
          <div className="section-header">
            <h2 className="md-sys-typescale-display-small">
              {t('title')}
            </h2>
            <p className="md-sys-typescale-body-large">
              {t('subtitle')}
            </p>
          </div>

          {/* Values Grid */}
          <div className="values-grid">
            {values.map((value) => (
              <div key={value.key} className={`value-card value-card--${value.color}`}>
                {/* Icon */}
                <div className="icon-wrapper">
                  {value.icon}
                </div>

                {/* Title */}
                <h3 className="value-title md-sys-typescale-title-large">
                  {t(`${value.key}.title`)}
                </h3>

                {/* Description */}
                <p className="value-description md-sys-typescale-body-medium">
                  {t(`${value.key}.description`)}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom decoration */}
          <div className="section-decoration">
            <div className="decoration-line"></div>
            <svg className="decoration-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <div className="decoration-line"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .values-section {
          padding: 80px 0;
          background: var(--md-sys-color-surface-container-low);
          position: relative;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .section-content {
          max-width: 1000px;
          margin: 0 auto;
        }

        /* Section Header */
        .section-header {
          text-align: center;
          margin-bottom: 56px;
          animation: fadeInUp 0.6s ease-out;
        }

        .section-header h2 {
          color: var(--md-sys-color-on-surface);
          margin-bottom: 16px;
        }

        .section-header p {
          color: var(--md-sys-color-on-surface-variant);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Values Grid */
        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
          margin-bottom: 56px;
        }

        @media (min-width: 768px) {
          .values-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* Value Card */
        .value-card {
          background: var(--md-sys-color-surface);
          border-radius: var(--md-sys-shape-corner-large);
          padding: 40px 32px;
          text-align: center;
          transition: all var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized);
          box-shadow: var(--md-sys-elevation-level1);
          position: relative;
          overflow: hidden;
          animation: fadeInUp 0.6s ease-out;
          animation-fill-mode: both;
        }

        .value-card:nth-child(1) {
          animation-delay: 0.1s;
        }

        .value-card:nth-child(2) {
          animation-delay: 0.2s;
        }

        .value-card:nth-child(3) {
          animation-delay: 0.3s;
        }

        .value-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--md-sys-color-primary);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized);
        }

        .value-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--md-sys-elevation-level3);
        }

        .value-card:hover::before {
          transform: scaleX(1);
        }

        .value-card--secondary::before {
          background: var(--md-sys-color-secondary);
        }

        .value-card--tertiary::before {
          background: var(--md-sys-color-tertiary);
        }

        /* Icon Wrapper */
        .icon-wrapper {
          width: 72px;
          height: 72px;
          margin: 0 auto 24px;
          border-radius: var(--md-sys-shape-corner-full);
          background: var(--md-sys-color-primary-container);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
        }

        .value-card--secondary .icon-wrapper {
          background: var(--md-sys-color-secondary-container);
        }

        .value-card--tertiary .icon-wrapper {
          background: var(--md-sys-color-tertiary-container);
        }

        .value-card:hover .icon-wrapper {
          transform: scale(1.1) rotate(5deg);
        }

        .value-icon {
          width: 36px;
          height: 36px;
          color: var(--md-sys-color-on-primary-container);
        }

        .value-card--secondary .value-icon {
          color: var(--md-sys-color-on-secondary-container);
        }

        .value-card--tertiary .value-icon {
          color: var(--md-sys-color-on-tertiary-container);
        }

        /* Content */
        .value-title {
          color: var(--md-sys-color-on-surface);
          margin-bottom: 16px;
          font-weight: 600;
        }

        .value-description {
          color: var(--md-sys-color-on-surface-variant);
          line-height: 1.6;
        }

        /* Decoration */
        .section-decoration {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          animation: fadeIn 0.8s ease-out 0.5s;
          animation-fill-mode: both;
        }

        .decoration-line {
          width: 40px;
          height: 1px;
          background: var(--md-sys-color-outline-variant);
        }

        .decoration-icon {
          width: 20px;
          height: 20px;
          color: var(--md-sys-color-on-surface-variant);
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .values-section {
            padding: 60px 0;
          }

          .values-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .value-card {
            padding: 32px 24px;
          }

          .section-header {
            margin-bottom: 40px;
          }

          .section-header h2 {
            font-size: 32px;
          }
        }
      `}</style>
    </section>
  )
}

export { ValuesSection }