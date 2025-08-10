'use client'

import React from 'react'
import Link from 'next/link'

interface HeroSectionProps {
  locale: string
}

const HeroSection: React.FC<HeroSectionProps> = ({ locale }) => {
  return (
    <section className="hero-section">
      <div className="hero-background">
        <div className="hero-shape hero-shape-1"></div>
        <div className="hero-shape hero-shape-2"></div>
        <div className="hero-shape hero-shape-3"></div>
      </div>
      
      <div className="container">
        <div className="hero-grid">
          <div className="hero-content">
            <h1 className="hero-title">
              Çocuğunuzun <span className="hero-highlight">Sağlıklı Geleceği</span> İçin
            </h1>
            
            <h2 className="hero-subtitle">
              Dr. Özlem Murzoğlu Pediatri Kliniği
            </h2>
            
            <p className="hero-description">
              0-18 yaş arası çocukların sağlıklı büyümesi ve gelişimi için modern tıp ve sevgi dolu yaklaşımı birleştiren uzman pediatri hizmetleri sunuyoruz.
            </p>

            <div className="hero-actions">
              <Link href="/randevu" className="btn-hero btn-primary">
                <span>Online Randevu Al</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </Link>
              
              <Link href="/hizmetlerimiz" className="btn-hero btn-secondary">
                <span>Hizmetlerimizi Keşfedin</span>
              </Link>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-value">15+</div>
                <div className="stat-label">Yıl Deneyim</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">10K+</div>
                <div className="stat-label">Mutlu Hasta</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">50+</div>
                <div className="stat-label">Hizmet</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">7/24</div>
                <div className="stat-label">Erişilebilirlik</div>
              </div>
            </div>
          </div>

          <div className="hero-image">
            <div className="image-container">
              <div className="image-card">
                <img 
                  src="/logos/OM-Square-Color.svg" 
                  alt="Dr. Özlem Murzoğlu" 
                  className="doctor-illustration"
                />
                
                <div className="floating-card card-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--md-sys-color-tertiary)">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span>Uzman Kadro</span>
                </div>
                
                <div className="floating-card card-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--md-sys-color-secondary)">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span>Sevgi & Şefkat</span>
                </div>
                
                <div className="floating-card card-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--md-sys-color-primary)">
                    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                  </svg>
                  <span>7/24 Randevu</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          min-height: calc(100vh - 80px);
          margin-top: 80px;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: linear-gradient(135deg, 
            var(--md-sys-color-surface) 0%,
            var(--md-sys-color-surface-container-low) 50%,
            var(--md-sys-color-secondary-container) 100%
          );
        }

        .hero-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .hero-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.3;
          animation: float 20s infinite ease-in-out;
        }

        .hero-shape-1 {
          width: 400px;
          height: 400px;
          background: var(--md-sys-color-secondary);
          top: -200px;
          right: -100px;
        }

        .hero-shape-2 {
          width: 300px;
          height: 300px;
          background: var(--md-sys-color-tertiary);
          bottom: -150px;
          left: -50px;
          animation-delay: 5s;
        }

        .hero-shape-3 {
          width: 200px;
          height: 200px;
          background: var(--md-sys-color-primary);
          top: 50%;
          left: 30%;
          animation-delay: 10s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(30px, -30px) rotate(90deg); }
          50% { transform: translate(-20px, 20px) rotate(180deg); }
          75% { transform: translate(-30px, -10px) rotate(270deg); }
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 1.5rem;
          position: relative;
          z-index: 1;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-content {
          animation: slideInLeft 0.8s ease-out;
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          font-weight: 700;
          line-height: 1.2;
          color: var(--md-sys-color-on-surface);
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }

        .hero-highlight {
          color: var(--md-sys-color-secondary);
          position: relative;
        }

        .hero-highlight::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, 
            var(--md-sys-color-secondary) 0%, 
            var(--md-sys-color-tertiary) 100%
          );
          border-radius: 2px;
        }

        .hero-subtitle {
          font-size: 1.5rem;
          font-weight: 500;
          color: var(--md-sys-color-primary);
          margin-bottom: 1.5rem;
        }

        .hero-description {
          font-size: 1.125rem;
          line-height: 1.7;
          color: var(--md-sys-color-on-surface-variant);
          margin-bottom: 2rem;
          max-width: 600px;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .btn-hero {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          border-radius: 28px;
          font-weight: 600;
          font-size: 1rem;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .btn-primary {
          background: linear-gradient(135deg, 
            var(--md-sys-color-secondary) 0%, 
            var(--md-sys-color-tertiary) 100%
          );
          color: var(--md-sys-color-on-secondary);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, 
            var(--md-sys-color-tertiary) 0%, 
            var(--md-sys-color-secondary) 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .btn-primary:hover::before {
          opacity: 1;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }

        .btn-primary span,
        .btn-primary svg {
          position: relative;
          z-index: 1;
        }

        .btn-secondary {
          background: var(--md-sys-color-surface-container);
          color: var(--md-sys-color-secondary);
          border: 2px solid var(--md-sys-color-secondary-container);
        }

        .btn-secondary:hover {
          background: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .stat-item {
          text-align: center;
          animation: fadeInUp 0.8s ease-out;
          animation-fill-mode: both;
        }

        .stat-item:nth-child(1) { animation-delay: 0.1s; }
        .stat-item:nth-child(2) { animation-delay: 0.2s; }
        .stat-item:nth-child(3) { animation-delay: 0.3s; }
        .stat-item:nth-child(4) { animation-delay: 0.4s; }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--md-sys-color-secondary);
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--md-sys-color-on-surface-variant);
        }

        .hero-image {
          position: relative;
          animation: slideInRight 0.8s ease-out;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .image-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .image-card {
          position: relative;
          width: 100%;
          max-width: 400px;
          height: 500px;
          background: var(--md-sys-color-surface-container);
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
        }

        .doctor-illustration {
          width: 60%;
          height: auto;
          max-width: 250px;
        }

        .floating-card {
          position: absolute;
          background: var(--md-sys-color-surface);
          border-radius: 16px;
          padding: 1rem;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--md-sys-color-on-surface);
          animation: floatCard 3s infinite ease-in-out;
        }

        .card-1 {
          top: 20px;
          right: -40px;
          animation-delay: 0s;
        }

        .card-2 {
          bottom: 80px;
          left: -40px;
          animation-delay: 1s;
        }

        .card-3 {
          bottom: 20px;
          right: -20px;
          animation-delay: 2s;
        }

        @keyframes floatCard {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @media (max-width: 968px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .hero-image {
            order: -1;
          }

          .image-card {
            max-width: 300px;
            height: 400px;
          }

          .floating-card {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .hero-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }

          .hero-actions {
            flex-direction: column;
          }

          .btn-hero {
            width: 100%;
            justify-content: center;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </section>
  )
}

export default HeroSection