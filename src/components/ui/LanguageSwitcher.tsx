'use client'

import React, { useState } from 'react'
import { useRouter, usePathname } from '@/lib/i18n'
import { localeConfig } from '@/lib/i18n'

interface LanguageSwitcherProps {
  locale: string
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ locale }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
    setIsOpen(false)
  }

  const currentConfig = localeConfig[locale as keyof typeof localeConfig]

  return (
    <div className="language-switcher">
      <button
        className="switcher-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change language"
      >
        <span className="flag">{currentConfig.flag}</span>
        <span className="name">{currentConfig.code.toUpperCase()}</span>
        <svg 
          className={`arrow ${isOpen ? 'open' : ''}`}
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      </button>

      {isOpen && (
        <div className="dropdown">
          {Object.entries(localeConfig).map(([key, config]) => (
            <button
              key={key}
              className={`dropdown-item ${key === locale ? 'active' : ''}`}
              onClick={() => handleLanguageChange(key)}
            >
              <span className="flag">{config.flag}</span>
              <span className="name">{config.name}</span>
              {key === locale && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .language-switcher {
          position: relative;
        }

        .switcher-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: var(--md-sys-color-surface-container);
          border: 1px solid var(--md-sys-color-outline-variant);
          border-radius: var(--md-sys-shape-corner-full);
          color: var(--md-sys-color-on-surface);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
        }

        .switcher-button:hover {
          background: var(--md-sys-color-surface-container-high);
          border-color: var(--md-sys-color-outline);
        }

        .flag {
          font-size: 18px;
          line-height: 1;
        }

        .arrow {
          transition: transform var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
        }

        .arrow.open {
          transform: rotate(180deg);
        }

        .dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 180px;
          background: var(--md-sys-color-surface-container);
          border: 1px solid var(--md-sys-color-outline-variant);
          border-radius: var(--md-sys-shape-corner-medium);
          box-shadow: var(--md-sys-elevation-level2);
          padding: 8px;
          z-index: 1000;
          animation: fadeIn var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-emphasized-decelerate);
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px;
          background: transparent;
          border: none;
          border-radius: var(--md-sys-shape-corner-small);
          color: var(--md-sys-color-on-surface);
          font-size: 14px;
          text-align: left;
          cursor: pointer;
          transition: all var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
        }

        .dropdown-item:hover {
          background: var(--md-sys-color-surface-container-high);
        }

        .dropdown-item.active {
          background: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
        }

        .dropdown-item svg {
          margin-left: auto;
          color: var(--md-sys-color-secondary);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 640px) {
          .switcher-button {
            padding: 6px 12px;
            font-size: 13px;
          }

          .flag {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  )
}