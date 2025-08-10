'use client'

import React from 'react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Çocuğunuzun Sağlıklı Geleceği İçin
            </h1>
            <p className="hero-subtitle">
              Dr. Özlem Murzoğlu Pediatri Kliniği olarak, 0-18 yaş arası çocukların 
              sağlıklı büyümesi ve gelişimi için kapsamlı pediatri hizmetleri sunuyoruz.
            </p>
            <div className="hero-actions">
              <Link href="/randevu" className="btn btn-primary btn-large">
                Online Randevu Al
              </Link>
              <Link href="/hizmetlerimiz" className="btn btn-outlined btn-large">
                Hizmetlerimiz
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Neden Bizi Tercih Etmelisiniz?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="feature-title">Uzman Kadro</h3>
              <p className="feature-description">
                Alanında deneyimli pediatri uzmanlarımız ile çocuğunuzun sağlığı güvende.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
              </div>
              <h3 className="feature-title">7/24 Ulaşılabilirlik</h3>
              <p className="feature-description">
                Acil durumlar için 7/24 telefon desteği ve online konsültasyon imkanı.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="feature-title">Modern Yaklaşım</h3>
              <p className="feature-description">
                En güncel tıbbi bilgi ve teknolojilerle hizmet veriyoruz.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <h3 className="feature-title">Sevgi Dolu Yaklaşım</h3>
              <p className="feature-description">
                Çocuklarınıza kendi çocuklarımız gibi sevgi ve özenle yaklaşıyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">Hizmetlerimiz</h2>
          <div className="services-grid">
            <Link href="/hizmetlerimiz/genel-pediatri" className="service-card">
              <h3 className="service-title">Genel Pediatri</h3>
              <p className="service-description">
                Yenidoğan döneminden ergenlik çağına kadar kapsamlı sağlık takibi
              </p>
            </Link>

            <Link href="/hizmetlerimiz/uyku-danismanligi" className="service-card">
              <h3 className="service-title">Uyku Danışmanlığı</h3>
              <p className="service-description">
                Bebek ve çocuklarda sağlıklı uyku alışkanlıkları geliştirme
              </p>
            </Link>

            <Link href="/hizmetlerimiz/triple-p" className="service-card">
              <h3 className="service-title">Triple P Programı</h3>
              <p className="service-description">
                Pozitif ebeveynlik programı ile aile danışmanlığı
              </p>
            </Link>

            <Link href="/hizmetlerimiz/asilama" className="service-card">
              <h3 className="service-title">Aşılama</h3>
              <p className="service-description">
                Sağlık Bakanlığı takvimi ve özel aşı uygulamaları
              </p>
            </Link>

            <Link href="/hizmetlerimiz/laboratuvar" className="service-card">
              <h3 className="service-title">Laboratuvar</h3>
              <p className="service-description">
                Hızlı ve güvenilir laboratuvar test hizmetleri
              </p>
            </Link>

            <Link href="/hizmetlerimiz/online-konsultasyon" className="service-card">
              <h3 className="service-title">Online Konsültasyon</h3>
              <p className="service-description">
                Video görüşme ile uzaktan muayene ve danışmanlık
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Çocuğunuzun Sağlığı İçin Hemen Randevu Alın</h2>
            <p className="cta-description">
              Online randevu sistemi ile kolayca randevu alabilir, bekleme sürelerini ortadan kaldırabilirsiniz.
            </p>
            <Link href="/randevu" className="btn btn-primary btn-large">
              Hemen Randevu Al
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-container {
          min-height: 100vh;
        }

        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        /* Hero Section */
        .hero-section {
          background: linear-gradient(135deg, 
            var(--md-sys-color-primary-container) 0%, 
            var(--md-sys-color-secondary-container) 100%);
          padding: 4rem 0;
        }

        .hero-content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 700;
          color: var(--md-sys-color-on-primary-container);
          margin-bottom: 1rem;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--md-sys-color-on-primary-container);
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* Features Section */
        .features-section {
          padding: 4rem 0;
          background-color: var(--md-sys-color-surface);
        }

        .section-title {
          font-size: 2rem;
          font-weight: 600;
          text-align: center;
          color: var(--md-sys-color-on-surface);
          margin-bottom: 3rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          padding: 2rem;
          background-color: var(--md-sys-color-surface-container);
          border-radius: 16px;
          text-align: center;
          transition: transform 0.2s ease;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .feature-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 1rem;
          padding: 1rem;
          background-color: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feature-icon svg {
          width: 30px;
          height: 30px;
        }

        .feature-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--md-sys-color-on-surface);
          margin-bottom: 0.5rem;
        }

        .feature-description {
          color: var(--md-sys-color-on-surface-variant);
          line-height: 1.6;
        }

        /* Services Section */
        .services-section {
          padding: 4rem 0;
          background-color: var(--md-sys-color-surface-container);
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .service-card {
          padding: 2rem;
          background-color: var(--md-sys-color-surface);
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.2s ease;
          border: 1px solid var(--md-sys-color-outline-variant);
        }

        .service-card:hover {
          background-color: var(--md-sys-color-primary-container);
          border-color: var(--md-sys-color-primary);
          transform: translateY(-2px);
        }

        .service-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--md-sys-color-on-surface);
          margin-bottom: 0.75rem;
        }

        .service-card:hover .service-title {
          color: var(--md-sys-color-on-primary-container);
        }

        .service-description {
          color: var(--md-sys-color-on-surface-variant);
          line-height: 1.5;
        }

        .service-card:hover .service-description {
          color: var(--md-sys-color-on-primary-container);
        }

        /* CTA Section */
        .cta-section {
          padding: 4rem 0;
          background-color: var(--md-sys-color-primary);
          color: var(--md-sys-color-on-primary);
        }

        .cta-content {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .cta-title {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .cta-description {
          font-size: 1.125rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        /* Button Styles */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1.5rem;
          border-radius: 100px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
        }

        .btn-primary {
          background-color: var(--md-sys-color-primary);
          color: var(--md-sys-color-on-primary);
        }

        .btn-primary:hover {
          background-color: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
        }

        .btn-outlined {
          background-color: transparent;
          color: var(--md-sys-color-primary);
          border: 2px solid var(--md-sys-color-outline);
        }

        .btn-outlined:hover {
          background-color: var(--md-sys-color-primary-container);
          border-color: var(--md-sys-color-primary);
        }

        .btn-large {
          padding: 1rem 2rem;
          font-size: 1.125rem;
        }

        @media (max-width: 768px) {
          .features-grid,
          .services-grid {
            grid-template-columns: 1fr;
          }

          .hero-actions {
            flex-direction: column;
            align-items: center;
          }

          .btn-large {
            width: 100%;
            max-width: 300px;
          }
        }
      `}</style>
    </div>
  )
}