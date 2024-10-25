# Known Issues and Requirements

## Prerequisites

### Required Software
- Docker Engine
- Docker Compose V2 (docker compose) or V1 (docker-compose)
- Node.js 18+ (for local development)
- Go 1.21+ (for RTSP server development)
- Git

### Installation Instructions

#### Docker and Docker Compose
1. Install Docker Engine:
   ```bash
   # For Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install docker.io

   # Start and enable Docker
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

2. Install Docker Compose V2:
   ```bash
   # For Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install docker-compose-plugin
   ```

#### Go Installation
1. Install Go 1.21:
   ```bash
   # Download and install
   wget https://go.dev/dl/go1.21.3.linux-amd64.tar.gz
   sudo rm -rf /usr/local/go
   sudo tar -C /usr/local -xzf go1.21.3.linux-amd64.tar.gz

   # Add to PATH in ~/.profile or ~/.bashrc
   export PATH=$PATH:/usr/local/go/bin

   # Verify installation
   source ~/.profile  # or source ~/.bashrc
   go version
   ```

#### Node.js
1. Install Node.js 18:
   ```bash
   # Using nvm (recommended)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   source ~/.bashrc
   nvm install 18
   nvm use 18

   # Or using apt (Ubuntu/Debian)
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

## Current Issues

1. Missing package.json in annotation-service
   - Need to create package.json with required dependencies
   - Add TypeScript configuration
   - Add build and start scripts

2. Missing nginx.conf in api-gateway
   - Need to create proper nginx configuration
   - Configure SSL/TLS settings
   - Set up proper routing

3. Missing Prometheus and Grafana configurations
   - Need to create proper monitoring configurations
   - Set up alerting rules
   - Configure dashboards

## Testing Requirements

### RTSP Server Testing
1. Unit Tests:
   - MediaMTX client package tests
   - API endpoint tests
   - WebSocket handling tests

2. Integration Tests:
   - Stream management tests
   - Real-time monitoring tests
   - MediaMTX integration tests

3. Performance Tests:
   - Stream handling capacity
   - WebSocket broadcast performance
   - API response times

### Required Test Environment
- Go 1.21+ installed
- MediaMTX server running
- Network access for RTSP streams

## Required Actions

1. Create missing configuration files:
   - services/annotation-service/package.json ✓
   - services/annotation-service/tsconfig.json ✓
   - services/api-gateway/nginx.conf ✓
   - monitoring/grafana/dashboards/
   - monitoring/prometheus/prometheus.yml ✓

2. Test each service individually:
   - RTSP server
     - Unit tests implemented ✓
     - Integration tests implemented ✓
     - Need Go installation for testing
   - Annotation service
   - API gateway
   - MongoDB
   - Redis
   - Prometheus
   - Grafana

3. Test service integration:
   - RTSP streaming through API gateway
   - Annotation service with MongoDB and Redis
   - Monitoring system with all services
