import { SEO_CONFIG } from './seo.config';

const stripSpaces = (value: string): string => value.replace(/\s+/g, '');

const phoneE164 = stripSpaces(SEO_CONFIG.BUSINESS.PHONE);
const mobileE164 = stripSpaces(SEO_CONFIG.BUSINESS.MOBILE);

export const CONTACT_CONFIG = {
  phone: {
    e164: phoneE164,
    display: SEO_CONFIG.BUSINESS.PHONE_DISPLAY,
    telHref: `tel:${phoneE164}`,
  },
  mobile: {
    e164: mobileE164,
    display: SEO_CONFIG.BUSINESS.MOBILE_DISPLAY,
    telHref: `tel:${mobileE164}`,
  },
  email: {
    value: SEO_CONFIG.BUSINESS.EMAIL,
    mailtoHref: `mailto:${SEO_CONFIG.BUSINESS.EMAIL}`,
  },
  address: {
    street: SEO_CONFIG.BUSINESS.ADDRESS.STREET,
    building: SEO_CONFIG.BUSINESS.ADDRESS.BUILDING,
    district: SEO_CONFIG.BUSINESS.ADDRESS.DISTRICT,
    city: SEO_CONFIG.BUSINESS.ADDRESS.CITY,
    postalCode: SEO_CONFIG.BUSINESS.ADDRESS.POSTAL_CODE,
    country: SEO_CONFIG.BUSINESS.ADDRESS.COUNTRY,
    shortDisplay: `${SEO_CONFIG.BUSINESS.ADDRESS.DISTRICT}, ${SEO_CONFIG.BUSINESS.ADDRESS.CITY}`,
    fullDisplay: `${SEO_CONFIG.BUSINESS.ADDRESS.STREET}, ${SEO_CONFIG.BUSINESS.ADDRESS.BUILDING}, ${SEO_CONFIG.BUSINESS.ADDRESS.DISTRICT}/${SEO_CONFIG.BUSINESS.ADDRESS.CITY}`,
  },
  mapsUrl: SEO_CONFIG.SOCIAL.GOOGLE_MAPS,
  whatsapp: {
    phone: mobileE164.replace(/^\+/, ''),
    baseUrl: `https://wa.me/${mobileE164.replace(/^\+/, '')}`,
    apiBaseUrl: `https://api.whatsapp.com/send?phone=${mobileE164.replace(/^\+/, '')}`,
  },
} as const;

export const CONTACT_HELPERS = {
  getWhatsAppUrl: (message?: string): string => {
    if (!message) {
      return CONTACT_CONFIG.whatsapp.baseUrl;
    }
    return `${CONTACT_CONFIG.whatsapp.baseUrl}?text=${encodeURIComponent(message)}`;
  },
  getWhatsAppApiUrl: (message?: string): string => {
    if (!message) {
      return CONTACT_CONFIG.whatsapp.apiBaseUrl;
    }
    return `${CONTACT_CONFIG.whatsapp.apiBaseUrl}&text=${encodeURIComponent(message)}`;
  },
};

