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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const emergencyPhone = contactInfo.mobile
  const clinicPhone = contactInfo.phone

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      {/* Emergency Banner */}
      <div className="emergency-banner">
        <div className="container">
          <span className="emergency-text">Acil Durumlar:</span>
          <a href={`tel:${emergencyPhone}`} className="emergency-phone">
            {emergencyPhone}
          </a>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            {/* Logo */}
            <Link href="/" className="navbar-brand">
              <div className="logo-container">
                <svg className="logo" viewBox="0 0 48 48" fill="currentColor">
                  <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 30c-5.52 0-10-4.48-10-10s4.48-10 10-10 10 4.48 10 10-4.48 10-10 10z"/>
                </svg>
              </div>
              <div className="brand-text">
                <h1 className="brand-title">Sağlık Peteğim</h1>
                <p className="brand-subtitle">Dr. Özlem Murzoğlu</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="navbar-menu desktop-only">
              <ul className="nav-list">
                {navigation.map((item) => (
                  <li 
                    key={item.href} 
                    className="nav-item"
                    onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {item.children ? (
                      <>
                        <button className="nav-link nav-link-dropdown">
                          <span>{item.label}</span>
                          <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {openDropdown === item.label && (
                          <div className="dropdown-menu">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="dropdown-item"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link href={item.href} className="nav-link">
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              {/* Action Buttons */}
              <div className="navbar-actions">
                <a
                  href={`tel:${clinicPhone}`}
                  className="btn-icon"
                  aria-label="Telefon"
                >
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </a>

                <Link href="/randevu" className="btn btn-primary">
                  Randevu Al
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="btn-icon mobile-only"
              aria-label="Menü"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="mobile-menu">
              <ul className="mobile-nav-list">
                {navigation.map((item) => (
                  <li key={item.href} className="mobile-nav-item">
                    {item.children ? (
                      <div>
                        <button
                          className="mobile-nav-link"
                          onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                        >
                          <span>{item.label}</span>
                          <svg 
                            className={`dropdown-icon ${openDropdown === item.label ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {openDropdown === item.label && (
                          <div className="mobile-dropdown">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="mobile-dropdown-item"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="mobile-nav-link"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              <div className="mobile-actions">
                <a
                  href={`tel:${clinicPhone}`}
                  className="mobile-phone-link"
                >
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{clinicPhone}</span>
                </a>

                <Link
                  href="/randevu"
                  className="btn btn-primary btn-block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Randevu Al
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background-color: var(--md-sys-color-surface);
          transition: all 0.3s ease;
        }

        .header-scrolled {
          background-color: var(--md-sys-color-surface);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .emergency-banner {
          background-color: var(--md-sys-color-error);
          color: var(--md-sys-color-on-error);
          padding: 0.5rem 0;
          text-align: center;
        }

        .emergency-text {
          font-weight: 500;
          margin-right: 0.5rem;
        }

        .emergency-phone {
          font-weight: 700;
          color: var(--md-sys-color-on-error);
          text-decoration: none;
        }

        .emergency-phone:hover {
          text-decoration: underline;
        }

        .navbar {
          background-color: var(--md-sys-color-surface);
          border-bottom: 1px solid var(--md-sys-color-outline-variant);
        }

        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .navbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: var(--md-sys-color-primary);
        }

        .logo-container {
          width: 40px;
          height: 40px;
        }

        .logo {
          width: 100%;
          height: 100%;
          color: var(--md-sys-color-primary);
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-title {
          font-size: 1.125rem;
          font-weight: 700;
          line-height: 1.2;
          color: var(--md-sys-color-on-surface);
          margin: 0;
        }

        .brand-subtitle {
          font-size: 0.75rem;
          color: var(--md-sys-color-on-surface-variant);
          margin: 0;
        }

        .navbar-menu {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-list {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 1.5rem;
        }

        .nav-item {
          position: relative;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem 0.75rem;
          color: var(--md-sys-color-on-surface);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
          border-radius: 8px;
        }

        .nav-link:hover {
          color: var(--md-sys-color-primary);
          background-color: var(--md-sys-color-primary-container);
        }

        .nav-link-dropdown {
          background: none;
          border: none;
          cursor: pointer;
          font-size: inherit;
          font-family: inherit;
        }

        .dropdown-icon {
          width: 16px;
          height: 16px;
          transition: transform 0.2s ease;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 0.5rem;
          min-width: 200px;
          background-color: var(--md-sys-color-surface-container);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 0.5rem;
          z-index: 100;
        }

        .dropdown-item {
          display: block;
          padding: 0.75rem 1rem;
          color: var(--md-sys-color-on-surface);
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .dropdown-item:hover {
          background-color: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .btn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: transparent;
          color: var(--md-sys-color-on-surface-variant);
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-icon:hover {
          background-color: var(--md-sys-color-surface-container);
          color: var(--md-sys-color-on-surface);
        }

        .icon {
          width: 20px;
          height: 20px;
        }

        .desktop-only {
          display: flex;
        }

        .mobile-only {
          display: none;
        }

        .mobile-menu {
          display: none;
          background-color: var(--md-sys-color-surface-container);
          border-radius: 12px;
          margin-top: 1rem;
          padding: 1rem;
        }

        .mobile-nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .mobile-nav-item {
          border-bottom: 1px solid var(--md-sys-color-outline-variant);
          padding: 0.5rem 0;
        }

        .mobile-nav-item:last-child {
          border-bottom: none;
        }

        .mobile-nav-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 0.75rem;
          color: var(--md-sys-color-on-surface);
          text-decoration: none;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          font-size: inherit;
          font-family: inherit;
          text-align: left;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .mobile-nav-link:hover {
          background-color: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
        }

        .mobile-dropdown {
          padding-left: 1rem;
          margin-top: 0.5rem;
        }

        .mobile-dropdown-item {
          display: block;
          padding: 0.5rem 0.75rem;
          color: var(--md-sys-color-on-surface-variant);
          text-decoration: none;
          font-size: 0.875rem;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .mobile-dropdown-item:hover {
          background-color: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
        }

        .mobile-actions {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--md-sys-color-outline-variant);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .mobile-phone-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          color: var(--md-sys-color-on-surface-variant);
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .mobile-phone-link:hover {
          background-color: var(--md-sys-color-surface-container-high);
          color: var(--md-sys-color-on-surface);
        }

        .btn-block {
          width: 100%;
        }

        .rotate-180 {
          transform: rotate(180deg);
        }

        @media (max-width: 1024px) {
          .desktop-only {
            display: none;
          }

          .mobile-only {
            display: flex;
          }

          .mobile-menu {
            display: block;
          }
        }
      `}</style>
    </header>
  )
}

export { Header }