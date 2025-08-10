'use client'

import React from 'react'
import Link from 'next/link'

interface HeroSectionProps {
  locale: string
}

const HeroSection: React.FC<HeroSectionProps> = ({ locale }) => {
  return (
    <section className="hero-section">
      {/* Video/Image Background */}
      <div className="hero-background">
        <div className="hero-overlay"></div>
        <div className="hero-media">
          {/* Placeholder for video or image gallery */}
          <div className="hero-image-placeholder">
            <img 
              src="/images/dr-murzoglu-with-child.jpg" 
              alt="Dr. Özlem Murzoğlu ile çocuk" 
              className="hero-image"
              loading="eager"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="hero-content">
        <div className="container">
          {/* Main Value Proposition */}
          <div className="hero-main">
            <h1 className="hero-title">
              Sosyal Pediatri ve Çocuk Gelişimi Uzmanlıklarını Bütünleştiren,
              <span className="hero-highlight"> Çocuğunuza Özel Bütüncül Bakım</span>
            </h1>

            {/* Welcome Message from Dr. Murzoğlu */}
            <div className="welcome-message">
              <div className="message-avatar">
                <img src="/logos/OM-Icon-Color.svg" alt="Dr. Özlem Murzoğlu" />
              </div>
              <div className="message-content">
                <p className="message-text">
                  "Kliniğimize hoş geldiniz. Amacımız, çocuğunuzun sadece sağlığını değil, 
                  tüm potansiyelini desteklemektir."
                </p>
                <p className="message-author">Dr. Özlem Murzoğlu</p>
              </div>
            </div>

            {/* Primary CTAs */}
            <div className="hero-ctas">
              <Link href="/randevu" className="btn-primary-cta">
                <div className="btn-content">
                  <div className="btn-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                    </svg>
                  </div>
                  <div className="btn-text-group">
                    <span className="btn-main-text">Hemen Randevu Al</span>
                    <span className="btn-sub-text">Yeni Hastalar İçin</span>
                  </div>
                </div>
              </Link>
              
              <a href="https://saglikpetegim.com" target="_blank" rel="noopener noreferrer" className="btn-secondary-cta">
                <div className="btn-content">
                  <div className="btn-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div className="btn-text-group">
                    <span className="btn-main-text">Hasta Girişi</span>
                    <span className="btn-sub-text">Sağlık Peteğim Portalı</span>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="trust-indicators">
            <div className="indicator">
              <span className="indicator-value">15+</span>
              <span className="indicator-label">Yıl Deneyim</span>
            </div>
            <div className="indicator">
              <span className="indicator-value">10K+</span>
              <span className="indicator-label">Mutlu Aile</span>
            </div>
            <div className="indicator">
              <span className="indicator-value">4.9</span>
              <span className="indicator-label">Google Puanı</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          margin-top: 80px;
        }

        .hero-background {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(0, 95, 115, 0.95) 0%,
            rgba(0, 95, 115, 0.85) 50%,
            rgba(148, 187, 233, 0.9) 100%
          );
          z-index: 1;
        }

        .hero-media {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .hero-image-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #005F73 0%, #94BBE9 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.3;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          width: 100%;
          padding: 4rem 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .hero-main {
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          color: white;
          line-height: 1.3;
          margin-bottom: 2rem;
          animation: fadeInUp 0.8s ease-out;
        }

        .hero-highlight {
          display: block;
          color: #F8F9FA;
          margin-top: 0.5rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .welcome-message {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          margin: 2rem auto;
          max-width: 700px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          animation: fadeInUp 0.8s ease-out 0.2s;
          animation-fill-mode: both;
        }

        .message-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--md-sys-color-secondary-container);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .message-avatar img {
          width: 40px;
          height: 40px;
        }

        .message-content {
          flex: 1;
          text-align: left;
        }

        .message-text {
          font-size: 1.125rem;
          color: var(--md-sys-color-on-surface);
          line-height: 1.6;
          margin-bottom: 0.5rem;
          font-style: italic;
        }

        .message-author {
          font-size: 0.875rem;
          color: var(--md-sys-color-secondary);
          font-weight: 600;
        }

        .hero-ctas {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          margin: 3rem 0;
          flex-wrap: wrap;
          animation: fadeInUp 0.8s ease-out 0.4s;
          animation-fill-mode: both;
        }

        .btn-primary-cta,
        .btn-secondary-cta {
          text-decoration: none;
          position: relative;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .btn-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem 2rem;
        }

        .btn-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .btn-text-group {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.25rem;
        }

        .btn-main-text {
          font-size: 1.125rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .btn-sub-text {
          font-size: 0.875rem;
          opacity: 0.8;
          font-weight: 400;
        }

        .btn-primary-cta {
          background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%);
          color: #005F73;
          border-radius: 20px;
          box-shadow: 0 8px 24px rgba(0, 95, 115, 0.25);
          border: 1px solid rgba(0, 95, 115, 0.1);
        }

        .btn-primary-cta .btn-icon {
          background: linear-gradient(135deg, #005F73 0%, #0A9396 100%);
          color: white;
        }

        .btn-primary-cta:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 12px 32px rgba(0, 95, 115, 0.35);
        }

        .btn-primary-cta:hover .btn-icon {
          transform: rotate(5deg);
        }

        .btn-secondary-cta {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .btn-secondary-cta .btn-icon {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .btn-secondary-cta:hover {
          background: rgba(255, 255, 255, 0.95);
          color: #005F73;
          border-color: rgba(255, 255, 255, 0.95);
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
        }

        .btn-secondary-cta:hover .btn-icon {
          background: #005F73;
          color: white;
          transform: rotate(-5deg);
        }

        .trust-indicators {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin-top: 3rem;
          animation: fadeInUp 0.8s ease-out 0.6s;
          animation-fill-mode: both;
        }

        .indicator {
          text-align: center;
          color: white;
        }

        .indicator-value {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .indicator-label {
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          color: white;
          animation: bounce 2s infinite;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          40% {
            transform: translateX(-50%) translateY(-10px);
          }
          60% {
            transform: translateX(-50%) translateY(-5px);
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 1.75rem;
          }

          .welcome-message {
            flex-direction: column;
            text-align: center;
          }

          .message-content {
            text-align: center;
          }

          .hero-ctas {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }

          .btn-primary-cta,
          .btn-secondary-cta {
            width: 100%;
            max-width: 340px;
          }

          .btn-content {
            padding: 1rem 1.5rem;
          }

          .btn-icon {
            width: 40px;
            height: 40px;
          }

          .btn-main-text {
            font-size: 1rem;
          }

          .btn-sub-text {
            font-size: 0.8125rem;
          }

          .trust-indicators {
            gap: 1.5rem;
          }

          .indicator-value {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </section>
  )
}

export default HeroSection
export { HeroSection }