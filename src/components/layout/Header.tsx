'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { navigation, contactInfo } from '@/lib/navigation'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'

interface HeaderProps {
  locale?: string
}

const Header: React.FC<HeaderProps> = ({ locale = 'tr' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // Menü öğelerini grupla
  const primaryMenu = navigation.filter(item => 
    ['Ana Sayfa', 'Hakkımızda', 'Hizmetlerimiz', 'Makaleler'].includes(item.label)
  )
  const secondaryMenu = navigation.filter(item => 
    ['Sıkça Sorulan Sorular', 'İletişim'].includes(item.label)
  )

  return (
    <>
      <header className={`modern-header ${isScrolled ? 'scrolled' : ''}`}>
        {/* Top Info Bar - Minimal */}
        <div className="top-bar">
          <div className="container">
            <div className="top-bar-content">
              <div className="contact-info">
                <a href={`tel:${contactInfo.phone}`} className="contact-link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 00-1.02.24l-2.2 2.2a15.045 15.045 0 01-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1.01A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/>
                  </svg>
                  {contactInfo.phone}
                </a>
                <span className="separator">•</span>
                <a href={`mailto:${contactInfo.email}`} className="contact-link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  {contactInfo.email}
                </a>
              </div>
              <a href="https://saglikpetegim.com" target="_blank" rel="noopener noreferrer" className="portal-link">
                Hasta Portalı →
              </a>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="main-nav">
          <div className="container">
            <div className="nav-content">
              {/* Logo */}
              <Link href="/" className="logo">
                <img 
                  src="/logos/OM-Wide-Color.svg" 
                  alt="Dr. Özlem Murzoğlu" 
                  className="logo-wide"
                />
                <img 
                  src="/logos/OM-Icon-Color.svg" 
                  alt="Dr. Özlem Murzoğlu" 
                  className="logo-icon"
                />
              </Link>

              {/* Center Menu - Horizontal */}
              <div className="nav-menu">
                {primaryMenu.map((item) => (
                  <div
                    key={item.href}
                    className="nav-item"
                    onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link href={item.href} className="nav-link">
                      {item.label}
                    </Link>
                    
                    {/* Mega Menu Style Dropdown */}
                    {item.children && activeDropdown === item.label && (
                      <div className="mega-dropdown">
                        <div className="dropdown-container">
                          <div className="dropdown-grid">
                            {item.children.map((child) => (
                              <Link 
                                key={child.href} 
                                href={child.href} 
                                className="dropdown-card"
                              >
                                <div className="card-icon">
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                  </svg>
                                </div>
                                <div className="card-content">
                                  <h3>{child.label}</h3>
                                  {child.description && (
                                    <p>{child.description}</p>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Right Actions */}
              <div className="nav-actions">
                {secondaryMenu.map((item) => (
                  <Link key={item.href} href={item.href} className="action-link">
                    {item.label}
                  </Link>
                ))}
                <LanguageSwitcher locale={locale} />
                <Link href="/randevu" className="appointment-btn">
                  Randevu Al
                </Link>
                
                {/* Mobile Toggle */}
                <button
                  className={`mobile-toggle ${isMobileMenuOpen ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Menü"
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu - Full Screen */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-header">
          <img src="/logos/OM-Wide-Color.svg" alt="Dr. Özlem Murzoğlu" />
          <button onClick={() => setIsMobileMenuOpen(false)} className="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        
        <div className="mobile-content">
          {navigation.map((item) => (
            <div key={item.href} className="mobile-item">
              <Link
                href={item.href}
                className="mobile-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
              {item.children && (
                <div className="mobile-submenu">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="mobile-sublink"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mobile-footer">
          <div className="mobile-language">
            <LanguageSwitcher locale={locale} />
          </div>
          <Link href="/randevu" className="mobile-appointment" onClick={() => setIsMobileMenuOpen(false)}>
            Randevu Al
          </Link>
          <div className="mobile-contacts">
            <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
            <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Modern Header Design */
        .modern-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: white;
          transition: all 0.3s ease;
        }

        .modern-header.scrolled {
          box-shadow: 0 2px 20px rgba(0, 95, 115, 0.1);
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Top Bar - Minimal */
        .top-bar {
          background: var(--md-sys-color-surface-container);
          border-bottom: 1px solid var(--md-sys-color-outline-variant);
          display: none;
        }

        @media (min-width: 1024px) {
          .top-bar {
            display: block;
          }
        }

        .top-bar-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 36px;
          font-size: 13px;
        }

        .contact-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .contact-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--md-sys-color-on-surface-variant);
          text-decoration: none;
          transition: color 0.2s;
        }

        .contact-link:hover {
          color: var(--md-sys-color-primary);
        }

        .separator {
          color: var(--md-sys-color-outline-variant);
          margin: 0 8px;
        }

        .portal-link {
          padding: 4px 16px;
          background: var(--md-sys-color-primary);
          color: white;
          text-decoration: none;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .portal-link:hover {
          background: var(--md-sys-color-primary);
          transform: translateX(2px);
        }

        /* Main Navigation */
        .main-nav {
          background: white;
          position: relative;
        }

        .nav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
          gap: 40px;
        }

        .modern-header.scrolled .nav-content {
          height: 70px;
        }

        /* Logo */
        .logo {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .logo img {
          height: 40px;
          width: auto;
          transition: height 0.3s;
          object-fit: contain;
        }

        .modern-header.scrolled .logo img {
          height: 35px;
        }

        .logo-wide {
          display: block;
          max-width: 150px;
        }

        .logo-icon {
          display: none;
        }

        /* Center Menu */
        .nav-menu {
          display: none;
          align-items: center;
          gap: 8px;
        }

        @media (min-width: 1024px) {
          .nav-menu {
            display: flex;
          }
        }

        .nav-item {
          position: relative;
        }

        .nav-link {
          display: block;
          padding: 10px 16px;
          color: var(--md-sys-color-on-surface);
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          white-space: nowrap;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .nav-link:hover {
          background: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
        }

        /* Mega Dropdown */
        .mega-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          padding: 24px;
          min-width: 600px;
          opacity: 0;
          visibility: hidden;
          transform: translateX(-50%) translateY(-10px);
          transition: all 0.3s ease;
        }

        .nav-item:hover .mega-dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
        }

        .dropdown-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .dropdown-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px;
          text-decoration: none;
          border-radius: 12px;
          transition: all 0.2s;
        }

        .dropdown-card:hover {
          background: var(--md-sys-color-surface-container);
        }

        .card-icon {
          width: 40px;
          height: 40px;
          background: var(--md-sys-color-primary-container);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .card-icon svg {
          color: var(--md-sys-color-on-primary-container);
        }

        .card-content h3 {
          font-size: 15px;
          font-weight: 600;
          color: var(--md-sys-color-on-surface);
          margin: 0 0 4px 0;
        }

        .card-content p {
          font-size: 13px;
          color: var(--md-sys-color-on-surface-variant);
          margin: 0;
          line-height: 1.4;
        }

        /* Right Actions */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        @media (min-width: 768px) {
          .nav-actions {
            gap: 24px;
          }
        }

        .action-link {
          color: var(--md-sys-color-on-surface-variant);
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          white-space: nowrap;
          transition: color 0.2s;
          display: none;
        }

        @media (min-width: 1200px) {
          .action-link {
            display: block;
          }
        }

        .action-link:hover {
          color: var(--md-sys-color-primary);
        }

        .appointment-btn {
          padding: 12px 28px;
          background: var(--md-sys-color-primary);
          color: white;
          text-decoration: none;
          border-radius: 24px;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.3s;
          white-space: nowrap;
          display: none;
        }

        @media (min-width: 768px) {
          .appointment-btn {
            display: block;
          }
        }

        .appointment-btn:hover {
          background: var(--md-sys-color-primary);
          box-shadow: 0 4px 16px rgba(0, 95, 115, 0.3);
          transform: translateY(-2px);
        }

        /* Mobile Toggle */
        .mobile-toggle {
          width: 32px;
          height: 32px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        @media (min-width: 1024px) {
          .mobile-toggle {
            display: none;
          }
        }

        .mobile-toggle span {
          width: 24px;
          height: 2px;
          background: var(--md-sys-color-on-surface);
          border-radius: 2px;
          transition: all 0.3s;
        }

        .mobile-toggle.active span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .mobile-toggle.active span:nth-child(2) {
          opacity: 0;
        }

        .mobile-toggle.active span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        /* Mobile Menu */
        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: white;
          z-index: 2000;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.3s ease;
        }

        .mobile-menu.active {
          transform: translateX(0);
        }

        .mobile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid var(--md-sys-color-outline-variant);
        }

        .mobile-header img {
          height: 36px;
        }

        .close-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--md-sys-color-surface-container);
          border: none;
          border-radius: 50%;
          cursor: pointer;
        }

        .mobile-content {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .mobile-item {
          margin-bottom: 8px;
        }

        .mobile-link {
          display: block;
          padding: 16px;
          color: var(--md-sys-color-on-surface);
          text-decoration: none;
          font-size: 16px;
          font-weight: 500;
          border-radius: 12px;
          transition: background 0.2s;
        }

        .mobile-link:hover {
          background: var(--md-sys-color-surface-container);
        }

        .mobile-submenu {
          margin: 8px 0 16px 32px;
        }

        .mobile-sublink {
          display: block;
          padding: 12px;
          color: var(--md-sys-color-on-surface-variant);
          text-decoration: none;
          font-size: 14px;
          border-radius: 8px;
        }

        .mobile-sublink:hover {
          background: var(--md-sys-color-surface-container);
        }

        .mobile-footer {
          padding: 20px;
          border-top: 1px solid var(--md-sys-color-outline-variant);
        }

        .mobile-language {
          display: flex;
          justify-content: center;
          margin-bottom: 16px;
        }

        .mobile-appointment {
          display: block;
          width: 100%;
          padding: 16px;
          background: var(--md-sys-color-primary);
          color: white;
          text-align: center;
          text-decoration: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .mobile-contacts {
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: center;
        }

        .mobile-contacts a {
          color: var(--md-sys-color-on-surface-variant);
          text-decoration: none;
          font-size: 14px;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .logo-wide {
            display: none;
          }
          
          .logo-icon {
            display: block;
            height: 40px;
          }

          .nav-content {
            height: 64px;
          }

          .modern-header.scrolled .nav-content {
            height: 60px;
          }
        }
      `}</style>
    </>
  )
}

export default Header
export { Header }