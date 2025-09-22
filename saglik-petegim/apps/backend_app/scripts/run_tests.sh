#!/bin/bash

# FastAPI Test Runner Script
# Comprehensive test runner for the backend application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Default values
RUN_UNIT=true
RUN_INTEGRATION=true
RUN_LOAD=false
RUN_PERFORMANCE=false
GENERATE_COVERAGE=true
PARALLEL=false
VERBOSE=false
WORKERS=auto

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --unit-only)
            RUN_UNIT=true
            RUN_INTEGRATION=false
            RUN_LOAD=false
            RUN_PERFORMANCE=false
            shift
            ;;
        --integration-only)
            RUN_UNIT=false
            RUN_INTEGRATION=true
            RUN_LOAD=false
            RUN_PERFORMANCE=false
            shift
            ;;
        --load-only)
            RUN_UNIT=false
            RUN_INTEGRATION=false
            RUN_LOAD=true
            RUN_PERFORMANCE=false
            shift
            ;;
        --performance-only)
            RUN_UNIT=false
            RUN_INTEGRATION=false
            RUN_LOAD=false
            RUN_PERFORMANCE=true
            shift
            ;;
        --all)
            RUN_UNIT=true
            RUN_INTEGRATION=true
            RUN_LOAD=true
            RUN_PERFORMANCE=true
            shift
            ;;
        --no-coverage)
            GENERATE_COVERAGE=false
            shift
            ;;
        --parallel)
            PARALLEL=true
            shift
            ;;
        --workers)
            WORKERS="$2"
            PARALLEL=true
            shift 2
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --help)
            echo "FastAPI Test Runner"
            echo ""
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --unit-only        Run only unit tests"
            echo "  --integration-only Run only integration tests"
            echo "  --load-only        Run only load tests"
            echo "  --performance-only Run only performance tests"
            echo "  --all              Run all types of tests"
            echo "  --no-coverage      Skip coverage generation"
            echo "  --parallel         Run tests in parallel"
            echo "  --workers N        Number of parallel workers (implies --parallel)"
            echo "  --verbose          Verbose output"
            echo "  --help            Show this help message"
            echo ""
            exit 0
            ;;
        *)
            print_error "Unknown option $1"
            exit 1
            ;;
    esac
done

# Ensure we're in the backend app directory
cd "$(dirname "$0")/.."

print_status "Starting FastAPI test suite..."

# Set environment variables for testing
export ENVIRONMENT="testing"
export DATABASE_URL="sqlite+aiosqlite:///./test.db"
export SECRET_KEY="test-secret-key-for-testing-only"
export ACCESS_TOKEN_EXPIRE_MINUTES="30"
export CELERY_TASK_ALWAYS_EAGER="true"

# Install dependencies
print_status "Installing dependencies..."
pip install -r requirements.txt

# Set up pytest arguments
PYTEST_ARGS=""

if [ "$GENERATE_COVERAGE" = true ]; then
    PYTEST_ARGS="$PYTEST_ARGS --cov=app --cov-report=html --cov-report=term --cov-report=xml"
fi

if [ "$PARALLEL" = true ]; then
    PYTEST_ARGS="$PYTEST_ARGS -n $WORKERS"
fi

if [ "$VERBOSE" = true ]; then
    PYTEST_ARGS="$PYTEST_ARGS -v"
fi

# Add common pytest arguments
PYTEST_ARGS="$PYTEST_ARGS --tb=short --strict-markers --strict-config"

# Run unit tests
if [ "$RUN_UNIT" = true ]; then
    print_status "Running unit tests..."
    
    python -m pytest tests/test_*.py tests/utils/ $PYTEST_ARGS
    
    if [ $? -eq 0 ]; then
        print_success "Unit tests passed"
    else
        print_error "Unit tests failed"
        exit 1
    fi
fi

# Run integration tests
if [ "$RUN_INTEGRATION" = true ]; then
    print_status "Running integration tests..."
    
    python -m pytest tests/integration/ $PYTEST_ARGS
    
    if [ $? -eq 0 ]; then
        print_success "Integration tests passed"
    else
        print_error "Integration tests failed"
        exit 1
    fi
fi

