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
      <header className={`md-header ${isScrolled ? 'md-header--scrolled' : ''}`}>
        {/* Top Bar - Desktop Only */}
        <div className="md-top-bar">
          <div className="md-container">
            <div className="md-top-bar__content">
              <div className="md-top-bar__info">
                <a href={`tel:${contactInfo.phone}`} className="md-info-chip">
                  <svg className="md-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 00-1.02.24l-2.2 2.2a15.045 15.045 0 01-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1.01A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/>
                  </svg>
                  <span>{contactInfo.phone}</span>
                </a>
                <a href={`mailto:${contactInfo.email}`} className="md-info-chip">
                  <svg className="md-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <span>{contactInfo.email}</span>
                </a>
              </div>
              <a href="https://saglikpetegim.com" target="_blank" rel="noopener noreferrer" className="md-button md-button--tonal md-button--small">
                <span>Hasta Portalı</span>
                <svg className="md-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="md-navbar">
          <div className="md-container">
            <div className="md-navbar__content">
              {/* Logo */}
              <Link href="/" className="md-navbar__brand">
                <img 
                  src="/logos/OM-Wide-Color.svg" 
                  alt="Dr. Özlem Murzoğlu" 
                  className="md-logo md-logo--wide"
                />
                <img 
                  src="/logos/OM-Icon-Color.svg" 
                  alt="Dr. Özlem Murzoğlu" 
                  className="md-logo md-logo--mobile"
                />
              </Link>

              {/* Desktop Navigation */}
              <div className="md-navbar__menu">
                {navigation.map((item) => (
                  <div
                    key={item.href}
                    className="md-navbar__item"
                    onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link href={item.href} className="md-navbar__link">
                      <span>{item.label}</span>
                      {item.children && (
                        <svg className="md-icon md-icon--dropdown" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7 10l5 5 5-5z"/>
                        </svg>
                      )}
                    </Link>
                    
                    {item.children && activeDropdown === item.label && (
                      <div className="md-dropdown">
                        {item.children.map((child) => (
                          <Link 
                            key={child.href} 
                            href={child.href} 
                            className="md-dropdown__item"
                          >
                            <div className="md-dropdown__content">
                              <span className="md-dropdown__title">{child.label}</span>
                              {child.description && (
                                <span className="md-dropdown__description">{child.description}</span>
                              )}
                            </div>
                            <svg className="md-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                            </svg>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="md-navbar__actions">
                <Link href="/randevu" className="md-button md-button--filled">
                  <svg className="md-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                  <span>Randevu Al</span>
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                  className={`md-icon-button md-navbar__toggle ${isMobileMenuOpen ? 'md-navbar__toggle--active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Menu"
                >
                  <span className="md-navbar__toggle-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div className={`md-mobile-overlay ${isMobileMenuOpen ? 'md-mobile-overlay--active' : ''}`} onClick={() => setIsMobileMenuOpen(false)} />
      
      <div className={`md-mobile-menu ${isMobileMenuOpen ? 'md-mobile-menu--active' : ''}`}>
        <div className="md-mobile-menu__header">
          <img src="/logos/OM-Wide-Color.svg" alt="Dr. Özlem Murzoğlu" className="md-logo" />
          <button 
            className="md-icon-button"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Kapat"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        
        <div className="md-mobile-menu__content">
          {navigation.map((item) => (
            <div key={item.href} className="md-mobile-menu__item">
              <Link
                href={item.href}
                className="md-mobile-menu__link"
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
                <div className="md-mobile-menu__submenu">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="md-mobile-menu__sublink"
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

        <div className="md-mobile-menu__footer">
          <Link href="/randevu" className="md-button md-button--filled md-button--block" onClick={() => setIsMobileMenuOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
            <span>Randevu Al</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        /* Header Base */
        .md-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: var(--md-sys-color-surface);
          transition: all var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard);
        }

        .md-header--scrolled {
          box-shadow: var(--md-sys-elevation-level2);
        }

        .md-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Top Bar */
        .md-top-bar {
          background: var(--md-sys-color-surface-container);
          border-bottom: 1px solid var(--md-sys-color-outline-variant);
          display: none;
        }

        @media (min-width: 968px) {
          .md-top-bar {
            display: block;
          }
        }

        .md-top-bar__content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
        }

        .md-top-bar__info {
          display: flex;
          gap: 24px;
        }

        .md-info-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--md-sys-color-on-surface-variant);
          text-decoration: none;
          font-size: 14px;
          transition: color var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
        }

        .md-info-chip:hover {
          color: var(--md-sys-color-primary);
        }

        /* Navigation Bar */
        .md-navbar {
          background: var(--md-sys-color-surface);
        }

        .md-navbar__content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
          gap: 48px;
        }

        .md-header--scrolled .md-navbar__content {
          height: 64px;
        }

        .md-navbar__brand {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .md-logo {
          height: 48px;
          width: auto;
          transition: height var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
        }

        .md-header--scrolled .md-logo {
          height: 40px;
        }

        .md-logo--wide {
          display: block;
        }

        .md-logo--mobile {
          display: none;
        }

        /* Desktop Menu */
        .md-navbar__menu {
          display: none;
          align-items: center;
          gap: 4px;
          flex: 1;
          justify-content: center;
        }

        @media (min-width: 968px) {
          .md-navbar__menu {
            display: flex;
          }
        }

        .md-navbar__item {
          position: relative;
        }

        .md-navbar__link {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 12px;
          height: 40px;
          color: var(--md-sys-color-on-surface);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          border-radius: var(--md-sys-shape-corner-full);
          transition: all var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
          position: relative;
        }

        .md-navbar__link::before {
          content: '';
          position: absolute;
          inset: 0;
          background: currentColor;
          opacity: 0;
          border-radius: inherit;
          transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
        }

        .md-navbar__link:hover::before {
          opacity: var(--md-sys-state-hover-opacity);
        }

        .md-navbar__link:focus-visible {
          outline: 2px solid var(--md-sys-color-primary);
          outline-offset: 2px;
        }

        /* Dropdown */
        .md-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 50%;
          transform: translateX(-50%);
          min-width: 280px;
          background: var(--md-sys-color-surface-container);
          border-radius: var(--md-sys-shape-corner-large);
          box-shadow: var(--md-sys-elevation-level2);
          padding: 8px;
          opacity: 0;
          visibility: hidden;
          transform: translateX(-50%) translateY(-8px);
          transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-emphasized-decelerate);
        }

        .md-navbar__item:hover .md-dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
        }

        .md-dropdown__item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          color: var(--md-sys-color-on-surface);
          text-decoration: none;
          border-radius: var(--md-sys-shape-corner-medium);
          transition: all var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
        }

        .md-dropdown__item:hover {
          background: var(--md-sys-color-secondary-container);
        }

        .md-dropdown__content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .md-dropdown__title {
          font-size: 14px;
          font-weight: 500;
        }

        .md-dropdown__description {
          font-size: 12px;
          color: var(--md-sys-color-on-surface-variant);
        }

        /* Actions */
        .md-navbar__actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Buttons */
        .md-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 24px;
          height: 40px;
          border: none;
          border-radius: var(--md-sys-shape-corner-full);
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
          transition: all var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
          position: relative;
          overflow: hidden;
        }

        .md-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: currentColor;
          opacity: 0;
          transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
        }

        .md-button:hover::before {
          opacity: var(--md-sys-state-hover-opacity);
        }

        .md-button--filled {
          background: var(--md-sys-color-primary);
          color: var(--md-sys-color-on-primary);
          display: none;
        }

        @media (min-width: 968px) {
          .md-button--filled {
            display: inline-flex;
          }
        }

        .md-button--filled:hover {
          box-shadow: var(--md-sys-elevation-level1);
        }

        .md-button--tonal {
          background: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
        }

        .md-button--small {
          height: 32px;
          padding: 0 16px;
          font-size: 12px;
        }

        .md-button--block {
          width: 100%;
        }

        /* Icon Button */
        .md-icon-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          padding: 0;
          border: none;
          border-radius: var(--md-sys-shape-corner-full);
          background: transparent;
          color: var(--md-sys-color-on-surface);
          cursor: pointer;
          transition: all var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
          position: relative;
        }

        .md-icon-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: currentColor;
          opacity: 0;
          border-radius: inherit;
          transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
        }

        .md-icon-button:hover::before {
          opacity: var(--md-sys-state-hover-opacity);
        }

        /* Mobile Menu Toggle */
        .md-navbar__toggle {
          display: flex;
        }

        @media (min-width: 968px) {
          .md-navbar__toggle {
            display: none;
          }
        }

        .md-navbar__toggle-icon {
          width: 24px;
          height: 18px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .md-navbar__toggle-icon span {
          width: 100%;
          height: 2px;
          background: currentColor;
          border-radius: 1px;
          transition: all var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
          transform-origin: center;
        }

        .md-navbar__toggle--active .md-navbar__toggle-icon span:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
        }

        .md-navbar__toggle--active .md-navbar__toggle-icon span:nth-child(2) {
          opacity: 0;
        }

        .md-navbar__toggle--active .md-navbar__toggle-icon span:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg);
        }

        /* Mobile Overlay */
        .md-mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1998;
          opacity: 0;
          visibility: hidden;
          transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
        }

        .md-mobile-overlay--active {
          opacity: 1;
          visibility: visible;
        }

        /* Mobile Menu */
        .md-mobile-menu {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 85%;
          max-width: 400px;
          background: var(--md-sys-color-surface);
          z-index: 1999;
          transform: translateX(100%);
          transition: transform var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized);
          display: flex;
          flex-direction: column;
        }

        .md-mobile-menu--active {
          transform: translateX(0);
          box-shadow: var(--md-sys-elevation-level3);
        }

        .md-mobile-menu__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-bottom: 1px solid var(--md-sys-color-outline-variant);
        }

        .md-mobile-menu__header .md-logo {
          height: 32px;
        }

        .md-mobile-menu__content {
          flex: 1;
          overflow-y: auto;
          padding: 8px;
        }

        .md-mobile-menu__item {
          margin-bottom: 4px;
        }

        .md-mobile-menu__link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          color: var(--md-sys-color-on-surface);
          text-decoration: none;
          font-size: 16px;
          font-weight: 500;
          border-radius: var(--md-sys-shape-corner-medium);
          transition: all var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
        }

        .md-mobile-menu__link:hover {
          background: var(--md-sys-color-secondary-container);
        }

        .md-mobile-menu__submenu {
          margin-left: 16px;
          margin-top: 4px;
        }

        .md-mobile-menu__sublink {
          display: block;
          padding: 12px 16px;
          color: var(--md-sys-color-on-surface-variant);
          text-decoration: none;
          font-size: 14px;
          border-radius: var(--md-sys-shape-corner-small);
          transition: all var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
        }

        .md-mobile-menu__sublink:hover {
          background: var(--md-sys-color-tertiary-container);
          color: var(--md-sys-color-on-tertiary-container);
        }

        .md-mobile-menu__footer {
          padding: 16px;
          border-top: 1px solid var(--md-sys-color-outline-variant);
        }

        /* Icons */
        .md-icon {
          flex-shrink: 0;
        }

        .md-icon--dropdown {
          transition: transform var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
        }

        .md-navbar__item:hover .md-icon--dropdown {
          transform: rotate(180deg);
        }

        /* Responsive */
        @media (max-width: 640px) {
          .md-logo--wide {
            display: none;
          }

          .md-logo--mobile {
            display: block;
            height: 40px;
          }

          .md-header--scrolled .md-logo--mobile {
            height: 36px;
          }

          .md-container {
            padding: 0 16px;
          }
        }
      `}</style>
    </>
  )
}

export default Header
export { Header }