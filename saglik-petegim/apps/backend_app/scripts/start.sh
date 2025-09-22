#!/bin/bash

# Start script for development environment

set -e

echo "🚀 Starting Sağlık Peteğim Backend Development Environment"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📋 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration before continuing."
    exit 1
fi

# Install dependencies if needed
if [ ! -d ".venv" ] && [ ! -d "node_modules" ]; then
    echo "📦 Installing Python dependencies..."
    if command -v poetry &> /dev/null; then
        poetry install
    else
        pip install -r requirements.txt
    fi
fi

echo "🐳 Starting Docker services..."
docker-compose up --build -d

echo "⏳ Waiting for services to be ready..."
sleep 10

echo "🗄️  Running database migrations..."
if command -v poetry &> /dev/null; then
    poetry run alembic upgrade head
else
    alembic upgrade head
fi

echo "🌱 Seeding initial data..."
if command -v poetry &> /dev/null; then
    poetry run python -m app.scripts.seed_data
else
    python -m app.scripts.seed_data
fi

echo "✅ Development environment is ready!"
echo ""
echo "📍 Available endpoints:"
echo "   • API Documentation: http://localhost:8000/docs"
echo "   • API Redoc: http://localhost:8000/redoc"
echo "   • Health Check: http://localhost:8000/health"
echo "   • Flower (Celery): http://localhost:5555"
echo "   • MailHog: http://localhost:8025"
echo "   • PgAdmin: http://localhost:5050"
echo "   • MinIO Console: http://localhost:9001"
echo ""
echo "🔧 Management commands:"
echo "   • View logs: docker-compose logs -f api"
echo "   • Stop services: docker-compose down"
echo "   • Restart API: docker-compose restart api"
echo ""
echo "Happy coding! 🎉"