# Run performance tests
if [ "$RUN_PERFORMANCE" = true ]; then
    print_status "Running performance tests..."
    
    python -m pytest tests/performance/ $PYTEST_ARGS -m performance
    
    if [ $? -eq 0 ]; then
        print_success "Performance tests passed"
    else
        print_error "Performance tests failed"
        exit 1
    fi
fi

# Run load tests
if [ "$RUN_LOAD" = true ]; then
    print_status "Running load tests with Locust..."
    
    # Check if the application is running
    if ! curl -f http://localhost:8000/health >/dev/null 2>&1; then
        print_warning "Application not running on localhost:8000"
        print_status "Starting application in background..."
        
        # Start the application in background
        uvicorn app.main:app --host 0.0.0.0 --port 8000 &
        APP_PID=$!
        
        # Wait for application to start
        sleep 5
        
        # Check if application started successfully
        if ! curl -f http://localhost:8000/health >/dev/null 2>&1; then
            print_error "Failed to start application for load testing"
            kill $APP_PID 2>/dev/null || true
            exit 1
        fi
        
        print_success "Application started successfully"
        KILL_APP=true
    else
        KILL_APP=false
    fi
    
    # Run load tests
    locust -f tests/load/locustfile.py \
           --host=http://localhost:8000 \
           --users=10 \
           --spawn-rate=2 \
           --run-time=60s \
           --headless \
           --html=reports/load_test_report.html
    
    LOAD_TEST_EXIT_CODE=$?
    
    # Stop application if we started it
    if [ "$KILL_APP" = true ]; then
        print_status "Stopping application..."
        kill $APP_PID 2>/dev/null || true
    fi
    
    if [ $LOAD_TEST_EXIT_CODE -eq 0 ]; then
        print_success "Load tests completed"
        print_status "Load test report available at reports/load_test_report.html"
    else
        print_error "Load tests failed"
        exit 1
    fi
fi

# Generate test reports
if [ "$GENERATE_COVERAGE" = true ]; then
    print_status "Generating test reports..."
    
    # Create reports directory
    mkdir -p reports
    
    # Move coverage reports
    if [ -d "htmlcov" ]; then
        mv htmlcov reports/coverage
        print_success "Coverage report available at reports/coverage/index.html"
    fi
    
    if [ -f "coverage.xml" ]; then
        mv coverage.xml reports/
        print_success "Coverage XML report available at reports/coverage.xml"
    fi
fi

# Run code quality checks
print_status "Running code quality checks..."

# Black formatting check
print_status "Checking code formatting with Black..."
black --check app/ tests/ || {
    print_warning "Code formatting issues found. Run 'black app/ tests/' to fix."
}

# Import sorting check
print_status "Checking import sorting with isort..."
isort --check-only app/ tests/ || {
    print_warning "Import sorting issues found. Run 'isort app/ tests/' to fix."
}

# Flake8 linting
print_status "Running Flake8 linting..."
flake8 app/ tests/ || {
    print_warning "Linting issues found."
}

# MyPy type checking
print_status "Running MyPy type checking..."
mypy app/ || {
    print_warning "Type checking issues found."
}

print_success "All tests completed successfully!"

# Display summary
echo ""
echo "=========================================="
echo "              TEST SUMMARY"
echo "=========================================="

if [ "$RUN_UNIT" = true ]; then
    echo "✓ Unit tests: PASSED"
fi

if [ "$RUN_INTEGRATION" = true ]; then
    echo "✓ Integration tests: PASSED"
fi

if [ "$RUN_PERFORMANCE" = true ]; then
    echo "✓ Performance tests: PASSED"
fi

if [ "$RUN_LOAD" = true ]; then
    echo "✓ Load tests: PASSED"
fi

if [ "$GENERATE_COVERAGE" = true ]; then
    echo "✓ Coverage report: Generated"
fi

echo "=========================================="

# Open reports if available
if [ "$GENERATE_COVERAGE" = true ] && [ -f "reports/coverage/index.html" ]; then
    print_status "Opening coverage report..."
    if command -v open >/dev/null 2>&1; then
        open reports/coverage/index.html
    elif command -v xdg-open >/dev/null 2>&1; then
        xdg-open reports/coverage/index.html
    elif command -v start >/dev/null 2>&1; then
        start reports/coverage/index.html
    fi
fi