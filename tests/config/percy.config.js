/**
 * Percy Configuration
 * Visual regression testing configuration
 */

module.exports = {
  // Percy project details
  projectId: 'ozlem-murzoglu-website',
  token: process.env.PERCY_TOKEN,
  
  // Snapshot configuration
  snapshot: {
    widths: [375, 414, 768, 1024, 1280, 1440, 1920],
    minHeight: 1024,
    enableJavaScript: true,
    
    // Percy-specific CSS to normalize snapshots
    percyCSS: `
      /* Animations off */
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
      
      /* Hide dynamic content */
      .timestamp, .loading, .skeleton {
        visibility: hidden !important;
      }
      
      /* Consistent fonts */
      * {
        font-family: -apple-system, BlinkMacSystemFont, sans-serif !important;
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
      }
      
      /* Disable smooth scroll */
      html {
        scroll-behavior: auto !important;
      }
      
      /* Hide scrollbars */
      ::-webkit-scrollbar {
        display: none !important;
      }
      
      /* Normalize form elements */
      input, textarea, select {
        caret-color: transparent !important;
      }
      
      /* Hide tooltips */
      .mat-tooltip, [role="tooltip"] {
        display: none !important;
      }
    `
  },
  
  // Discovery options
  discovery: {
    allowedHostnames: ['localhost', 'ozlemmurzoglu.com'],
    disableCache: false,
    concurrency: 5,
    launchOptions: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=IsolateOrigins',
        '--disable-site-isolation-trials'
      ]
    }
  },
  
  // Static site options
  static: {
    baseUrl: 'http://localhost:4200',
    files: 'dist/**/*.{html,css,js}',
    ignore: 'node_modules/**'
  },
  
  // Storybook integration
  storybook: {
    args: ['--ci'],
    buildArgs: ['--quiet'],
    include: ['**/*.stories.@(js|jsx|ts|tsx|mdx)'],
    exclude: ['**/node_modules/**']
  }
};