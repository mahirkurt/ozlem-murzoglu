# Dr. Özlem Murzoğlu - Pediatric Clinic Website

A modern, responsive Angular application for Dr. Özlem Murzoğlu's pediatric clinic, featuring premium design components and animations.

## 🚀 Deployment on Vercel

### ⚠️ Important Configuration
**Root Directory:** Leave empty or use `.` (project is in repository root)  
**Build Command:** `npm ci && npm run build`  
**Output Directory:** `dist/angular-app/browser`  
**Install Command:** `npm ci`

### Vercel Project Settings
1. Go to your Vercel Dashboard
2. Select the project
3. Go to Settings → General
4. Clear the "Root Directory" field (leave it empty)
5. Save changes

## 📦 Technology Stack

- **Framework:** Angular 18
- **Styling:** CSS with Material Design 3 principles
- **Fonts:** Figtree (headings), DM Sans (body text)
- **Icons:** Material Icons
- **Deployment:** Vercel

## ✨ Features

- 🎨 Premium liquid hero animations
- 🖱️ Custom cursor with interactive hover effects
- 🎯 Floating action buttons (WhatsApp, Phone, Appointments)
- ✨ Scroll-triggered reveal animations
- 📱 Fully responsive design
- 🌐 All pages: Home, About, Services, Blog, FAQ, Contact

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run start
# Navigate to http://localhost:4200/

# Build for production
npm run build
```

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── directives/     # Custom directives
│   │   └── app.routes.ts   # Routing configuration
│   ├── styles/             # Global styles
│   └── index.html          # Main HTML file
├── public/                 # Static assets
├── vercel.json            # Vercel configuration
└── package.json           # Dependencies
```

## 📄 License

© 2024 Dr. Özlem Murzoğlu. All rights reserved.
