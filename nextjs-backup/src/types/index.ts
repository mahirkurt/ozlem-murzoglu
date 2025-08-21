// Common types for the corporate site
export interface ContactInfo {
  name: string
  phone: string
  email: string
  address: string
  emergencyPhone: string
  workingHours: {
    weekdays: string
    weekend: string
    sunday: string
  }
}

export interface SocialMedia {
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'whatsapp'
  url: string
  label: string
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  category: 'checkup' | 'vaccination' | 'illness' | 'nutrition' | 'development' | 'emergency'
  featured?: boolean
  duration?: number
  ageGroup?: string
}

export interface Doctor {
  id: string
  name: string
  title: string
  specializations: string[]
  education: string[]
  experience: string
  bio: string
  image: string
  languages: string[]
}

export interface Testimonial {
  id: string
  parentName: string
  childAge: string
  rating: number
  comment: string
  service?: string
  date: string
  verified?: boolean
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  updatedAt?: string
  category: string
  tags: string[]
  featuredImage?: string
  readingTime: number
  featured?: boolean
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
}

export interface AppointmentRequest {
  parentName: string
  parentPhone: string
  parentEmail: string
  childName: string
  childAge: string
  appointmentType: 'checkup' | 'vaccination' | 'illness' | 'consultation' | 'follow-up'
  preferredDate: string
  preferredTime: string
  notes?: string
}

export interface ContactMessage {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export interface EmergencyContact {
  title: string
  phone: string
  description: string
  available: string
}

export interface VaccinationSchedule {
  age: string
  vaccines: string[]
  notes?: string
  importance: 'high' | 'medium' | 'low'
}

export interface DevelopmentMilestone {
  ageRange: string
  category: 'physical' | 'cognitive' | 'social' | 'language'
  milestones: string[]
  warningSign?: string[]
}

export interface NutritionGuideline {
  ageRange: string
  recommendations: string[]
  avoid: string[]
  portions: string
  frequency: string
}

// Theme types
export type Theme = 'light' | 'dark' | 'system'

// Locale types
export type Locale = 'tr' | 'en'

// Component props types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  href?: string
  target?: string
}

export interface CardProps extends BaseComponentProps {
  title?: string
  description?: string
  image?: string
  href?: string
  featured?: boolean
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Form validation types
export interface FormError {
  field: string
  message: string
}

export interface FormState<T> {
  data: T
  errors: FormError[]
  isSubmitting: boolean
  isValid: boolean
}