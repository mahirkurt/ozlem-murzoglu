# Sağlık Peteğim - Flutter Mobile Application

A comprehensive healthcare application built with Flutter for families and children's health management.

## Features

### 🏥 Healthcare Management
- **Appointment Booking**: Schedule appointments with healthcare providers
- **Health Records**: Digital storage of medical documents, test results, and prescriptions
- **Vaccination Tracking**: Complete vaccination schedule and reminders
- **Growth Monitoring**: Child development tracking with percentile charts
- **Medication Reminders**: Smart notifications for medication schedules

### 👨‍👩‍👧‍👦 Family-Centric Design
- **Multi-Child Support**: Manage health records for multiple children
- **Emergency Contacts**: Quick access to emergency services and contacts
- **Profile Management**: Comprehensive family health profiles
- **Digital Health Cards**: Quick access to essential health information

### 🔐 Security & Privacy
- **Firebase Authentication**: Secure user authentication
- **Data Encryption**: Secure storage of sensitive health information
- **Privacy Controls**: Granular privacy settings for health data

### 🌍 Accessibility
- **Multi-Language Support**: Turkish and English localization
- **Responsive Design**: Works across mobile, tablet, and web platforms
- **Accessibility Features**: Screen reader support and accessible UI components

## Architecture

### 📁 Project Structure
```
lib/
├── core/                    # Core application functionality
│   ├── app/                # App configuration and routing
│   ├── config/             # Application configuration
│   ├── services/           # Core services (auth, notifications)
│   ├── utils/              # Utilities and helpers
│   ├── providers/          # Riverpod providers
│   ├── constants/          # Application constants
│   └── exceptions/         # Custom exceptions
├── features/               # Feature modules
│   ├── auth/              # Authentication (login, register)
│   ├── home/              # Home dashboard
│   ├── appointments/      # Appointment management
│   ├── profile/           # User profile management
│   ├── growth/            # Growth tracking
│   ├── health_records/    # Health records management
│   ├── notifications/     # Notifications
│   └── settings/          # App settings
├── shared/                # Shared components
│   ├── presentation/      # Common UI components
│   └── widgets/           # Reusable widgets
└── l10n/                  # Localization files
```

### 🏗️ Clean Architecture
- **Separation of Concerns**: Clear separation between UI, business logic, and data
- **Feature-Based Organization**: Each feature is self-contained
- **Dependency Injection**: Using Riverpod for state management and DI
- **SOLID Principles**: Following SOLID design principles

## Tech Stack

### 🛠️ Core Framework
- **Flutter**: Cross-platform UI framework
- **Dart**: Programming language

### 📦 Key Dependencies
- **Riverpod**: State management and dependency injection
- **GoRouter**: Declarative routing
- **Firebase**: Authentication, analytics, and push notifications
- **Hive**: Local data storage
- **Dio**: HTTP client for API requests
- **Retrofit**: Type-safe REST client

### 🎨 UI & Design
- **Material Design 3**: Modern design system
- **Custom Design System**: Consistent healthcare-focused components
- **Flutter Animate**: Smooth animations and transitions
- **Cached Network Image**: Optimized image loading

### 📊 Charts & Visualization
- **FL Chart**: Interactive charts for growth tracking
- **Table Calendar**: Calendar components for appointments

### 🔧 Development Tools
- **Build Runner**: Code generation
- **Freezed**: Immutable data classes
- **JSON Annotation**: JSON serialization
- **Flutter Launcher Icons**: App icon generation

## Getting Started

### Prerequisites
- Flutter SDK (>=3.16.0)
- Dart SDK (>=3.8.0)
- Firebase project setup
- Android Studio / Xcode for platform-specific development

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Saglik-Petegim/apps/flutter_app
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Configure Firebase**
   - Add your `google-services.json` for Android
   - Add your `GoogleService-Info.plist` for iOS
   - Configure web Firebase config in `index.html`

4. **Generate code**
   ```bash
   flutter packages pub run build_runner build
   ```

5. **Run the application**
   ```bash
   flutter run
   ```

### Platform-Specific Setup

#### Android
- Minimum SDK: 21
- Compile SDK: 34
- Required permissions configured in `AndroidManifest.xml`

#### iOS
- Minimum iOS version: 12.0
- Required permissions configured in `Info.plist`
- Background modes enabled for notifications

#### Web
- PWA support enabled
- Service worker for offline functionality
- Responsive design for all screen sizes

## Features Implementation Status

### ✅ Completed
- [x] Project structure and architecture
- [x] Authentication system (Login, Register, Password Reset)
- [x] Home dashboard with healthcare widgets
- [x] Navigation and routing setup
- [x] Localization support (Turkish/English)
- [x] Platform-specific configurations
- [x] PWA setup for web platform
- [x] Emergency contact functionality
- [x] Basic appointment scheduling UI
- [x] Health summary dashboard
- [x] Settings and profile screens structure

### 🚧 In Development
- [ ] Complete appointment booking system
- [ ] Detailed health records management
- [ ] Growth tracking with charts
- [ ] Medication reminder system
- [ ] Push notification implementation
- [ ] Offline data synchronization
- [ ] Advanced profile management

### 📋 Planned Features
- [ ] Telemedicine integration
- [ ] AI-powered health insights
- [ ] Integration with wearable devices
- [ ] Advanced analytics dashboard
- [ ] Multi-clinic support
- [ ] Insurance integration
- [ ] Prescription management

## Configuration

### Environment Variables
Create environment-specific configuration files:
- `lib/core/config/app_config.dart` - Main app configuration
- Firebase configuration files for each platform

### Customization
- **Themes**: Modify `packages/design_system/lib/src/theme/app_theme.dart`
- **Colors**: Update color tokens in the design system
- **Localization**: Add new languages in `lib/l10n/`

## Testing

### Running Tests
```bash
# Unit tests
flutter test

# Integration tests
flutter drive --target=test_driver/app.dart

# Widget tests
flutter test test/widget_test.dart
```

### Test Coverage
- Unit tests for business logic
- Widget tests for UI components
- Integration tests for user flows
- Platform-specific testing

## Deployment

### Android
```bash
flutter build appbundle --release
```

### iOS
```bash
flutter build ipa --release
```

### Web
```bash
flutter build web --release
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow Dart/Flutter style guidelines
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure proper error handling

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in the `docs/` folder

## Acknowledgments

- Flutter team for the amazing framework
- Firebase team for backend services
- Material Design team for the design system
- Open source community for excellent packages

---

Made with ❤️ by the Sağlık Peteğim Team