'use client'

import React from 'react'

interface IllustrationProps {
  type: 'sleep' | 'parenting' | 'vaccination' | 'development' | 'nutrition' | 'health'
  className?: string
}

export const BlogIllustration: React.FC<IllustrationProps> = ({ type, className = '' }) => {
  const illustrations = {
    sleep: (
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Moon and Stars */}
        <circle cx="320" cy="80" r="40" fill="#FFB74D" opacity="0.9"/>
        <path d="M320 40C338.778 40 354.112 53.0883 357.544 70.5C354.687 69.5344 351.637 69 348.5 69C333.312 69 321 81.3122 321 96.5C321 99.6366 321.534 102.687 322.5 105.544C305.088 102.112 292 86.7779 292 68C292 51.4315 303.431 40 320 40Z" fill="#FFA726"/>
        
        {/* Stars */}
        <circle cx="280" cy="60" r="3" fill="#FFD54F"/>
        <circle cx="250" cy="90" r="2" fill="#FFD54F"/>
        <circle cx="360" cy="120" r="2.5" fill="#FFD54F"/>
        <circle cx="290" cy="110" r="2" fill="#FFD54F"/>
        
        {/* Bed */}
        <rect x="80" y="180" width="200" height="80" rx="8" fill="#94BBE9"/>
        <rect x="80" y="160" width="200" height="30" rx="8" fill="#7BA7E7"/>
        
        {/* Pillow */}
        <ellipse cx="120" cy="170" rx="35" ry="20" fill="#FFFFFF"/>
        
        {/* Sleeping Child (simplified) */}
        <ellipse cx="180" cy="200" rx="60" ry="40" fill="#FDDDE6"/>
        <circle cx="160" cy="190" r="20" fill="#FFE0B2"/>
        <path d="M150 185C150 185 155 190 160 190C165 190 170 185 170 185" stroke="#005F73" strokeWidth="2" strokeLinecap="round"/>
        
        {/* ZZZ */}
        <text x="220" y="150" fontSize="24" fill="#005F73" opacity="0.6" fontWeight="bold">Z</text>
        <text x="235" y="135" fontSize="20" fill="#005F73" opacity="0.5" fontWeight="bold">Z</text>
        <text x="248" y="120" fontSize="16" fill="#005F73" opacity="0.4" fontWeight="bold">Z</text>
        
        {/* Decorative clouds */}
        <ellipse cx="100" cy="100" rx="30" ry="15" fill="#E3F2FD" opacity="0.6"/>
        <ellipse cx="120" cy="105" rx="25" ry="12" fill="#E3F2FD" opacity="0.6"/>
      </svg>
    ),
    
    parenting: (
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Parent Figure */}
        <circle cx="150" cy="120" r="35" fill="#FFB74D"/>
        <rect x="120" y="155" width="60" height="80" rx="8" fill="#FFA726"/>
        
        {/* Child Figure */}
        <circle cx="250" cy="140" r="25" fill="#94BBE9"/>
        <rect x="230" y="165" width="40" height="60" rx="6" fill="#7BA7E7"/>
        
        {/* Hearts */}
        <path d="M200 80C200 73.3726 205.373 68 212 68C215.314 68 218.313 69.3571 220.5 71.5441C222.687 69.3571 225.686 68 229 68C235.627 68 241 73.3726 241 80C241 95 220.5 110 220.5 110C220.5 110 200 95 200 80Z" fill="#FF6B6B" opacity="0.8"/>
        
        {/* Connection Lines */}
        <path d="M180 140C210 130 220 135 230 140" stroke="#FFD54F" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 5"/>
        
        {/* Stars around */}
        <path d="M100 80L105 90L116 90L107 97L111 107L100 100L89 107L93 97L84 90L95 90L100 80Z" fill="#FFD54F" opacity="0.6"/>
        <path d="M300 180L303 186L310 186L304 190L307 196L300 192L293 196L296 190L290 186L297 186L300 180Z" fill="#FFD54F" opacity="0.5"/>
        
        {/* Ground */}
        <rect x="50" y="250" width="300" height="4" rx="2" fill="#005F73" opacity="0.2"/>
        
        {/* Positive symbols */}
        <circle cx="320" cy="100" r="20" fill="#4CAF50" opacity="0.3"/>
        <path d="M310 100L315 105L330 90" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    
    vaccination: (
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Syringe */}
        <rect x="150" y="100" width="100" height="30" rx="15" fill="#005F73"/>
        <rect x="240" y="105" width="40" height="20" fill="#0A8FA3"/>
        <rect x="275" y="112" width="20" height="6" fill="#005F73"/>
        <circle cx="295" cy="115" r="3" fill="#94BBE9"/>
        
        {/* Medicine drops */}
        <circle cx="300" cy="130" r="4" fill="#94BBE9" opacity="0.8"/>
        <circle cx="305" cy="145" r="3" fill="#94BBE9" opacity="0.6"/>
        <circle cx="302" cy="158" r="2" fill="#94BBE9" opacity="0.4"/>
        
        {/* Shield (protection) */}
        <path d="M200 180C200 180 160 170 160 140V110C160 110 200 100 240 110V140C240 170 200 180 200 180Z" fill="#FFB74D" opacity="0.9"/>
        <path d="M180 130L195 145L220 120" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        
        {/* Virus particles (being blocked) */}
        <circle cx="100" cy="150" r="15" fill="#FF6B6B" opacity="0.3"/>
        <circle cx="100" cy="150" r="10" fill="#FF6B6B" opacity="0.5"/>
        <circle cx="95" cy="145" r="3" fill="#FF6B6B"/>
        <circle cx="105" cy="145" r="3" fill="#FF6B6B"/>
        <circle cx="100" cy="155" r="3" fill="#FF6B6B"/>
        
        <circle cx="300" cy="200" r="12" fill="#FF6B6B" opacity="0.2"/>
        <circle cx="300" cy="200" r="8" fill="#FF6B6B" opacity="0.4"/>
        
        {/* Health cross */}
        <rect x="190" y="50" width="20" height="40" rx="2" fill="#4CAF50"/>
        <rect x="180" y="60" width="40" height="20" rx="2" fill="#4CAF50"/>
      </svg>
    ),
    
    development: (
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Growth chart */}
        <rect x="80" y="80" width="4" height="180" fill="#005F73" opacity="0.3"/>
        <rect x="80" y="256" width="240" height="4" fill="#005F73" opacity="0.3"/>
        
        {/* Growth bars */}
        <rect x="100" y="200" width="40" height="56" rx="4" fill="#94BBE9" opacity="0.8"/>
        <rect x="160" y="160" width="40" height="96" rx="4" fill="#7BA7E7" opacity="0.8"/>
        <rect x="220" y="120" width="40" height="136" rx="4" fill="#FFB74D" opacity="0.8"/>
        <rect x="280" y="80" width="40" height="176" rx="4" fill="#FFA726" opacity="0.8"/>
        
        {/* Child figures at different ages */}
        <circle cx="120" cy="180" r="15" fill="#FFE0B2"/>
        <circle cx="180" cy="140" r="18" fill="#FFE0B2"/>
        <circle cx="240" cy="100" r="20" fill="#FFE0B2"/>
        <circle cx="300" cy="60" r="22" fill="#FFE0B2"/>
        
        {/* Arrow showing growth */}
        <path d="M100 220L300 60" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 4" opacity="0.6"/>
        <path d="M290 70L300 60L310 70" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round"/>
        
        {/* Milestone stars */}
        <path d="M120 220L122 224L127 224L123 227L125 231L120 228L115 231L117 227L113 224L118 224L120 220Z" fill="#FFD54F"/>
        <path d="M180 180L182 184L187 184L183 187L185 191L180 188L175 191L177 187L173 184L178 184L180 180Z" fill="#FFD54F"/>
        <path d="M240 140L242 144L247 144L243 147L245 151L240 148L235 151L237 147L233 144L238 144L240 140Z" fill="#FFD54F"/>
      </svg>
    ),
    
    nutrition: (
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Plate */}
        <ellipse cx="200" cy="180" rx="100" ry="30" fill="#E0E7E9"/>
        <ellipse cx="200" cy="175" rx="90" ry="25" fill="#FFFFFF"/>
        
        {/* Food items */}
        {/* Apple */}
        <circle cx="170" cy="160" r="25" fill="#FF6B6B"/>
        <path d="M170 135C170 135 175 130 180 135" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round"/>
        
        {/* Carrot */}
        <path d="M210 150L215 180L220 150" fill="#FFA726"/>
        <path d="M210 150C210 150 215 145 220 150" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round"/>
        
        {/* Broccoli */}
        <circle cx="190" cy="170" r="8" fill="#4CAF50"/>
        <circle cx="195" cy="165" r="8" fill="#4CAF50"/>
        <circle cx="185" cy="165" r="8" fill="#4CAF50"/>
        <rect x="188" y="175" width="4" height="10" fill="#66BB6A"/>
        
        {/* Milk glass */}
        <rect x="260" y="140" width="30" height="40" rx="2" fill="#E3F2FD"/>
        <rect x="260" y="140" width="30" height="25" fill="#FFFFFF"/>
        
        {/* Hearts for health */}
        <path d="M150 100C150 95 154 91 159 91C161 91 163 92 164 93C165 92 167 91 169 91C174 91 178 95 178 100C178 108 164 115 164 115C164 115 150 108 150 100Z" fill="#FF6B6B" opacity="0.6"/>
        
        {/* Utensils */}
        <rect x="120" y="170" width="3" height="40" rx="1" fill="#005F73" opacity="0.5"/>
        <circle cx="121.5" cy="165" r="5" fill="#005F73" opacity="0.5"/>
        
        <rect x="280" y="170" width="3" height="40" rx="1" fill="#005F73" opacity="0.5"/>
        <path d="M278 165L283 165L283 175L280.5 175L278 175Z" fill="#005F73" opacity="0.5"/>
      </svg>
    ),
    
    health: (
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Stethoscope */}
        <path d="M150 100C150 80 165 65 185 65C205 65 220 80 220 100" stroke="#005F73" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <circle cx="150" cy="100" r="8" fill="#005F73"/>
        <circle cx="220" cy="100" r="8" fill="#005F73"/>
        <path d="M185 65V45" stroke="#005F73" strokeWidth="3"/>
        <circle cx="185" cy="40" r="10" fill="#94BBE9"/>
        
        {/* Heart with pulse */}
        <path d="M240 140C240 130 248 122 258 122C263 122 267 124 270 127C273 124 277 122 282 122C292 122 300 130 300 140C300 160 270 180 270 180C270 180 240 160 240 140Z" fill="#FF6B6B"/>
        
        {/* Pulse line */}
        <path d="M100 200L140 200L150 180L160 220L170 190L180 210L190 200L230 200" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        
        {/* Medical cross */}
        <circle cx="320" cy="80" r="25" fill="#4CAF50" opacity="0.2"/>
        <rect x="310" y="70" width="20" height="20" fill="#4CAF50"/>
        <rect x="310" y="70" width="20" height="20" fill="#4CAF50"/>
        <path d="M310 75L330 75M320 65L320 85" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        
        {/* Child figure (healthy) */}
        <circle cx="200" cy="250" r="20" fill="#FFE0B2"/>
        <path d="M190 245C190 245 195 250 200 250C205 250 210 245 210 245" stroke="#005F73" strokeWidth="2" strokeLinecap="round"/>
        
        {/* Sparkles */}
        <circle cx="150" cy="120" r="2" fill="#FFD54F" opacity="0.8"/>
        <circle cx="250" cy="100" r="2" fill="#FFD54F" opacity="0.8"/>
        <circle cx="300" cy="220" r="2" fill="#FFD54F" opacity="0.8"/>
      </svg>
    )
  }

  return illustrations[type] || illustrations.health
}