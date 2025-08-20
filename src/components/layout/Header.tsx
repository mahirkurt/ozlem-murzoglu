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
    ['Ana Sayfa', 'Hakkımızda', 'Hizmetlerimiz', 'Makaleler', 'İletişim'].includes(item.label)
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
                      {item.children && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="dropdown-icon">
                          <path d="M7 10l5 5 5-5z"/>
                        </svg>
                      )}
                    </Link>
                    
                    {/* Dropdown Menu */}
                    {item.children && activeDropdown === item.label && (
                      <div className="dropdown-menu">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="dropdown-link"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Right Actions */}
              <div className="nav-actions">
                <LanguageSwitcher locale={locale} />
                <Link href="/randevu" className="appointment-btn">
                  <span>Randevu Al</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <img src="/logos/OM-Wide-Color.svg" alt="Dr. Özlem Murzoğlu" />
          <button
            className="mobile-menu-close"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <nav className="mobile-menu-nav">
          {primaryMenu.map((item) => (
            <div key={item.href} className="mobile-menu-item">
              <Link href={item.href} className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>
                {item.label}
              </Link>
              {item.children && (
                <div className="mobile-submenu">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="mobile-submenu-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="mobile-menu-footer">
          <LanguageSwitcher locale={locale} />
          <Link href="/randevu" className="mobile-appointment-btn" onClick={() => setIsMobileMenuOpen(false)}>
            Randevu Al
          </Link>
        </div>
      </div>

      <style jsx>{`
        /* Header Container */
        .modern-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #FFFFFF;
          box-shadow: 0 2px 8px rgba(0, 95, 115, 0.08);
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .modern-header.scrolled {
          box-shadow: 0 4px 20px rgba(0, 95, 115, 0.12);
        }

        /* Top Bar */
        .top-bar {
          background: linear-gradient(135deg, #005F73 0%, #0A8FA3 100%);
          color: white;
          padding: 6px 0;
          font-size: 13px;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .top-bar-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .contact-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .contact-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: white;
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .contact-link:hover {
          opacity: 0.9;
        }

        .contact-link svg {
          opacity: 0.9;
        }

        .separator {
          opacity: 0.4;
        }

        .portal-link {
          color: white;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s;
          padding: 4px 12px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
        }

        .portal-link:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        /* Main Navigation */
        .main-nav {
          background: white;
          padding: 16px 0;
          border-bottom: 1px solid rgba(0, 95, 115, 0.08);
        }

        .nav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 48px;
        }

        /* Logo */
        .logo {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .logo img {
          height: 48px;
          width: auto;
          transition: height 0.3s;
          object-fit: contain;
        }

        .modern-header.scrolled .logo img {
          height: 40px;
        }

        .logo-wide {
          display: block;
          max-width: 200px;
        }

        .logo-icon {
          display: none;
        }

        /* Center Menu */
        .nav-menu {
          display: none;
          align-items: center;
          gap: 8px;
          flex: 1;
          justify-content: center;
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
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 10px 16px;
          margin: 0 4px;
          color: var(--md-sys-color-on-surface);
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          white-space: nowrap;
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 16px;
          right: 16px;
          height: 3px;
          background: linear-gradient(90deg, #FFB74D, #FFA726);
          border-radius: 2px;
          transform: scaleX(0);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-link:hover {
          color: #005F73;
          background: rgba(0, 95, 115, 0.04);
        }

        .nav-link:hover::after {
          transform: scaleX(1);
        }

        .dropdown-icon {
          margin-left: 2px;
          transition: transform 0.3s;
        }

        .nav-item:hover .dropdown-icon {
          transform: rotate(180deg);
        }

        /* Dropdown Menu */
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 95, 115, 0.15);
          padding: 8px;
          min-width: 260px;
          opacity: 0;
          transform: translateX(-50%) translateY(-10px);
          animation: dropdownSlide 0.3s ease forwards;
          border: 1px solid rgba(0, 95, 115, 0.08);
          z-index: 1000;
        }

        @keyframes dropdownSlide {
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .dropdown-link {
          display: block;
          padding: 12px 16px;
          margin: 2px 0;
          color: var(--md-sys-color-on-surface);
          text-decoration: none;
          font-size: 14px;
          border-radius: 8px;
          transition: all 0.2s;
          white-space: nowrap;
          line-height: 1.4;
        }

        .dropdown-link:hover {
          background: linear-gradient(135deg, rgba(255, 183, 77, 0.1), rgba(255, 167, 38, 0.1));
          color: #005F73;
          padding-left: 20px;
        }

        /* Right Actions */
        .nav-actions {
          display: none;
          align-items: center;
          gap: 16px;
        }

        @media (min-width: 1024px) {
          .nav-actions {
            display: flex;
          }
        }

        .appointment-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          background: linear-gradient(135deg, #FFB74D 0%, #FFA726 100%);
          color: #005F73;
          text-decoration: none;
          font-weight: 600;
          font-size: 15px;
          border-radius: 28px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(255, 167, 38, 0.3);
        }

        .appointment-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 167, 38, 0.4);
          background: linear-gradient(135deg, #FFA726 0%, #FF9800 100%);
        }

        .appointment-btn svg {
          transition: transform 0.3s;
        }

        .appointment-btn:hover svg {
          transform: rotate(15deg);
        }

        /* Mobile Menu Toggle */
        .mobile-menu-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        @media (min-width: 1024px) {
          .mobile-menu-toggle {
            display: none;
          }
        }

        .hamburger {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 24px;
          height: 24px;
          position: relative;
        }

        .hamburger span {
          display: block;
          width: 100%;
          height: 2px;
          background: var(--md-sys-color-on-surface);
          border-radius: 2px;
          transition: all 0.3s;
          position: absolute;
        }

        .hamburger span:nth-child(1) {
          top: 6px;
        }

        .hamburger span:nth-child(2) {
          top: 50%;
          transform: translateY(-50%);
        }

        .hamburger span:nth-child(3) {
          bottom: 6px;
        }

        .hamburger.active span:nth-child(1) {
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
        }

        .hamburger.active span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.active span:nth-child(3) {
          bottom: 50%;
          transform: translateY(50%) rotate(-45deg);
        }

        /* Mobile Menu */
        .mobile-menu {
          position: fixed;
          top: 0;
          right: -100%;
          width: 100%;
          max-width: 400px;
          height: 100vh;
          background: white;
          box-shadow: -4px 0 24px rgba(0, 0, 0, 0.1);
          z-index: 1001;
          transition: right 0.3s ease;
          overflow-y: auto;
        }

        .mobile-menu.active {
          right: 0;
        }

        .mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid rgba(0, 95, 115, 0.1);
        }

        .mobile-menu-header img {
          height: 32px;
        }

        .mobile-menu-close {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
        }

        .mobile-menu-nav {
          padding: 20px;
        }

        .mobile-menu-item {
          margin-bottom: 8px;
        }

        .mobile-menu-link {
          display: block;
          padding: 12px 16px;
          color: var(--md-sys-color-on-surface);
          text-decoration: none;
          font-size: 16px;
          font-weight: 500;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .mobile-menu-link:hover {
          background: rgba(0, 95, 115, 0.05);
        }

        .mobile-submenu {
          margin-top: 4px;
          margin-left: 16px;
          padding-left: 16px;
          border-left: 2px solid rgba(0, 95, 115, 0.1);
        }

        .mobile-submenu-link {
          display: block;
          padding: 8px 12px;
          color: var(--md-sys-color-on-surface-variant);
          text-decoration: none;
          font-size: 14px;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .mobile-submenu-link:hover {
          background: rgba(255, 183, 77, 0.1);
        }

        .mobile-menu-footer {
          padding: 20px;
          border-top: 1px solid rgba(0, 95, 115, 0.1);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .mobile-appointment-btn {
          display: block;
          text-align: center;
          padding: 14px 24px;
          background: linear-gradient(135deg, #FFB74D 0%, #FFA726 100%);
          color: #005F73;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          border-radius: 28px;
          transition: all 0.2s;
        }

        .mobile-appointment-btn:hover {
          background: linear-gradient(135deg, #FFA726 0%, #FF9800 100%);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .top-bar {
            display: none;
          }

          .main-nav {
            padding: 12px 0;
          }

          .logo-wide {
            display: none;
          }

          .logo-icon {
            display: block;
            height: 36px;
          }

          .container {
            padding: 0 16px;
          }
        }
      `}</style>
    </>
  )
}

export { Header }