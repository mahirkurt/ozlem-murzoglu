'use client'

import React from 'react'
import Link from 'next/link'
import { navigation, contactInfo, socialLinks } from '@/lib/navigation'

interface FooterProps {
  locale?: string
}

const Footer: React.FC<FooterProps> = ({ locale = 'tr' }) => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-brand-section">
              <div className="footer-brand">
                <img 
                  src="/logos/OM-Wide-Color.svg" 
                  alt="Dr. Özlem Murzoğlu" 
                  className="footer-logo"
                />
              </div>
              
              <p className="footer-description">
                Çocuğunuzun sağlıklı büyümesi ve gelişimi için modern tıp ve sevgi dolu yaklaşımı birleştiren uzman pediatri hizmetleri.
              </p>
              
              {/* Social Links */}
              <div className="social-links">
                {socialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label={social.platform}
                  >
                    {social.platform === 'instagram' && (
                      <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                      </svg>
                    )}
                    {social.platform === 'facebook' && (
                      <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    )}
                    {social.platform === 'twitter' && (
                      <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    )}
                    {social.platform === 'linkedin' && (
                      <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    )}
                    {social.platform === 'youtube' && (
                      <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4 className="footer-title">Hızlı Linkler</h4>
              <ul className="footer-list">
                {navigation.slice(0, 5).map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="footer-link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="footer-section">
              <h4 className="footer-title">Hizmetlerimiz</h4>
              <ul className="footer-list">
                <li><Link href="/hizmetlerimiz/bright-futures" className="footer-link">Sağlıklı Çocuk İzlemi</Link></li>
                <li><Link href="/hizmetlerimiz/asilama" className="footer-link">Aşılama</Link></li>
                <li><Link href="/hizmetlerimiz/triple-p" className="footer-link">Ebeveyn Danışmanlığı</Link></li>
                <li><Link href="/hizmetlerimiz/online-konsultasyon" className="footer-link">Online Konsültasyon</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-section">
              <h4 className="footer-title">İletişim</h4>
              <div className="contact-info">
                <div className="contact-item">
                  <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 00-1.02.24l-2.2 2.2a15.045 15.045 0 01-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1.01A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/>
                  </svg>
                  <div>
                    <a href={`tel:${contactInfo.phone}`} className="contact-link">
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
                
                <div className="contact-item">
                  <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <div>
                    <a href={`mailto:${contactInfo.email}`} className="contact-link">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
                
                <div className="contact-item">
                  <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <div>
                    <p className="contact-text">
                      {contactInfo.address.street}<br/>
                      {contactInfo.address.building}<br/>
                      {contactInfo.address.district}, {contactInfo.address.city}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} Dr. Özlem Murzoğlu - Tüm hakları saklıdır.
            </p>
            <div className="footer-bottom-links">
              <Link href="/gizlilik-politikasi" className="footer-bottom-link">
                Gizlilik Politikası
              </Link>
              <Link href="/kullanim-kosullari" className="footer-bottom-link">
                Kullanım Koşulları
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: linear-gradient(180deg, 
            var(--md-sys-color-surface) 0%,
            var(--md-sys-color-surface-container) 100%
          );
          border-top: 1px solid var(--md-sys-color-outline-variant);
          margin-top: 4rem;
        }

        .footer-top {
          padding: 4rem 0 3rem;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 3rem;
        }

        .footer-brand-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .footer-brand {
          display: flex;
          align-items: center;
        }

        .footer-logo {
          height: 56px;
          width: auto;
        }

        .footer-description {
          color: var(--md-sys-color-on-surface-variant);
          line-height: 1.6;
          max-width: 400px;
        }

        .social-links {
          display: flex;
          gap: 0.75rem;
        }

        .social-link {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--md-sys-color-secondary-container);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background: var(--md-sys-color-secondary);
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .social-icon {
          width: 20px;
          height: 20px;
          color: var(--md-sys-color-on-secondary-container);
          transition: color 0.3s ease;
        }

        .social-link:hover .social-icon {
          color: var(--md-sys-color-on-secondary);
        }

        .footer-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .footer-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--md-sys-color-on-surface);
          margin: 0;
          position: relative;
          padding-bottom: 0.75rem;
        }

        .footer-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40px;
          height: 3px;
          background: var(--md-sys-color-tertiary);
          border-radius: 2px;
        }

        .footer-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-link {
          color: var(--md-sys-color-on-surface-variant);
          text-decoration: none;
          font-size: 0.9375rem;
          transition: all 0.2s ease;
          position: relative;
          padding-left: 0;
        }

        .footer-link:hover {
          color: var(--md-sys-color-secondary);
          padding-left: 8px;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .contact-item {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .contact-icon {
          width: 20px;
          height: 20px;
          color: var(--md-sys-color-tertiary);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .contact-link {
          color: var(--md-sys-color-on-surface-variant);
          text-decoration: none;
          font-size: 0.9375rem;
          transition: color 0.2s ease;
        }

        .contact-link:hover {
          color: var(--md-sys-color-secondary);
        }

        .contact-text {
          color: var(--md-sys-color-on-surface-variant);
          font-size: 0.9375rem;
          line-height: 1.5;
          margin: 0;
        }

        .footer-bottom {
          background: var(--md-sys-color-surface-container-high);
          border-top: 1px solid var(--md-sys-color-outline-variant);
          padding: 1.5rem 0;
        }

        .footer-bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .copyright {
          color: var(--md-sys-color-on-surface-variant);
          font-size: 0.875rem;
          margin: 0;
        }

        .footer-bottom-links {
          display: flex;
          gap: 2rem;
        }

        .footer-bottom-link {
          color: var(--md-sys-color-on-surface-variant);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s ease;
        }

        .footer-bottom-link:hover {
          color: var(--md-sys-color-secondary);
        }

        @media (max-width: 968px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }

          .footer-brand-section {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .footer-bottom-content {
            flex-direction: column;
            text-align: center;
          }

          .footer-bottom-links {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </footer>
  )
}

export default Footer
export { Footer }