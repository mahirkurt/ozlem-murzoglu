'use client'

import React from 'react'
import Link from 'next/link'

interface ServicesSectionProps {
  locale: string
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ locale = 'tr' }) => {
  const services = [
    {
      key: 'checkup',
      title: 'Rutin Kontroller',
      description: 'Büyüme ve gelişim takibi, periyodik muayeneler',
      icon: (
        <svg className="service-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'primary',
      href: '/hizmetlerimiz/rutin-kontroller'
    },
    {
      key: 'vaccination',
      title: 'Aşılama',
      description: 'Sağlık Bakanlığı aşı takvimi ve özel aşılar',
      icon: (
        <svg className="service-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      color: 'secondary',
      href: '/hizmetlerimiz/asilama'
    },
    {
      key: 'illness',
      title: 'Hastalık Tedavisi',
      description: 'Akut ve kronik çocuk hastalıklarının tanı ve tedavisi',
      icon: (
        <svg className="service-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: 'tertiary',
      href: '/hizmetlerimiz/hastalik-tedavisi'
    },
    {
      key: 'nutrition',
      title: 'Beslenme Danışmanlığı',
      description: 'Anne sütü, ek gıda ve beslenme programları',
      icon: (
        <svg className="service-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
      color: 'primary',
      href: '/hizmetlerimiz/beslenme-danismanligi'
    },
    {
      key: 'development',
      title: 'Gelişim Değerlendirmesi',
      description: 'Fiziksel ve zihinsel gelişim takibi',
      icon: (
        <svg className="service-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'secondary',
      href: '/hizmetlerimiz/gelisim-degerlendirmesi'
    },
    {
      key: 'sleep',
      title: 'Uyku Danışmanlığı',
      description: 'Bebek ve çocuk uyku sorunlarına çözüm',
      icon: (
        <svg className="service-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
      color: 'tertiary',
      href: '/hizmetlerimiz/uyku-danismanligi'
    }
  ]

  return (
    <section className="services-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="md-sys-typescale-display-small">Hizmetlerimiz</h2>
          <p className="md-sys-typescale-body-large">
            Çocuğunuzun sağlığı için kapsamlı pediatri hizmetleri
          </p>
        </div>

        {/* Services Grid */}
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.key} className={`service-card service-card--${service.color}`}>
              <div className="service-icon-wrapper">
                {service.icon}
              </div>
              
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              
              <Link href={service.href} className="service-link">
                <span>Detaylı Bilgi</span>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="section-footer">
          <Link href="/hizmetlerimiz" className="md-button md-button--filled md-button--large">
            <span>Tüm Hizmetleri Görüntüle</span>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .services-section {
          padding: 80px 0;
          background: var(--md-sys-color-surface);
          position: relative;
          overflow: hidden;
        }

        .services-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 200%;
          height: 100%;
          background: radial-gradient(
            ellipse at center,
            var(--md-sys-color-primary-container) 0%,
            transparent 70%
          );
          opacity: 0.1;
          pointer-events: none;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
        }

        /* Section Header */
        .section-header {
          text-align: center;
          margin-bottom: 56px;
        }

        .section-header h2 {
          color: var(--md-sys-color-on-surface);
          margin-bottom: 16px;
        }

        .section-header p {
          color: var(--md-sys-color-on-surface-variant);
          max-width: 600px;
          margin: 0 auto;
        }

        /* Services Grid */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          margin-bottom: 56px;
        }

        @media (min-width: 768px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .services-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* Service Card */
        .service-card {
          background: var(--md-sys-color-surface-container);
          border-radius: var(--md-sys-shape-corner-large);
          padding: 32px 24px;
          text-align: center;
          transition: all var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized);
          position: relative;
          overflow: hidden;
        }

        .service-card::before {
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

        .service-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--md-sys-elevation-level3);
        }

        .service-card:hover::before {
          transform: scaleX(1);
        }

        .service-card--secondary::before {
          background: var(--md-sys-color-secondary);
        }

        .service-card--tertiary::before {
          background: var(--md-sys-color-tertiary);
        }

        /* Service Icon */
        .service-icon-wrapper {
          width: 64px;
          height: 64px;
          margin: 0 auto 24px;
          background: var(--md-sys-color-primary-container);
          border-radius: var(--md-sys-shape-corner-large);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
        }

        .service-card--secondary .service-icon-wrapper {
          background: var(--md-sys-color-secondary-container);
        }

        .service-card--tertiary .service-icon-wrapper {
          background: var(--md-sys-color-tertiary-container);
        }

        .service-card:hover .service-icon-wrapper {
          transform: scale(1.1);
        }

        .service-icon {
          width: 32px;
          height: 32px;
          color: var(--md-sys-color-on-primary-container);
        }

        .service-card--secondary .service-icon {
          color: var(--md-sys-color-on-secondary-container);
        }

        .service-card--tertiary .service-icon {
          color: var(--md-sys-color-on-tertiary-container);
        }

        /* Service Content */
        .service-title {
          font-size: 20px;
          font-weight: 600;
          color: var(--md-sys-color-on-surface);
          margin-bottom: 12px;
        }

        .service-description {
          font-size: 14px;
          color: var(--md-sys-color-on-surface-variant);
          line-height: 1.5;
          margin-bottom: 24px;
        }

        /* Service Link */
        .service-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--md-sys-color-primary);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: var(--md-sys-shape-corner-full);
          transition: all var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
        }

        .service-link:hover {
          background: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
        }

        .service-link svg {
          transition: transform var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
        }

        .service-link:hover svg {
          transform: translateX(4px);
        }

        /* Section Footer */
        .section-footer {
          text-align: center;
        }

        /* MD Button Styles */
        .md-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0 24px;
          height: 40px;
          border: none;
          border-radius: var(--md-sys-shape-corner-full);
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
          transition: all var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
          position: relative;
          overflow: hidden;
        }

        .md-button--filled {
          background: var(--md-sys-color-primary);
          color: var(--md-sys-color-on-primary);
        }

        .md-button--filled:hover {
          box-shadow: var(--md-sys-elevation-level2);
        }

        .md-button--large {
          height: 56px;
          padding: 0 32px;
          font-size: 16px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .services-section {
            padding: 60px 0;
          }

          .services-grid {
            grid-template-columns: 1fr;
            gap: 20px;
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

export { ServicesSection }