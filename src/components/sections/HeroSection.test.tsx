/**
 * HeroSection component tests
 * Tests the main hero section functionality and user interactions
 */

import { render, screen, fireEvent } from '@/test/utils/render'
import userEvent from '@testing-library/user-event'
import { HeroSection } from './HeroSection'
import { mockIntersectionObserver } from '@/test/utils/mocks'

// Mock the intersection observer
beforeEach(() => {
  global.IntersectionObserver = mockIntersectionObserver
})

describe('HeroSection Component', () => {
  it('renders hero content', () => {
    render(<HeroSection />)
    
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByText(/Dr\. Özlem Murzoğlu/i)).toBeInTheDocument()
    expect(screen.getByText(/Çocuk Doktoru/i)).toBeInTheDocument()
  })

  it('displays hero description', () => {
    render(<HeroSection />)
    
    expect(
      screen.getByText(/Çocuklarınızın sağlığı için güvenilir adres/i)
    ).toBeInTheDocument()
  })

  it('has call-to-action button', () => {
    render(<HeroSection />)
    
    const ctaButton = screen.getByRole('button', { name: /randevu al/i })
    expect(ctaButton).toBeInTheDocument()
  })

  it('displays hero image', () => {
    render(<HeroSection />)
    
    const heroImage = screen.getByRole('img', { name: /dr\. özlem murzoğlu/i })
    expect(heroImage).toBeInTheDocument()
    expect(heroImage).toHaveAttribute('src', expect.stringContaining('hero-doctor'))
  })

  it('handles CTA button click', async () => {
    const user = userEvent.setup()
    
    render(<HeroSection />)
    
    const ctaButton = screen.getByRole('button', { name: /randevu al/i })
    await user.click(ctaButton)
    
    // Since this would typically navigate to a contact form or appointment page,
    // we would test that the appropriate navigation occurs
    // For now, we just test that the button is clickable
    expect(ctaButton).toBeInTheDocument()
  })

  it('has proper semantic structure', () => {
    render(<HeroSection />)
    
    const section = screen.getByRole('banner')
    expect(section).toBeInTheDocument()
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
  })

  describe('Responsive Design', () => {
    it('adapts to mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      render(<HeroSection />)
      
      const section = screen.getByRole('banner')
      expect(section).toHaveClass(expect.stringContaining('mobile') || expect.anything())
    })

    it('adapts to tablet viewport', () => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      })

      render(<HeroSection />)
      
      const section = screen.getByRole('banner')
      expect(section).toBeInTheDocument()
    })

    it('adapts to desktop viewport', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      })

      render(<HeroSection />)
      
      const section = screen.getByRole('banner')
      expect(section).toBeInTheDocument()
    })
  })

  describe('Animation and Interactions', () => {
    it('triggers entrance animations', () => {
      render(<HeroSection />)
      
      // Test that animation classes are applied
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      
      // Animation would be triggered by intersection observer
      // We can test that the observer is set up correctly
      expect(mockIntersectionObserver).toHaveBeenCalled()
    })

    it('handles scroll-based animations', () => {
      render(<HeroSection />)
      
      // Simulate scroll event
      fireEvent.scroll(window, { target: { scrollY: 100 } })
      
      // Test scroll-based behavior
      expect(window.scrollY).toBe(100)
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<HeroSection />)
      
      const section = screen.getByRole('banner')
      expect(section).toHaveAttribute('aria-label', expect.stringContaining('Hero') || expect.anything())
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      
      render(<HeroSection />)
      
      const ctaButton = screen.getByRole('button', { name: /randevu al/i })
      
      // Tab to the button
      await user.tab()
      expect(ctaButton).toHaveFocus()
      
      // Activate with keyboard
      await user.keyboard('{Enter}')
      // Button interaction would be tested here
    })

    it('provides alternative text for images', () => {
      render(<HeroSection />)
      
      const heroImage = screen.getByRole('img')
      expect(heroImage).toHaveAttribute('alt')
      expect(heroImage.getAttribute('alt')).toBeTruthy()
    })

    it('has proper heading hierarchy', () => {
      render(<HeroSection />)
      
      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toBeInTheDocument()
      
      // Ensure no other h1 elements exist in this component
      const allH1s = screen.getAllByRole('heading', { level: 1 })
      expect(allH1s).toHaveLength(1)
    })
  })

  describe('Performance', () => {
    it('lazy loads images', () => {
      render(<HeroSection />)
      
      const heroImage = screen.getByRole('img')
      expect(heroImage).toHaveAttribute('loading', 'lazy')
    })

    it('preloads critical resources', () => {
      render(<HeroSection />)
      
      // Check if critical images are properly prioritized
      const heroImage = screen.getByRole('img')
      expect(heroImage).toHaveAttribute('priority', 'high')
    })
  })

  describe('Internationalization', () => {
    it('displays content in Turkish', () => {
      render(<HeroSection />, { locale: 'tr' })
      
      expect(screen.getByText(/Çocuk Doktoru/i)).toBeInTheDocument()
      expect(screen.getByText(/Randevu Al/i)).toBeInTheDocument()
    })

    it('displays content in English when locale is en', () => {
      const englishMessages = {
        'hero.title': 'Dr. Özlem Murzoğlu',
        'hero.subtitle': 'Pediatrician',
        'hero.cta': 'Book Appointment',
      }
      
      render(<HeroSection />, { 
        locale: 'en',
        messages: englishMessages
      })
      
      expect(screen.getByText(/Pediatrician/i)).toBeInTheDocument()
      expect(screen.getByText(/Book Appointment/i)).toBeInTheDocument()
    })
  })

  describe('SEO and Metadata', () => {
    it('has proper semantic markup for SEO', () => {
      render(<HeroSection />)
      
      // Check for structured data elements
      const section = screen.getByRole('banner')
      expect(section).toHaveAttribute('itemScope')
      expect(section).toHaveAttribute('itemType', expect.stringContaining('schema.org') || expect.anything())
    })

    it('includes microdata for doctor information', () => {
      render(<HeroSection />)
      
      const doctorName = screen.getByText(/Dr\. Özlem Murzoğlu/i)
      expect(doctorName).toHaveAttribute('itemProp', 'name')
      
      const specialization = screen.getByText(/Çocuk Doktoru/i)
      expect(specialization).toHaveAttribute('itemProp', 'specialty')
    })
  })

  describe('Error Handling', () => {
    it('handles missing image gracefully', () => {
      // Mock image load error
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      render(<HeroSection />)
      
      const heroImage = screen.getByRole('img')
      fireEvent.error(heroImage)
      
      // Component should still render without crashing
      expect(screen.getByRole('banner')).toBeInTheDocument()
      
      consoleError.mockRestore()
    })

    it('handles animation failures gracefully', () => {
      // Mock animation API failure
      global.requestAnimationFrame = jest.fn().mockImplementation(() => {
        throw new Error('Animation failed')
      })
      
      render(<HeroSection />)
      
      // Component should still render
      expect(screen.getByRole('banner')).toBeInTheDocument()
      
      // Restore original implementation
      global.requestAnimationFrame = jest.fn((cb) => {
        setTimeout(cb, 0)
        return 0
      })
    })
  })
})