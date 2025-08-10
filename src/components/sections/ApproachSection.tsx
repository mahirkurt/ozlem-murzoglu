'use client'

import React from 'react'
import Link from 'next/link'

const ApproachSection: React.FC = () => {
  const approaches = [
    {
      title: 'Yaklaşımımız',
      description: 'Bütüncül pediatri yaklaşımıyla çocuğunuzun fiziksel, duygusal ve sosyal gelişimini destekliyoruz.',
      icon: '🤝',
      href: '/yaklasimimiz',
      color: '#005F73'
    },
    {
      title: 'Hizmetlerimiz',
      description: 'Bright Futures programından Triple P ebeveynlik desteğine kadar kapsamlı pediatri hizmetleri.',
      icon: '🏥',
      href: '/hizmetlerimiz',
      color: '#0A9396'
    },
    {
      title: 'Randevu',
      description: 'Online randevu sistemiyle kolayca randevu alın, zamanınızı verimli kullanın.',
      icon: '📅',
      href: '/randevu',
      color: '#94BBE9'
    }
  ]

  return (
    <section className="approach-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Çocuğunuzun Sağlığı İçin Doğru Adres</h2>
          <p className="section-subtitle">
            15 yıllık deneyimimizle, kanıta dayalı tıp ve sevgi dolu yaklaşımı birleştiriyoruz
          </p>
        </div>

        <div className="approach-grid">
          {approaches.map((item, index) => (
            <Link href={item.href} key={index} className="approach-card">
              <div className="card-icon" style={{ background: `${item.color}20` }}>
                <span>{item.icon}</span>
              </div>
              <h3 className="card-title">{item.title}</h3>
              <p className="card-description">{item.description}</p>
              <div className="card-link">
                <span>Detaylı Bilgi</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .approach-section {
          padding: 5rem 0;
          background: var(--md-sys-color-surface);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--md-sys-color-on-surface);
          margin-bottom: 1rem;
        }

        .section-subtitle {
          font-size: 1.125rem;
          color: var(--md-sys-color-on-surface-variant);
          max-width: 600px;
          margin: 0 auto;
        }

        .approach-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .approach-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          text-decoration: none;
          color: inherit;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .approach-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #005F73, #94BBE9);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .approach-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }

        .approach-card:hover::before {
          transform: scaleX(1);
        }

        .card-icon {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--md-sys-color-on-surface);
          margin-bottom: 1rem;
        }

        .card-description {
          font-size: 1rem;
          color: var(--md-sys-color-on-surface-variant);
          line-height: 1.6;
          flex: 1;
          margin-bottom: 1.5rem;
        }

        .card-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--md-sys-color-secondary);
          font-weight: 500;
          font-size: 0.9375rem;
        }

        .approach-card:hover .card-link {
          gap: 0.75rem;
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 2rem;
          }

          .approach-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  )
}

export { ApproachSection }