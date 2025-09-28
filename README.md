# Dr. Özlem Murzoğlu - Pediatric Clinic Website

A modern, responsive Angular application for Dr. Özlem Murzoğlu's pediatric clinic, featuring premium design components and animations.

## 🚀 Deployment on Firebase

### ⚠️ Important Configuration

**Firebase Hosting Setup:**

- **Public Directory:** `dist/angular-app/browser`
- **Single-page app:** Yes (rewrite all URLs to /index.html)
- **Build Command:** `npm ci && npm run build`

### Firebase Deployment Steps

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize Firebase: `firebase init`
4. Select "Hosting" and configure as above
5. Deploy: `firebase deploy`

## 📦 Technology Stack

- **Framework:** Angular 18
- **Styling:** CSS with Material Design 3 principles
- **Fonts:** Figtree (headings), DM Sans (body text)
- **Icons:** Material Icons
- **Deployment:** Firebase Hosting

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

# Deploy to Firebase
firebase deploy
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
├── firebase.json          # Firebase configuration
├── .firebaserc            # Firebase project configuration
└── package.json           # Dependencies
```

## 📄 License

© 2024 Dr. Özlem Murzoğlu. All rights reserved.
