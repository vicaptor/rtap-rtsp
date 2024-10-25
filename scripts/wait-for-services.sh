#!/bin/bash

# Exit on error
set -e

# Maximum number of retries
MAX_RETRIES=30
RETRY_INTERVAL=5

# Function to check service health
check_service() {
    local service=$1
    local url=$2
    local retries=0

    echo "Checking $service..."
    
    while [ $retries -lt $MAX_RETRIES ]; do
        if curl -s -f "$url" > /dev/null; then
            echo "$service is healthy"
            return 0
        fi

        retries=$((retries + 1))
        echo "$service not ready, retry $retries/$MAX_RETRIES"
        sleep $RETRY_INTERVAL
    done

    echo "$service failed to become healthy"
    return 1
}

# Check all services
check_service "API Gateway" "http://localhost:8080/health"
check_service "RTSP Server" "http://localhost:9997/health"
check_service "Annotation Service" "http://localhost:3000/health"
check_service "Prometheus" "http://localhost:9090/-/healthy"
check_service "Grafana" "http://localhost:3001/api/health"

echo "All services are healthy!"
