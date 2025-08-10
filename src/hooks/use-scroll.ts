'use client'

import { useEffect, useState } from 'react'

export function useScroll() {
  const [scrollY, setScrollY] = useState(0)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null)

  useEffect(() => {
    let lastScrollY = window.pageYOffset
    let ticking = false

    const updateScrollY = () => {
      const scrollY = window.pageYOffset

      setScrollDirection(scrollY > lastScrollY ? 'down' : 'up')
      setScrollY(scrollY)

      lastScrollY = scrollY > 0 ? scrollY : 0
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollY)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return {
    scrollY,
    scrollDirection,
    isAtTop: scrollY === 0,
    isScrolledDown: scrollY > 100
  }
}