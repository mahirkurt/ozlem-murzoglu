/**
 * Test mocks and utilities
 * Common mock functions and data for testing
 */

import { faker } from '@faker-js/faker'

// Mock data generators
export const mockContactFormData = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  message: faker.lorem.paragraph(),
}

export const mockDoctorData = {
  name: 'Dr. Özlem Murzoğlu',
  title: 'Çocuk Doktoru',
  specialization: 'Pediatri',
  experience: '15+ yıl deneyim',
  education: 'İstanbul Üniversitesi Tıp Fakültesi',
  certifications: ['Türk Pediatri Derneği Üyesi', 'Avrupa Pediatri Derneği Üyesi'],
}

export const mockServicesData = [
  {
    id: 'general-checkup',
    title: 'Genel Muayene',
    description: 'Çocuklarınız için kapsamlı sağlık kontrolü',
    icon: '🩺',
  },
  {
    id: 'vaccination',
    title: 'Aşılama',
    description: 'Dünya Sağlık Örgütü standartlarında aşılama programı',
    icon: '💉',
  },
  {
    id: 'growth-monitoring',
    title: 'Büyüme Takibi',
    description: 'Çocuğunuzun büyüme ve gelişiminin takibi',
    icon: '📊',
  },
]

export const mockClinicData = {
  name: 'Dr. Özlem Murzoğlu Çocuk Doktoru',
  address: 'Örnek Mahallesi, Sağlık Sokak No:123, İstanbul',
  phone: '+90 (212) 555-0123',
  email: 'info@saglikpetegim.com',
  workingHours: {
    weekdays: '09:00 - 18:00',
    saturday: '09:00 - 13:00',
    sunday: 'Kapalı',
  },
  coordinates: {
    lat: 41.0082,
    lng: 28.9784,
  },
}

// Mock API responses
export const mockApiResponses = {
  contactForm: {
    success: {
      message: 'Mesajınız başarıyla gönderildi',
      status: 'success',
    },
    error: {
      message: 'Mesaj gönderilirken bir hata oluştu',
      status: 'error',
    },
    validation: {
      message: 'Lütfen tüm alanları doldurun',
      status: 'validation_error',
      errors: {
        name: 'Ad alanı zorunludur',
        email: 'Geçerli bir e-posta adresi girin',
        message: 'Mesaj alanı zorunludur',
      },
    },
  },
}

// Mock functions
export const mockIntersectionObserver = jest.fn(() => ({
  disconnect: jest.fn(),
  observe: jest.fn(),
  unobserve: jest.fn(),
}))

export const mockResizeObserver = jest.fn(() => ({
  disconnect: jest.fn(),
  observe: jest.fn(),
  unobserve: jest.fn(),
}))

export const mockMatchMedia = (matches: boolean = false) => 
  jest.fn(() => ({
    matches,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }))

// Mock form submissions
export const mockFormSubmission = {
  success: jest.fn().mockResolvedValue(mockApiResponses.contactForm.success),
  error: jest.fn().mockRejectedValue(new Error('Network error')),
  validation: jest.fn().mockRejectedValue({
    response: {
      data: mockApiResponses.contactForm.validation,
    },
  }),
}

// Mock analytics
export const mockAnalytics = {
  track: jest.fn(),
  page: jest.fn(),
  identify: jest.fn(),
}

// Mock scroll functions
export const mockScrollTo = jest.fn()
export const mockScrollIntoView = jest.fn()

// Setup global mocks
export function setupGlobalMocks() {
  // IntersectionObserver
  global.IntersectionObserver = mockIntersectionObserver

  // ResizeObserver
  global.ResizeObserver = mockResizeObserver

  // matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockMatchMedia(),
  })

  // scrollTo
  Object.defineProperty(window, 'scrollTo', {
    value: mockScrollTo,
    writable: true,
  })

  // scrollIntoView
  Element.prototype.scrollIntoView = mockScrollIntoView

  // requestAnimationFrame
  global.requestAnimationFrame = jest.fn((cb) => {
    setTimeout(cb, 0)
    return 0
  })

  // cancelAnimationFrame
  global.cancelAnimationFrame = jest.fn()
}

// Cleanup mocks
export function cleanupMocks() {
  jest.clearAllMocks()
  mockScrollTo.mockClear()
  mockScrollIntoView.mockClear()
}

// Mock user interactions
export const mockUserInteractions = {
  clickButton: jest.fn(),
  fillForm: jest.fn(),
  submitForm: jest.fn(),
  scrollPage: jest.fn(),
  navigateToPage: jest.fn(),
}

// Mock performance API
export const mockPerformance = {
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByType: jest.fn(() => []),
  getEntriesByName: jest.fn(() => []),
  now: jest.fn(() => Date.now()),
}

// Mock geolocation
export const mockGeolocation = {
  getCurrentPosition: jest.fn((success) =>
    success({
      coords: {
        latitude: mockClinicData.coordinates.lat,
        longitude: mockClinicData.coordinates.lng,
        accuracy: 10,
      },
    })
  ),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
}

// Setup mocks for specific test scenarios
export function setupContactFormMocks() {
  // Mock successful form submission
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => mockApiResponses.contactForm.success,
  })
}

export function setupErrorMocks() {
  // Mock network error
  global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))
}

export function setupValidationErrorMocks() {
  // Mock validation error
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status: 400,
    json: async () => mockApiResponses.contactForm.validation,
  })
}