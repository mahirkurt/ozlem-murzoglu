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
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-section">
              <div className="footer-brand">
                <svg className="footer-logo" viewBox="0 0 48 48" fill="currentColor">
                  <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 30c-5.52 0-10-4.48-10-10s4.48-10 10-10 10 4.48 10 10-4.48 10-10 10z"/>
                </svg>
                <div>
                  <h3 className="footer-brand-title">Sağlık Peteğim</h3>
                  <p className="footer-brand-subtitle">Dr. Özlem Murzoğlu Pediatri Kliniği</p>
                </div>
              </div>
              <p className="footer-description">
                Çocuğunuzun sağlıklı büyümesi ve gelişimi için güvenilir pediatri hizmetleri sunuyoruz.
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
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4 className="footer-title">Hızlı Linkler</h4>
              <ul className="footer-list">
                {navigation.map((item) => (
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
                <li><Link href="/hizmetlerimiz/genel-pediatri" className="footer-link">Genel Pediatri</Link></li>
                <li><Link href="/hizmetlerimiz/uyku-danismanligi" className="footer-link">Uyku Danışmanlığı</Link></li>
                <li><Link href="/hizmetlerimiz/triple-p" className="footer-link">Triple P Programı</Link></li>
                <li><Link href="/hizmetlerimiz/asilama" className="footer-link">Aşılama</Link></li>
                <li><Link href="/hizmetlerimiz/laboratuvar" className="footer-link">Laboratuvar</Link></li>
                <li><Link href="/hizmetlerimiz/online-konsultasyon" className="footer-link">Online Konsültasyon</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-section">
              <h4 className="footer-title">İletişim</h4>
              <div className="contact-info">
                <div className="contact-item">
                  <svg className="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="contact-text">{contactInfo.address.street}</p>
                    <p className="contact-text">{contactInfo.address.district}, {contactInfo.address.city}</p>
                  </div>
                </div>

                <div className="contact-item">
                  <svg className="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <a href={`tel:${contactInfo.phone}`} className="contact-link">{contactInfo.phone}</a>
                    <a href={`tel:${contactInfo.mobile}`} className="contact-link">{contactInfo.mobile}</a>
                  </div>
                </div>

                <div className="contact-item">
                  <svg className="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${contactInfo.email}`} className="contact-link">{contactInfo.email}</a>
                </div>

                <div className="contact-item">
                  <svg className="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="contact-text">Pazartesi - Cuma: 09:00 - 18:00</p>
                    <p className="contact-text">Cumartesi: 09:00 - 14:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} Sağlık Peteğim - Dr. Özlem Murzoğlu. Tüm hakları saklıdır.
            </p>
            <div className="footer-bottom-links">
              <Link href="/gizlilik-politikasi" className="footer-bottom-link">
                Gizlilik Politikası
              </Link>
              <Link href="/kullanim-kosullari" className="footer-bottom-link">
                Kullanım Koşulları
              </Link>
              <Link href="/kvkk" className="footer-bottom-link">
                KVKK
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background-color: var(--md-sys-color-surface-container);
          color: var(--md-sys-color-on-surface);
          margin-top: auto;
        }

        .footer-main {
          padding: 3rem 0 2rem;
          border-top: 1px solid var(--md-sys-color-outline-variant);
        }

        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .footer-section {
          min-width: 0;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .footer-logo {
          width: 40px;
          height: 40px;
          color: var(--md-sys-color-primary);
        }

        .footer-brand-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--md-sys-color-on-surface);
          margin: 0;
        }

        .footer-brand-subtitle {
          font-size: 0.75rem;
          color: var(--md-sys-color-on-surface-variant);
          margin: 0;
        }

        .footer-description {
          color: var(--md-sys-color-on-surface-variant);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .social-links {
          display: flex;
          gap: 0.75rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: var(--md-sys-color-surface-container-high);
          color: var(--md-sys-color-on-surface-variant);
          transition: all 0.2s ease;
        }

        .social-link:hover {
          background-color: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
          transform: translateY(-2px);
        }

        .social-icon {
          width: 20px;
          height: 20px;
        }

        .footer-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--md-sys-color-on-surface);
          margin-bottom: 1rem;
        }

        .footer-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-list li {
          margin-bottom: 0.75rem;
        }

        .footer-link {
          color: var(--md-sys-color-on-surface-variant);
          text-decoration: none;
          transition: color 0.2s ease;
          font-size: 0.875rem;
        }

        .footer-link:hover {
          color: var(--md-sys-color-primary);
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .contact-item {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .contact-icon {
          width: 20px;
          height: 20px;
          color: var(--md-sys-color-primary);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .contact-text {
          color: var(--md-sys-color-on-surface-variant);
          font-size: 0.875rem;
          line-height: 1.5;
          margin: 0;
        }

        .contact-link {
          display: block;
          color: var(--md-sys-color-on-surface-variant);
          text-decoration: none;
          font-size: 0.875rem;
          line-height: 1.5;
          transition: color 0.2s ease;
        }

        .contact-link:hover {
          color: var(--md-sys-color-primary);
        }

        .footer-bottom {
          background-color: var(--md-sys-color-surface-container-highest);
          padding: 1.5rem 0;
          border-top: 1px solid var(--md-sys-color-outline-variant);
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
          gap: 1.5rem;
        }

        .footer-bottom-link {
          color: var(--md-sys-color-on-surface-variant);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s ease;
        }

        .footer-bottom-link:hover {
          color: var(--md-sys-color-primary);
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }

          .footer-bottom-content {
            flex-direction: column;
            text-align: center;
          }

          .footer-bottom-links {
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  )
}

export { Footer }