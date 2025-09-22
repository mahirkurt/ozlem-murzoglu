# Sağlık Peteğim Backend API

A comprehensive FastAPI backend for the Sağlık Peteğim healthcare clinic management system, designed for pediatric healthcare providers to manage patients, appointments, medical records, and more.

## 🏥 Features

### Core Healthcare Management
- **Patient Management**: Complete patient profiles with medical history
- **Appointment Scheduling**: Flexible appointment booking and management
- **Medical Records**: Secure storage and retrieval of medical documents
- **Growth Tracking**: Pediatric growth charts and percentile calculations
- **Vaccination Management**: Automated vaccination schedules and reminders
- **Prescription Management**: Digital prescription creation and tracking

### Security & Compliance
- **HIPAA Compliance**: Healthcare data protection standards
- **Role-Based Access Control**: Admin, Doctor, Parent role permissions
- **JWT Authentication**: Secure token-based authentication
- **Data Encryption**: Field-level encryption for sensitive data
- **Audit Logging**: Complete audit trail for medical records

### Integration & Automation
- **Background Tasks**: Automated reminders and notifications
- **Email/SMS Notifications**: Multi-channel communication
- **File Storage**: Secure document and image storage
- **API Documentation**: Interactive Swagger/OpenAPI docs

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- PostgreSQL 14+
- Redis 6+
- Poetry (recommended) or pip

### Installation

1. **Clone and setup environment:**
   ```bash
   cd apps/backend_app
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Install dependencies:**
   ```bash
   # Using Poetry (recommended)
   poetry install
   poetry shell

   # Or using pip
   pip install -r requirements.txt
   ```

3. **Database setup:**
   ```bash
   # Run migrations
   alembic upgrade head

   # Seed initial data
   python -m app.scripts.seed_data
   ```

4. **Start services:**
   ```bash
   # Start the API server
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

   # Start Celery worker (in another terminal)
   celery -A app.core.celery worker --loglevel=info

   # Start Celery beat scheduler (in another terminal)
   celery -A app.core.celery beat --loglevel=info
   ```

5. **Access the application:**
   - API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - Health Check: http://localhost:8000/health

## 🏗️ Architecture

```
app/
├── api/                    # API layer
│   ├── deps.py            # Dependencies
│   └── v1/                # API version 1
│       ├── endpoints/     # API endpoints
│       └── router.py      # Main API router
├── core/                  # Core application code
│   ├── config.py         # Configuration
│   ├── security.py       # Security utilities
│   ├── database.py       # Database setup
│   └── celery.py         # Background tasks
├── models/               # SQLAlchemy models
├── schemas/              # Pydantic schemas
├── services/             # Business logic
├── utils/                # Utility functions
├── middleware/           # Custom middleware
├── templates/            # Email templates
└── tests/                # Test suite
```

## 🔧 Configuration

### Environment Variables
Copy `.env.example` to `.env` and configure:

- **Database**: PostgreSQL connection string
- **Redis**: Redis URL for caching and Celery
- **Email**: SMTP configuration for notifications
- **Security**: JWT secret key and encryption settings
- **File Storage**: S3/MinIO or local storage configuration

### Healthcare Settings
- Clinic information and working hours
- Appointment duration and limits
- Vaccination reminder schedules
- Growth tracking intervals

## 📋 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh` - Token refresh
- `POST /api/v1/auth/logout` - User logout

### User Management
- `GET /api/v1/users/me` - Current user profile
- `PUT /api/v1/users/me` - Update profile
- `POST /api/v1/users/change-password` - Change password

### Patient Management
- `GET /api/v1/patients/` - List patients
- `POST /api/v1/patients/` - Create patient
- `GET /api/v1/patients/{id}` - Get patient details
- `PUT /api/v1/patients/{id}` - Update patient
- `DELETE /api/v1/patients/{id}` - Delete patient

### Appointments
- `GET /api/v1/appointments/` - List appointments
- `POST /api/v1/appointments/` - Book appointment
- `GET /api/v1/appointments/{id}` - Get appointment
- `PUT /api/v1/appointments/{id}` - Update appointment
- `DELETE /api/v1/appointments/{id}` - Cancel appointment

### Medical Records
- `GET /api/v1/medical-records/` - List records
- `POST /api/v1/medical-records/` - Create record
- `GET /api/v1/medical-records/{id}` - Get record
- `POST /api/v1/medical-records/{id}/documents` - Upload documents

### Growth Tracking
- `GET /api/v1/growth/{patient_id}` - Get growth data
- `POST /api/v1/growth/{patient_id}` - Add growth measurement
- `GET /api/v1/growth/{patient_id}/chart` - Generate growth chart

### Vaccinations
- `GET /api/v1/vaccinations/{patient_id}` - Get vaccination schedule
- `POST /api/v1/vaccinations/{patient_id}` - Record vaccination
- `PUT /api/v1/vaccinations/{id}` - Update vaccination

## 🧪 Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test types
pytest -m unit          # Unit tests only
pytest -m integration   # Integration tests only
```

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

## 🔒 Security Features

- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Field-level encryption for sensitive data
- **Rate Limiting**: API request rate limiting
- **CORS**: Configurable cross-origin resource sharing
- **Security Headers**: Comprehensive security headers
- **Input Validation**: Pydantic schema validation
- **SQL Injection Protection**: SQLAlchemy ORM protection

## 🏥 Healthcare Compliance

- **HIPAA Compliance**: Healthcare data protection
- **Audit Logging**: Complete audit trail
- **Data Encryption**: Sensitive data encryption
- **Access Controls**: Role-based permissions
- **Data Retention**: Configurable retention policies
- **Backup & Recovery**: Database backup strategies

## 📊 Monitoring

- **Health Checks**: Endpoint health monitoring
- **Metrics**: Prometheus metrics collection
- **Logging**: Structured logging with context
- **Error Tracking**: Sentry integration
- **Performance**: Request/response time tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run the test suite
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: info@saglikpetegim.com
- Documentation: http://localhost:8000/docs
- Issues: GitHub Issues