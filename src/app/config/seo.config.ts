// SEO Configuration File
// Update these values with your actual IDs

export const SEO_CONFIG = {
  // Google Analytics Measurement ID
  // Get from: https://analytics.google.com/ > Admin > Data Streams > Web
  GOOGLE_ANALYTICS_ID: 'G-FJW4LXJ4T8', // GA4 ID for ozlemmurzoglu.com

  // Google Tag Manager Container ID
  GOOGLE_TAG_MANAGER_ID: 'GTM-WTVF5SJ5', // GTM ID for ozlemmurzoglu.com

  // Google Analytics Measurement Protocol (for server-side tracking)
  MEASUREMENT_PROTOCOL_API_SECRET: 'fu2qqx3VTC-PpYGjyikxAQ',
  MEASUREMENT_STREAM_ID: '6678062654',

  // Cookiebot Configuration
  COOKIEBOT_ID: '71d4c736-ef6a-4a9f-a891-7fc4ff6f298e',

  // Google Search Console Verification
  // Get from: https://search.google.com/search-console > Settings > Ownership verification
  GOOGLE_SITE_VERIFICATION: 'YOUR_GOOGLE_VERIFICATION_CODE', // Replace with your verification code

  // Domain Configuration
  DOMAIN: 'https://ozlemmurzoglu.com',

  // Social Media Links
  SOCIAL: {
    FACEBOOK: 'https://www.facebook.com/dr.murzoglu',
    INSTAGRAM: 'https://instagram.com/dr.ozlemmurzoglu',
    TWITTER: 'https://x.com/ozlemmurzoglu',
    LINKEDIN: 'https://www.linkedin.com/in/ozlemmurzoglu',
    YOUTUBE: 'https://www.youtube.com/@ozlemmurzoglu',
    GOOGLE_MAPS: 'https://maps.app.goo.gl/jXU64C',
  },

  // Business Information
  BUSINESS: {
    NAME: 'Dr. Özlem Murzoğlu Kliniği',
    PHONE: '+902166884483',
    PHONE_DISPLAY: '0216 688 44 83',
    MOBILE: '+905466884483',
    MOBILE_DISPLAY: '0546 688 44 83',
    EMAIL: 'klinik@drmurzoglu.com',
    ADDRESS: {
      STREET: 'Barbaros Mah. Ak Zambak Sok. No:3',
      BUILDING: 'Uphill Towers A Blok Daire 30',
      DISTRICT: 'Ataşehir',
      CITY: 'İstanbul',
      POSTAL_CODE: '34746',
      COUNTRY: 'TR',
    },
    GEO: {
      LATITUDE: 40.9884,
      LONGITUDE: 29.1303,
    },
    OPENING_HOURS: {
      WEEKDAYS: { OPEN: '09:00', CLOSE: '18:00' },
      SATURDAY: { OPEN: '09:00', CLOSE: '14:00' },
      SUNDAY: 'CLOSED',
    },
  },

  // CDN Configuration (if using CloudFlare or other CDN)
  CDN: {
    ENABLED: false, // Set to true when CDN is configured
    URL: '', // Your CDN URL if different from main domain
    IMAGES_URL: '', // CDN URL for images
  },
};

// Instructions for updating:
// 1. Google Analytics:
//    - Go to https://analytics.google.com/
//    - Select your property or create a new one
//    - Go to Admin > Data Streams > Web
//    - Copy the Measurement ID (starts with G-)
//    - Replace 'G-XXXXXXXXXX' above with your ID
//
// 2. Search Console:
//    - Go to https://search.google.com/search-console
//    - Add your property (ozlemmurzoglu.com)
//    - Choose HTML tag verification method
//    - Copy the content value from the meta tag
//    - Replace 'YOUR_GOOGLE_VERIFICATION_CODE' above
//
// 3. After updating, run: npm run build && firebase deploy
