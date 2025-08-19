'use client'

import React from 'react'

const TestimonialSection: React.FC = () => {
  return (
    <section className="testimonial-section">
      <div className="container">
        <div className="testimonial-card">
          <div className="quote-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
            </svg>
          </div>
          
          <blockquote className="testimonial-text">
            "Dr. Özlem Hanım, sadece bir doktor değil, aynı zamanda bir anne dostu. 
            Çocuğumun her kontrolünde gösterdiği özen ve sabır, verdiği detaylı bilgiler 
            sayesinde kendimi çok daha güvende hissediyorum. Kliniğin sıcak atmosferi ve 
            Dr. Özlem Hanım'ın samimi yaklaşımı, çocuğumun doktor korkusunu tamamen yendi."
          </blockquote>
          
          <div className="testimonial-author">
            <div className="author-info">
              <div className="author-avatar">
                <span>AY</span>
              </div>
              <div className="author-details">
                <p className="author-name">Ayşe Y.</p>
                <p className="author-meta">Google Yorumları</p>
              </div>
            </div>
            
            <div className="rating">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
              <span className="rating-text">5.0</span>
            </div>
          </div>

          <div className="google-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Google'da 4.9/5 puan</span>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Google Yorumu</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">%98</span>
            <span className="stat-label">Memnuniyet Oranı</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">4.9</span>
            <span className="stat-label">Ortalama Puan</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .testimonial-section {
          padding: 5rem 0;
          background: linear-gradient(135deg, var(--md-sys-color-primary) 0%, var(--md-sys-color-tertiary) 100%);
          position: relative;
          overflow: hidden;
          margin: 0; /* Remove any default margins */
        }

        .testimonial-section::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          border-radius: 50%;
        }

        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 1.5rem;
          position: relative;
          z-index: 1;
        }

        .testimonial-card {
          background: white;
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          position: relative;
        }

        .quote-icon {
          position: absolute;
          top: -24px;
          left: 3rem;
          width: 48px;
          height: 48px;
          background: var(--md-sys-color-secondary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .testimonial-text {
          font-size: 1.25rem;
          line-height: 1.8;
          color: var(--md-sys-color-on-surface);
          margin: 2rem 0;
          font-style: italic;
        }

        .testimonial-author {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--md-sys-color-outline-variant);
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .author-avatar {
          width: 48px;
          height: 48px;
          background: var(--md-sys-color-secondary-container);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--md-sys-color-on-secondary-container);
          font-weight: 600;
        }

        .author-name {
          font-weight: 600;
          color: var(--md-sys-color-on-surface);
          margin: 0;
        }

        .author-meta {
          font-size: 0.875rem;
          color: var(--md-sys-color-on-surface-variant);
          margin: 0;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .rating svg {
          color: #FFC107;
        }

        .rating-text {
          margin-left: 0.5rem;
          font-weight: 600;
          color: var(--md-sys-color-on-surface);
        }

        .google-badge {
          position: absolute;
          top: 2rem;
          right: 2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--md-sys-color-surface-container);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          color: var(--md-sys-color-on-surface-variant);
        }

        .stats-row {
          display: flex;
          justify-content: center;
          gap: 4rem;
          margin-top: 3rem;
        }

        .stat-item {
          text-align: center;
          color: white;
        }

        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.9375rem;
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .testimonial-card {
            padding: 2rem 1.5rem;
          }

          .testimonial-text {
            font-size: 1.125rem;
          }

          .testimonial-author {
            flex-direction: column;
            gap: 1.5rem;
            align-items: flex-start;
          }

          .google-badge {
            position: static;
            margin-top: 1.5rem;
          }

          .stats-row {
            gap: 2rem;
          }

          .stat-number {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </section>
  )
}

export { TestimonialSection }