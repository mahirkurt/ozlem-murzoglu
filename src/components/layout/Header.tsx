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

  const clinicPhone = contactInfo.phone

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      {/* Main Navigation */}
      <nav className="navbar">
        <div className="container">
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
                  className="navbar-item"
                  onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link href={item.href} className="navbar-link">
                    {item.label}
                    {item.children && (
                      <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 10l5 5 5-5z"/>
                      </svg>
                    )}
                  </Link>
                  
                  {item.children && openDropdown === item.label && (
                    <div className="dropdown-menu">
                      {item.children.map((child) => (
                        <Link key={child.href} href={child.href} className="dropdown-link">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="navbar-actions">
              <a href={`tel:${clinicPhone}`} className="btn-call">
                <svg className="icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 00-1.02.24l-2.2 2.2a15.045 15.045 0 01-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1.01A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/>
                </svg>
                <span className="btn-text">{clinicPhone}</span>
              </a>
              <Link href="/randevu" className="btn-appointment">
                <span>Randevu Al</span>
                <svg className="icon-arrow" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              <span className="menu-icon"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            {navigation.map((item) => (
              <div key={item.href} className="mobile-menu-item">
                <Link
                  href={item.href}
                  className="mobile-menu-link"
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
            <div className="mobile-menu-actions">
              <a href={`tel:${clinicPhone}`} className="mobile-btn-call">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 00-1.02.24l-2.2 2.2a15.045 15.045 0 01-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1.01A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1-1 1v-3.5c0-.55-.45-1-1-1z"/>
                </svg>
                {clinicPhone}
              </a>
              <Link href="/randevu" className="mobile-btn-appointment">
                Randevu Al
              </Link>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: var(--md-sys-color-surface);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .header-scrolled {
          background: var(--md-sys-color-surface-container);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .navbar {
          background: transparent;
          padding: 1rem 0;
          transition: padding 0.3s ease;
        }

        .header-scrolled .navbar {
          padding: 0.75rem 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .navbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          text-decoration: none;
          transition: transform 0.2s ease;
        }

        .navbar-brand:hover {
          transform: translateX(2px);
          opacity: 0.9;
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

        .navbar-menu {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
          justify-content: center;
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
          border-radius: 12px;
          transition: all 0.2s ease;
          position: relative;
        }

        .navbar-link::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: var(--md-sys-color-secondary);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }

        .navbar-link:hover {
          background: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
        }

        .navbar-link:hover::before {
          width: 30px;
        }

        .dropdown-icon {
          transition: transform 0.2s ease;
        }

        .navbar-item:hover .dropdown-icon {
          transform: rotate(180deg);
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          min-width: 280px;
          background: var(--md-sys-color-surface-container);
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          padding: 0.5rem;
          margin-top: 0.5rem;
          opacity: 0;
          transform: translateY(-10px);
          animation: dropdownIn 0.3s ease forwards;
        }

        @keyframes dropdownIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-link {
          display: block;
          padding: 0.75rem 1rem;
          color: var(--md-sys-color-on-surface);
          text-decoration: none;
          font-size: 0.9375rem;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .dropdown-link:hover {
          background: var(--md-sys-color-tertiary-container);
          color: var(--md-sys-color-on-tertiary-container);
          padding-left: 1.25rem;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .btn-call {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1rem;
          background: var(--md-sys-color-surface-container);
          color: var(--md-sys-color-secondary);
          border-radius: 20px;
          text-decoration: none;
          font-size: 0.9375rem;
          font-weight: 500;
          transition: all 0.3s ease;
          border: 1px solid var(--md-sys-color-outline-variant);
        }

        .btn-call:hover {
          background: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .btn-appointment {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, var(--md-sys-color-secondary), var(--md-sys-color-tertiary));
          color: var(--md-sys-color-on-secondary);
          border-radius: 24px;
          text-decoration: none;
          font-size: 0.9375rem;
          font-weight: 600;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .btn-appointment::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, var(--md-sys-color-tertiary), var(--md-sys-color-secondary));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .btn-appointment:hover::before {
          opacity: 1;
        }

        .btn-appointment span,
        .btn-appointment svg {
          position: relative;
          z-index: 1;
        }

        .btn-appointment:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }

        .icon-arrow {
          transition: transform 0.3s ease;
        }

        .btn-appointment:hover .icon-arrow {
          transform: translateX(4px);
        }

        .mobile-menu-toggle {
          display: none;
          width: 48px;
          height: 48px;
          align-items: center;
          justify-content: center;
          background: var(--md-sys-color-secondary-container);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mobile-menu-toggle:hover {
          background: var(--md-sys-color-secondary);
          transform: scale(1.05);
        }

        .menu-icon {
          width: 24px;
          height: 2px;
          background: var(--md-sys-color-on-secondary-container);
          position: relative;
          transition: all 0.3s ease;
        }

        .menu-icon::before,
        .menu-icon::after {
          content: '';
          position: absolute;
          width: 24px;
          height: 2px;
          background: var(--md-sys-color-on-secondary-container);
          transition: all 0.3s ease;
        }

        .menu-icon::before {
          top: -7px;
        }

        .menu-icon::after {
          bottom: -7px;
        }

        .mobile-menu {
          display: none;
          position: fixed;
          top: 80px;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--md-sys-color-surface);
          z-index: 999;
          overflow-y: auto;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .mobile-menu-content {
          padding: 2rem 1.5rem;
        }

        .mobile-menu-item {
          margin-bottom: 1rem;
        }

        .mobile-menu-link {
          display: block;
          padding: 1rem;
          color: var(--md-sys-color-on-surface);
          text-decoration: none;
          font-size: 1.125rem;
          font-weight: 500;
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .mobile-menu-link:hover {
          background: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
          padding-left: 1.25rem;
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
          font-size: 1rem;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .mobile-submenu-link:hover {
          background: var(--md-sys-color-tertiary-container);
          color: var(--md-sys-color-on-tertiary-container);
        }

        .mobile-menu-actions {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--md-sys-color-outline-variant);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .mobile-btn-call,
        .mobile-btn-appointment {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .mobile-btn-call {
          background: var(--md-sys-color-surface-container);
          color: var(--md-sys-color-secondary);
          border: 1px solid var(--md-sys-color-outline-variant);
        }

        .mobile-btn-appointment {
          background: linear-gradient(135deg, var(--md-sys-color-secondary), var(--md-sys-color-tertiary));
          color: var(--md-sys-color-on-secondary);
        }

        @media (max-width: 968px) {
          .navbar-menu,
          .btn-call {
            display: none;
          }

          .mobile-menu-toggle,
          .mobile-menu {
            display: flex;
          }

          .navbar-actions .btn-appointment {
            display: none;
          }
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
    </header>
  )
}

export default Header
export { Header }