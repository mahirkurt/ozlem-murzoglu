'use client'

import React, { useState } from 'react'
import { useRouter, usePathname } from '@/lib/i18n'

interface LanguageSwitcherProps {
  locale: string
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ locale }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [isAnimating, setIsAnimating] = useState(false)
  
  const handleLanguageChange = () => {
    const newLocale = locale === 'tr' ? 'en' : 'tr'
    setIsAnimating(true)
    
    // Animate then change
    setTimeout(() => {
      router.replace(pathname, { locale: newLocale })
      setIsAnimating(false)
    }, 200)
  }

  return (
    <div className="language-switcher">
      <button 
        className={`switch-button ${locale === 'en' ? 'en-active' : ''} ${isAnimating ? 'animating' : ''}`}
        onClick={handleLanguageChange}
        aria-label="Change language"
      >
        <span className="switch-track">
          <span className="switch-thumb" />
        </span>
        <span className="lang-labels">
          <span className="lang-tr">TR</span>
          <span className="lang-en">EN</span>
        </span>
      </button>

      <style jsx>{`
        .language-switcher {
          display: flex;
          align-items: center;
        }

        .switch-button {
          position: relative;
          width: 72px;
          height: 32px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          transition: transform 0.2s;
        }

        .switch-button:hover {
          transform: scale(1.05);
        }

        .switch-button:active {
          transform: scale(0.98);
        }

        .switch-button.animating {
          animation: pulse 0.3s ease;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }

        .switch-track {
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #E0E7E9 0%, #CFD8DC 100%);
          border-radius: 16px;
          border: 2px solid rgba(0, 95, 115, 0.1);
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .switch-button:hover .switch-track {
          border-color: rgba(0, 95, 115, 0.2);
          background: linear-gradient(135deg, #D5DFE2 0%, #C4CED2 100%);
        }

        .switch-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 32px;
          height: 24px;
          background: linear-gradient(135deg, #005F73 0%, #0A8FA3 100%);
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0, 95, 115, 0.3);
        }

        .switch-button.en-active .switch-thumb {
          transform: translateX(34px);
          background: linear-gradient(135deg, #FFB74D 0%, #FFA726 100%);
          box-shadow: 0 2px 8px rgba(255, 167, 38, 0.3);
        }

        .lang-labels {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;
          pointer-events: none;
          z-index: 1;
        }

        .lang-tr,
        .lang-en {
          font-size: 12px;
          font-weight: 600;
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .lang-tr {
          color: #FFFFFF;
        }

        .lang-en {
          color: rgba(0, 95, 115, 0.5);
        }

        .switch-button.en-active .lang-tr {
          color: rgba(0, 95, 115, 0.5);
        }

        .switch-button.en-active .lang-en {
          color: #FFFFFF;
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .switch-button {
            width: 64px;
            height: 28px;
          }

          .switch-thumb {
            width: 28px;
            height: 20px;
          }

          .switch-button.en-active .switch-thumb {
            transform: translateX(30px);
          }

          .lang-tr,
          .lang-en {
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  )
}