'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { navigation, contactInfo } from '@/lib/navigation'

interface HeaderProps {
  locale?: string
}

const Header: React.FC<HeaderProps> = ({ locale = 'tr' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

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

  return (
    <>
      <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
        <div className="header-container">
          {/* Top Bar - Only on Desktop */}
          <div className="top-bar">
            <div className="top-bar-content">
              <div className="top-bar-info">
                <a href={`tel:${contactInfo.phone}`} className="info-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 00-1.02.24l-2.2 2.2a15.045 15.045 0 01-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1.01A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/>
                  </svg>
                  <span>{contactInfo.phone}</span>
                </a>
                <a href={`mailto:${contactInfo.email}`} className="info-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <span>{contactInfo.email}</span>
                </a>
              </div>
              <div className="top-bar-actions">
                <a href="https://saglikpetegim.com" target="_blank" rel="noopener noreferrer" className="patient-portal-link">
                  <span>Hasta Portalı</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="navbar">
            <div className="navbar-content">
              {/* Logo */}
              <Link href="/" className="navbar-brand">
                <img 
                  src="/logos/OM-Wide-Color.svg" 
                  alt="Dr. Özlem Murzoğlu" 
                  className="logo-wide"
                />
                <img 
                  src="/logos/OM-Icon-Color.svg" 
                  alt="Dr. Özlem Murzoğlu" 
                  className="logo-mobile"
                />
              </Link>

              {/* Desktop Navigation */}
              <div className="navbar-menu">
                {navigation.map((item) => (
                  <div
                    key={item.href}
                    className={`navbar-item ${hoveredItem === item.label ? 'active' : ''}`}
                    onMouseEnter={() => {
                      setHoveredItem(item.label)
                      if (item.children) setActiveDropdown(item.label)
                    }}
                    onMouseLeave={() => {
                      setHoveredItem(null)
                      setActiveDropdown(null)
                    }}
                  >
                    <Link href={item.href} className="navbar-link">
                      <span className="link-text">{item.label}</span>
                      {item.children && (
                        <svg className="dropdown-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7 10l5 5 5-5z"/>
                        </svg>
                      )}
                      <span className="link-indicator"></span>
                    </Link>
                    
                    {item.children && activeDropdown === item.label && (
                      <div className="dropdown-menu">
                        <div className="dropdown-content">
                          {item.children.map((child, index) => (
                            <Link 
                              key={child.href} 
                              href={child.href} 
                              className="dropdown-link"
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <div className="dropdown-link-content">
                                <span className="dropdown-link-title">{child.label}</span>
                                {child.description && (
                                  <span className="dropdown-link-description">{child.description}</span>
                                )}
                              </div>
                              <svg className="dropdown-link-arrow" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                              </svg>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="navbar-actions">
                <Link href="/randevu" className="btn-appointment">
                  <div className="btn-content">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                    </svg>
                    <span>Randevu Al</span>
                  </div>
                  <div className="btn-ripple"></div>
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                  className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Menu"
                >
                  <span className="menu-icon">
                    <span className="menu-line"></span>
                    <span className="menu-line"></span>
                    <span className="menu-line"></span>
                  </span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <img src="/logos/OM-Wide-Color.svg" alt="Dr. Özlem Murzoğlu" className="mobile-menu-logo" />
          <button 
            className="mobile-menu-close"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        
        <div className="mobile-menu-content">
          {navigation.map((item) => (
            <div key={item.href} className="mobile-menu-item">
              <Link
                href={item.href}
                className="mobile-menu-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>{item.label}</span>
                {item.children && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                )}
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
        </div>

        <div className="mobile-menu-footer">
          <Link href="/randevu" className="mobile-btn-appointment" onClick={() => setIsMobileMenuOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
            <span>Randevu Al</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: var(--md-sys-color-surface);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .header-scrolled {
          box-shadow: 0 2px 8px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06);
        }

        .header-container {
          width: 100%;
        }

        /* Top Bar */
        .top-bar {
          background: var(--md-sys-color-surface-container);
          border-bottom: 1px solid var(--md-sys-color-outline-variant);
          display: none;
        }

        @media (min-width: 968px) {
          .top-bar {
            display: block;
          }
        }

        .top-bar-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0.5rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .top-bar-info {
          display: flex;
          gap: 2rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--md-sys-color-on-surface-variant);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s ease;
        }

        .info-item:hover {
          color: var(--md-sys-color-primary);
        }

        .patient-portal-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
          border-radius: 20px;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .patient-portal-link:hover {
          background: var(--md-sys-color-primary);
          color: var(--md-sys-color-on-primary);
          transform: translateY(-1px);
        }

        /* Main Navigation */
        .navbar {
          background: var(--md-sys-color-surface);
          position: relative;
        }

        .navbar-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 3rem;
        }

        .header-scrolled .navbar-content {
          padding: 0.75rem 1.5rem;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          text-decoration: none;
          transition: transform 0.2s ease;
        }

        .navbar-brand:hover {
          transform: scale(1.02);
        }

        .logo-wide {
          height: 48px;
          width: auto;
          display: block;
        }

        .logo-mobile {
          height: 48px;
          width: auto;
          display: none;
        }

        /* Desktop Menu */
        .navbar-menu {
          display: none;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
          justify-content: center;
        }

        @media (min-width: 968px) {
          .navbar-menu {
            display: flex;
          }
        }

        .navbar-item {
          position: relative;
        }

        .navbar-link {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.75rem 1rem;
          color: var(--md-sys-color-on-surface);
          text-decoration: none;
          font-size: 0.9375rem;
          font-weight: 500;
          border-radius: 100px;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .link-text {
          position: relative;
          z-index: 1;
        }

        .dropdown-icon {
          position: relative;
          z-index: 1;
          transition: transform 0.2s ease;
        }

        .navbar-item.active .dropdown-icon {
          transform: rotate(180deg);
        }

        .link-indicator {
          position: absolute;
          inset: 0;
          background: var(--md-sys-color-secondary-container);
          border-radius: 100px;
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.2s ease;
        }

        .navbar-item:hover .link-indicator,
        .navbar-item.active .link-indicator {
          opacity: 1;
          transform: scale(1);
        }

        .navbar-item:hover .navbar-link,
        .navbar-item.active .navbar-link {
          color: var(--md-sys-color-on-secondary-container);
        }

        /* Dropdown Menu */
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 0.5rem);
          left: 50%;
          transform: translateX(-50%);
          min-width: 280px;
          background: var(--md-sys-color-surface-container);
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.12);
          padding: 0.5rem;
          opacity: 0;
          visibility: hidden;
          transform: translateX(-50%) translateY(-10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navbar-item:hover .dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
        }

        .dropdown-content {
          display: flex;
          flex-direction: column;
        }

        .dropdown-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          color: var(--md-sys-color-on-surface);
          text-decoration: none;
          border-radius: 12px;
          transition: all 0.2s ease;
          animation: dropdownItemIn 0.3s ease forwards;
          opacity: 0;
        }

        @keyframes dropdownItemIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .dropdown-link:hover {
          background: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
          padding-left: 1.25rem;
        }

        .dropdown-link-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .dropdown-link-title {
          font-weight: 500;
          font-size: 0.9375rem;
        }

        .dropdown-link-description {
          font-size: 0.8125rem;
          color: var(--md-sys-color-on-surface-variant);
          line-height: 1.3;
        }

        .dropdown-link-arrow {
          opacity: 0;
          transition: all 0.2s ease;
        }

        .dropdown-link:hover .dropdown-link-arrow {
          opacity: 1;
          transform: translateX(4px);
        }

        /* CTA Button */
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .btn-appointment {
          position: relative;
          overflow: hidden;
          display: none;
          text-decoration: none;
          border-radius: 24px;
          background: linear-gradient(135deg, var(--md-sys-color-primary) 0%, var(--md-sys-color-secondary) 100%);
          color: white;
          transition: all 0.3s ease;
        }

        @media (min-width: 968px) {
          .btn-appointment {
            display: inline-flex;
          }
        }

        .btn-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          font-size: 0.9375rem;
        }

        .btn-ripple {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
          transform: scale(0);
          transition: transform 0.5s ease;
        }

        .btn-appointment:hover .btn-ripple {
          transform: scale(2);
        }

        .btn-appointment:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }

        /* Mobile Menu Toggle */
        .mobile-menu-toggle {
          display: flex;
          width: 48px;
          height: 48px;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        @media (min-width: 968px) {
          .mobile-menu-toggle {
            display: none;
          }
        }

        .menu-icon {
          width: 24px;
          height: 20px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .menu-line {
          width: 100%;
          height: 2px;
          background: var(--md-sys-color-on-surface);
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .mobile-menu-toggle.active .menu-line:nth-child(1) {
          transform: translateY(9px) rotate(45deg);
        }

        .mobile-menu-toggle.active .menu-line:nth-child(2) {
          opacity: 0;
        }

        .mobile-menu-toggle.active .menu-line:nth-child(3) {
          transform: translateY(-9px) rotate(-45deg);
        }

        /* Mobile Overlay */
        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 1100;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .mobile-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        /* Mobile Menu */
        .mobile-menu {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 85%;
          max-width: 400px;
          background: var(--md-sys-color-surface);
          z-index: 1200;
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
        }

        .mobile-menu.active {
          transform: translateX(0);
        }

        .mobile-menu-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem;
          border-bottom: 1px solid var(--md-sys-color-outline-variant);
        }

        .mobile-menu-logo {
          height: 40px;
          width: auto;
        }

        .mobile-menu-close {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--md-sys-color-surface-container);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mobile-menu-close:hover {
          background: var(--md-sys-color-secondary-container);
        }

        .mobile-menu-content {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }

        .mobile-menu-item {
          margin-bottom: 0.5rem;
        }

        .mobile-menu-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          color: var(--md-sys-color-on-surface);
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .mobile-menu-link:hover {
          background: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
        }

        .mobile-submenu {
          margin-left: 1rem;
          margin-top: 0.5rem;
        }

        .mobile-submenu-link {
          display: block;
          padding: 0.75rem 1rem;
          color: var(--md-sys-color-on-surface-variant);
          text-decoration: none;
          font-size: 0.9375rem;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .mobile-submenu-link:hover {
          background: var(--md-sys-color-tertiary-container);
          color: var(--md-sys-color-on-tertiary-container);
        }

        .mobile-menu-footer {
          padding: 1.5rem;
          border-top: 1px solid var(--md-sys-color-outline-variant);
        }

        .mobile-btn-appointment {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, var(--md-sys-color-primary) 0%, var(--md-sys-color-secondary) 100%);
          color: white;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .mobile-btn-appointment:hover {
          transform: scale(1.02);
        }

        @media (max-width: 640px) {
          .logo-wide {
            display: none;
          }

          .logo-mobile {
            display: block;
            height: 40px;
          }
        }
      `}</style>
    </>
  )
}

export default Header
export { Header }