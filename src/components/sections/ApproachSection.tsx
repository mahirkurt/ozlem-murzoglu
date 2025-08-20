'use client'

import React from 'react'
import Link from 'next/link'

const ApproachSection: React.FC = () => {
  const approaches = [
    {
      title: 'Yaklaşımımız',
      description: 'Bütüncül pediatri yaklaşımıyla çocuğunuzun fiziksel, duygusal ve sosyal gelişimini destekliyoruz.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      href: '/yaklasimimiz',
      color: 'primary'
    },
    {
      title: 'Hizmetlerimiz',
      description: 'Bright Futures programından Triple P ebeveynlik desteğine kadar kapsamlı pediatri hizmetleri.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 8h-1V3H6v5H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zM8 5h8v3H8V5zm8 12v2H8v-4h8v2zm2-2v-2H6v2H4v-4c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v4h-2z"/>
          <circle cx="18" cy="11.5" r="1"/>
        </svg>
      ),
      href: '/hizmetlerimiz',
      color: 'secondary'
    },
    {
      title: 'Randevu',
      description: 'Online randevu sistemiyle kolayca randevu alın, zamanınızı verimli kullanın.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
        </svg>
      ),
      href: '/randevu',
      color: 'tertiary'
    }
  ]

  return (
    <section className="approach-section">
      <div className="container">
        <div className="section-header">
          <h2 className="md-sys-typescale-display-small">Çocuğunuzun Sağlığı İçin Doğru Adres</h2>
          <p className="md-sys-typescale-body-large">
            15 yıllık deneyimimizle, kanıta dayalı tıp ve sevgi dolu yaklaşımı birleştiriyoruz
          </p>
        </div>

        <div className="approach-grid">
          {approaches.map((item, index) => (
            <Link href={item.href} key={index} className={`approach-card approach-card--${item.color}`}>
              <div className="card-header">
                <div className="card-icon">
                  {item.icon}
                </div>
              </div>
              
              <div className="card-content">
                <h3 className="card-title md-sys-typescale-title-large">{item.title}</h3>
                <p className="card-description md-sys-typescale-body-medium">{item.description}</p>
              </div>
              
              <div className="card-action">
                <span className="action-text">Detaylı Bilgi</span>
                <svg className="action-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .approach-section {
          padding: 80px 0;
          background: var(--md-sys-color-surface);
          position: relative;
        }

        .approach-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            var(--md-sys-color-outline-variant) 50%,
            transparent 100%
          );
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

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
          line-height: 1.6;
        }

        /* MD3 Grid */
        .approach-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }

        @media (min-width: 1024px) {
          .approach-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* MD3 Card */
        .approach-card {
          background: var(--md-sys-color-surface-container);
          border-radius: var(--md-sys-shape-corner-large);
          padding: 0;
          text-decoration: none;
          color: inherit;
          box-shadow: var(--md-sys-elevation-level0);
          transition: all var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          border: 1px solid var(--md-sys-color-outline-variant);
        }

        .approach-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--md-sys-color-on-surface);
          opacity: 0;
          transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
          z-index: 1;
        }

        .approach-card:hover::before {
          opacity: var(--md-sys-state-hover-opacity);
        }

        .approach-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--md-sys-elevation-level3);
          border-color: var(--md-sys-color-primary);
        }

        /* Card Header with Icon */
        .card-header {
          padding: 32px 32px 24px;
          background: var(--md-sys-color-primary-container);
          position: relative;
          z-index: 2;
        }

        .approach-card--secondary .card-header {
          background: var(--md-sys-color-secondary-container);
        }

        .approach-card--tertiary .card-header {
          background: var(--md-sys-color-tertiary-container);
        }

        .card-icon {
          width: 64px;
          height: 64px;
          border-radius: var(--md-sys-shape-corner-full);
          background: var(--md-sys-color-surface);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--md-sys-color-on-primary-container);
          box-shadow: var(--md-sys-elevation-level1);
          transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
        }

        .approach-card--secondary .card-icon {
          color: var(--md-sys-color-on-secondary-container);
        }

        .approach-card--tertiary .card-icon {
          color: var(--md-sys-color-on-tertiary-container);
        }

        .approach-card:hover .card-icon {
          transform: scale(1.1) rotate(5deg);
          box-shadow: var(--md-sys-elevation-level2);
        }

        /* Card Content */
        .card-content {
          padding: 24px 32px;
          flex: 1;
          position: relative;
          z-index: 2;
        }

        .card-title {
          color: var(--md-sys-color-on-surface);
          margin-bottom: 12px;
          font-weight: 600;
        }

        .card-description {
          color: var(--md-sys-color-on-surface-variant);
          line-height: 1.6;
        }

        /* Card Action */
        .card-action {
          padding: 16px 32px 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--md-sys-color-primary);
          font-weight: 500;
          font-size: var(--md-sys-typescale-label-large-size);
          position: relative;
          z-index: 2;
          transition: all var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
        }

        .approach-card--secondary .card-action {
          color: var(--md-sys-color-secondary);
        }

        .approach-card--tertiary .card-action {
          color: var(--md-sys-color-tertiary);
        }

        .action-icon {
          transition: transform var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
        }

        .approach-card:hover .action-icon {
          transform: translateX(4px);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .approach-section {
            padding: 60px 0;
          }

          .section-header {
            margin-bottom: 40px;
          }

          .section-header h2 {
            font-size: 28px;
          }

          .approach-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .card-header {
            padding: 24px 24px 20px;
          }

          .card-content {
            padding: 20px 24px;
          }

          .card-action {
            padding: 12px 24px 20px;
          }
        }
      `}</style>
    </section>
  )
}

export { ApproachSection }