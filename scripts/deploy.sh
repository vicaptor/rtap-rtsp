#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ -f ".env" ]; then
    source .env
fi

# Check required environment variables
if [ -z "$DEPLOY_ENV" ]; then
    echo "Error: DEPLOY_ENV not set"
    exit 1
fi

echo "Deploying to $DEPLOY_ENV environment..."

# Build all services
echo "Building services..."
make build

# Run tests
echo "Running tests..."
make test

# Deploy based on environment
case "$DEPLOY_ENV" in
    "production")
        echo "Deploying to production..."
        docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
        ;;
    "staging")
        echo "Deploying to staging..."
        docker compose -f docker-compose.yml -f docker-compose.staging.yml up -d
        ;;
    *)
        echo "Unknown environment: $DEPLOY_ENV"
        exit 1
        ;;
esac

# Wait for services to be healthy
echo "Waiting for services to be healthy..."
./scripts/wait-for-services.sh

echo "Deployment complete!"
