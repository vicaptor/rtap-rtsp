# Main Makefile for RTAP-RTSP system

.PHONY: all build test clean deploy help

# Default target
all: build test

# Help command
help:
	@echo "RTAP-RTSP System Make Commands"
	@echo "-------------------------"
	@echo "make build          - Build all services"
	@echo "make test           - Run all tests"
	@echo "make clean          - Clean build artifacts"
	@echo "make deploy         - Deploy the system"
	@echo "make dev            - Start development environment"
	@echo "make stop           - Stop development environment"
	@echo "make logs           - Show service logs"
	@echo "make test-unit      - Run unit tests"
	@echo "make test-integration - Run integration tests"
	@echo "make test-performance - Run performance tests"

# Build commands
build:
	@echo "Building all services..."
	@cd services/rtsp-server && make build
	@cd services/annotation-service && npm run build
	@cd client-sdk && npm run build

# Test commands
test: test-unit test-integration

test-unit:
	@echo "Running unit tests..."
	@cd services/rtsp-server && make test
	@cd services/annotation-service && npm test
	@cd client-sdk && npm test

test-integration:
	@echo "Running integration tests..."
	@cd tests && npm run test:integration

test-performance:
	@echo "Running performance tests..."
	@cd tests/performance/k6 && k6 run stream-load.js
	@cd tests/performance/k6 && k6 run ws-load.js

# Clean commands
clean:
	@echo "Cleaning build artifacts..."
	@cd services/rtsp-server && make clean
	@cd services/annotation-service && rm -rf dist node_modules
	@cd client-sdk && rm -rf dist node_modules
	@find . -name "*.log" -type f -delete

# Development commands
dev:
	@echo "Starting development environment..."
	@docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

stop:
	@echo "Stopping development environment..."
	@docker compose down

logs:
	@docker compose logs -f

# Deployment commands
deploy:
	@echo "Deploying system..."
	@./scripts/deploy.sh
