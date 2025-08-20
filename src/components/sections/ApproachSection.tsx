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
              <div className="card-glow"></div>
              
              <div className="card-header">
                <div className="card-icon">
                  {item.icon}
                </div>
                <div className="card-badge">
                  <span>{index + 1}</span>
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
          background: linear-gradient(180deg, 
            var(--md-sys-color-surface) 0%, 
            rgba(255, 183, 77, 0.03) 100%
          );
          position: relative;
          overflow: hidden;
        }

        .approach-section::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle at 20% 80%,
            rgba(255, 183, 77, 0.05) 0%,
            transparent 50%
          );
          pointer-events: none;
        }

        .approach-section::after {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle at 80% 20%,
            rgba(0, 95, 115, 0.03) 0%,
            transparent 50%
          );
          pointer-events: none;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 1;
        }

        .section-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .section-header h2 {
          color: var(--md-sys-color-on-surface);
          margin-bottom: 20px;
          position: relative;
          display: inline-block;
        }

        .section-header h2::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #FFB74D 0%, #FFA726 100%);
          border-radius: 2px;
        }

        .section-header p {
          color: var(--md-sys-color-on-surface-variant);
          max-width: 600px;
          margin: 20px auto 0;
          line-height: 1.6;
        }

        /* MD3 Grid with Dynamic Layout */
        .approach-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 32px;
        }

        @media (min-width: 1024px) {
          .approach-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* Enhanced MD3 Card */
        .approach-card {
          background: white;
          border-radius: 24px;
          padding: 0;
          text-decoration: none;
          color: inherit;
          box-shadow: 0 2px 12px rgba(0, 95, 115, 0.08);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(0, 95, 115, 0.06);
        }

        /* Animated Glow Effect */
        .card-glow {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, 
            #FFB74D, 
            #FFA726, 
            #005F73,
            #0A8FA3,
            #FFB74D
          );
          background-size: 400% 400%;
          border-radius: 24px;
          opacity: 0;
          z-index: -1;
          transition: opacity 0.4s ease;
          animation: gradientShift 3s ease infinite;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .approach-card:hover .card-glow {
          opacity: 0.3;
        }

        .approach-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 95, 115, 0.15);
          border-color: transparent;
        }

        /* Card Header with Badge */
        .card-header {
          padding: 32px 32px 24px;
          background: linear-gradient(135deg, 
            rgba(0, 95, 115, 0.05) 0%, 
            rgba(0, 95, 115, 0.02) 100%
          );
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .approach-card--secondary .card-header {
          background: linear-gradient(135deg, 
            rgba(255, 183, 77, 0.08) 0%, 
            rgba(255, 167, 38, 0.04) 100%
          );
        }

        .approach-card--tertiary .card-header {
          background: linear-gradient(135deg, 
            rgba(148, 187, 233, 0.08) 0%, 
            rgba(148, 187, 233, 0.04) 100%
          );
        }

        .card-icon {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: linear-gradient(135deg, #005F73 0%, #0A8FA3 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(0, 95, 115, 0.2);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .approach-card--secondary .card-icon {
          background: linear-gradient(135deg, #FFB74D 0%, #FFA726 100%);
          box-shadow: 0 4px 12px rgba(255, 167, 38, 0.3);
        }

        .approach-card--tertiary .card-icon {
          background: linear-gradient(135deg, #94BBE9 0%, #7BA7E7 100%);
          box-shadow: 0 4px 12px rgba(148, 187, 233, 0.3);
        }

        .approach-card:hover .card-icon {
          transform: scale(1.1) rotate(5deg);
          border-radius: 24px;
        }

        /* Number Badge */
        .card-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #FFB74D 0%, #FFA726 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 14px;
          box-shadow: 0 2px 8px rgba(255, 167, 38, 0.3);
        }

        /* Card Content */
        .card-content {
          padding: 24px 32px 32px;
          flex: 1;
        }

        .card-title {
          color: var(--md-sys-color-on-surface);
          margin-bottom: 12px;
          font-weight: 600;
          font-size: 22px;
        }

        .card-description {
          color: var(--md-sys-color-on-surface-variant);
          line-height: 1.6;
          font-size: 15px;
        }

        /* Enhanced Card Action */
        .card-action {
          padding: 20px 32px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(90deg, 
            rgba(255, 183, 77, 0.1) 0%, 
            rgba(255, 167, 38, 0.05) 100%
          );
          border-top: 1px solid rgba(255, 183, 77, 0.2);
          color: #F57C00;
          font-weight: 600;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .approach-card--primary .card-action {
          background: linear-gradient(90deg, 
            rgba(0, 95, 115, 0.08) 0%, 
            rgba(0, 95, 115, 0.04) 100%
          );
          border-color: rgba(0, 95, 115, 0.2);
          color: #005F73;
        }

        .approach-card--tertiary .card-action {
          background: linear-gradient(90deg, 
            rgba(148, 187, 233, 0.08) 0%, 
            rgba(148, 187, 233, 0.04) 100%
          );
          border-color: rgba(148, 187, 233, 0.2);
          color: #5E92F3;
        }

        .action-icon {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .approach-card:hover .card-action {
          padding-left: 36px;
          background: linear-gradient(90deg, 
            rgba(255, 183, 77, 0.15) 0%, 
            rgba(255, 167, 38, 0.08) 100%
          );
        }

        .approach-card:hover .action-icon {
          transform: translateX(8px);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .approach-section {
            padding: 60px 0;
          }

          .section-header {
            margin-bottom: 48px;
          }

          .section-header h2 {
            font-size: 28px;
          }

          .approach-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .card-header {
            padding: 24px 24px 20px;
          }

          .card-content {
            padding: 20px 24px 24px;
          }

          .card-action {
            padding: 16px 24px;
          }

          .card-title {
            font-size: 20px;
          }

          .card-description {
            font-size: 14px;
          }
        }
      `}</style>
    </section>
  )
}

export { ApproachSection }