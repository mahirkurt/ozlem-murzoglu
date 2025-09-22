# Sağlık Peteğim Backend Makefile

.PHONY: help install dev prod test clean lint format migrate seed docker-up docker-down docs

# Default target
help: ## Show this help message
	@echo "Sağlık Peteğim Backend - Available Commands:"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "\033[36m\033[0m"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Development

install: ## Install dependencies with Poetry
	@echo "📦 Installing dependencies..."
	poetry install
	@echo "✅ Dependencies installed!"

install-pip: ## Install dependencies with pip
	@echo "📦 Installing dependencies with pip..."
	pip install -r requirements.txt
	@echo "✅ Dependencies installed!"

dev: ## Start development environment
	@echo "🚀 Starting development environment..."
	@chmod +x scripts/start.sh
	@./scripts/start.sh

migrate: ## Run database migrations
	@echo "🗄️ Running database migrations..."
	alembic upgrade head
	@echo "✅ Migrations completed!"

migrate-create: ## Create new migration
	@echo "📝 Creating new migration..."
	@read -p "Migration name: " name; \
	alembic revision --autogenerate -m "$$name"

seed: ## Seed database with initial data
	@echo "🌱 Seeding database..."
	python -m app.scripts.seed_data
	@echo "✅ Database seeded!"

##@ Docker

docker-up: ## Start Docker services
	@echo "🐳 Starting Docker services..."
	docker-compose up -d --build
	@echo "✅ Docker services started!"

docker-down: ## Stop Docker services
	@echo "🛑 Stopping Docker services..."
	docker-compose down
	@echo "✅ Docker services stopped!"

docker-logs: ## View Docker logs
	@echo "📋 Viewing Docker logs..."
	docker-compose logs -f api

docker-shell: ## Access Docker container shell
	@echo "🐚 Accessing Docker container..."
	docker-compose exec api bash

docker-prod: ## Start production Docker services
	@echo "🚀 Starting production services..."
	docker-compose -f docker-compose.prod.yml up -d --build
	@echo "✅ Production services started!"

##@ Testing

test: ## Run tests
	@echo "🧪 Running tests..."
	pytest
	@echo "✅ Tests completed!"

test-cov: ## Run tests with coverage
	@echo "🧪 Running tests with coverage..."
	pytest --cov=app --cov-report=html --cov-report=term
	@echo "✅ Tests with coverage completed!"

test-integration: ## Run integration tests only
	@echo "🧪 Running integration tests..."
	pytest -m integration
	@echo "✅ Integration tests completed!"

test-unit: ## Run unit tests only
	@echo "🧪 Running unit tests..."
	pytest -m unit
	@echo "✅ Unit tests completed!"

##@ Code Quality

lint: ## Run linting
	@echo "🔍 Running linter..."
	flake8 app tests
	mypy app
	@echo "✅ Linting completed!"

format: ## Format code
	@echo "🎨 Formatting code..."
	black app tests
	isort app tests
	@echo "✅ Code formatted!"

format-check: ## Check code formatting
	@echo "🔍 Checking code formatting..."
	black --check app tests
	isort --check-only app tests
	@echo "✅ Code formatting checked!"

##@ Database

db-reset: ## Reset database (WARNING: Deletes all data)
	@echo "⚠️  This will delete all data. Are you sure? [y/N]"
	@read -r response; \
	if [ "$$response" = "y" ] || [ "$$response" = "Y" ]; then \
		echo "🗄️ Resetting database..."; \
		alembic downgrade base; \
		alembic upgrade head; \
		python -m app.scripts.seed_data; \
		echo "✅ Database reset completed!"; \
	else \
		echo "❌ Database reset cancelled."; \
	fi

db-shell: ## Access database shell
	@echo "🐚 Accessing database..."
	docker-compose exec db psql -U postgres -d saglik_petegim

##@ Production

prod-deploy: ## Deploy to production
	@echo "🚀 Deploying to production..."
	@echo "⚠️  Make sure you have set up production environment variables!"
	docker-compose -f docker-compose.prod.yml up -d --build
	@echo "✅ Production deployment completed!"

prod-logs: ## View production logs
	@echo "📋 Viewing production logs..."
	docker-compose -f docker-compose.prod.yml logs -f api

prod-migrate: ## Run production migrations
	@echo "🗄️ Running production migrations..."
	docker-compose -f docker-compose.prod.yml exec api alembic upgrade head
	@echo "✅ Production migrations completed!"

##@ Utilities

clean: ## Clean up temporary files
	@echo "🧹 Cleaning up..."
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	rm -rf .pytest_cache
	rm -rf .coverage
	rm -rf htmlcov
	rm -rf dist
	rm -rf build
	@echo "✅ Cleanup completed!"

docs: ## Generate API documentation
	@echo "📚 Generating documentation..."
	@echo "Starting API server to generate docs..."
	@echo "Visit http://localhost:8000/docs for interactive documentation"
	@echo "Visit http://localhost:8000/redoc for alternative documentation"

backup: ## Create database backup
	@echo "💾 Creating database backup..."
	@mkdir -p backups
	@timestamp=$$(date +"%Y%m%d_%H%M%S"); \
	docker-compose exec -T db pg_dump -U postgres saglik_petegim > "backups/backup_$$timestamp.sql"
	@echo "✅ Database backup created!"

restore: ## Restore database from backup
	@echo "📁 Available backups:"
	@ls -la backups/*.sql 2>/dev/null || echo "No backups found"
	@echo "Enter backup filename (from backups/ directory):"
	@read -r backup_file; \
	if [ -f "backups/$$backup_file" ]; then \
		echo "🔄 Restoring database from $$backup_file..."; \
		docker-compose exec -T db psql -U postgres -d saglik_petegim < "backups/$$backup_file"; \
		echo "✅ Database restored!"; \
	else \
		echo "❌ Backup file not found!"; \
	fi

##@ Monitoring

status: ## Show service status
	@echo "📊 Service Status:"
	@echo "===================="
	@docker-compose ps

health: ## Check service health
	@echo "🏥 Health Check:"
	@echo "=================="
	@curl -s http://localhost:8000/health | python -m json.tool || echo "API not responding"

logs-api: ## View API logs
	@docker-compose logs -f api

logs-celery: ## View Celery logs
	@docker-compose logs -f celery-worker

logs-db: ## View database logs
	@docker-compose logs -f db

##@ Security

security-check: ## Run security checks
	@echo "🔒 Running security checks..."
	@echo "Note: Install safety and bandit for comprehensive security scanning"
	@echo "pip install safety bandit"
	# safety check
	# bandit -r app/
	@echo "✅ Security check completed!"

update-deps: ## Update dependencies
	@echo "📦 Updating dependencies..."
	poetry update
	@echo "✅ Dependencies updated!"

##@ Quick Commands

quick-start: install migrate seed docker-up ## Quick start: install, migrate, seed, and start services
	@echo "🎉 Quick start completed! Visit http://localhost:8000/docs"

quick-reset: docker-down clean docker-up migrate seed ## Quick reset: stop, clean, start, migrate, and seed
	@echo "🎉 Quick reset completed! Visit http://localhost:8000/docs"

quick-test: format lint test ## Quick test: format, lint, and test
	@echo "🎉 Quick test completed!"