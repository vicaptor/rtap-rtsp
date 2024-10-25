# RTAP-RTSP System

Real-Time Annotation Platform with RTSP Streaming capabilities.

## Project Structure

```
.
├── services/
│   ├── rtsp-server/        # Go-based RTSP server using MediaMTX
│   ├── annotation-service/ # Node.js real-time annotation service
│   └── api-gateway/        # Nginx API gateway configuration
├── config/
│   ├── development/        # Development environment configurations
│   └── production/         # Production environment configurations
├── scripts/                # Build, deployment, and utility scripts
├── monitoring/
│   ├── prometheus/         # Prometheus configuration and rules
│   └── grafana/           # Grafana dashboards and configurations
├── docs/
│   └── api/               # API documentation
├── tests/
│   ├── unit/              # Unit tests for each service
│   ├── integration/       # Integration tests
│   └── performance/       # Performance and load tests
├── client-sdk/            # TypeScript/JavaScript client SDK
├── docker-compose.yml     # Main Docker Compose configuration
└── README.md             # Project documentation
```

## Features

- RTSP streaming server with support for multiple protocols (RTSP, HLS, WebRTC)
- Real-time annotation service with WebSocket support
- API gateway for unified access to services
- Monitoring and logging infrastructure
- Scalable microservices architecture
- Comprehensive testing suite
- Client SDK for easy integration

## Prerequisites

- Docker and Docker Compose
- Node.js (for development)
- Go (for RTSP server development)
- Make (for running development scripts)

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/rtap-rtsp.git
   cd rtap-rtsp
   ```

2. Copy the example environment file:
   ```bash
   cp config/development/.env.example config/development/.env
   ```

3. Start the development environment:
   ```bash
   docker-compose up -d
   ```

4. Access the services:
   - RTSP Server: rtsp://localhost:8554
   - Annotation API: http://localhost:3000
   - API Gateway: http://localhost:8080
   - Monitoring: http://localhost:9090 (Prometheus)
   - Dashboards: http://localhost:3000 (Grafana)

## Development

### Service Development

Each service can be developed independently:

```bash
# RTSP Server
cd services/rtsp-server
go mod download
go run main.go

# Annotation Service
cd services/annotation-service
npm install
npm run dev

# API Gateway
cd services/api-gateway
docker-compose up nginx
```

### Running Tests

```bash
# Unit tests
make test-unit

# Integration tests
make test-integration

# Performance tests
make test-performance
```

## Deployment

1. Configure production environment:
   ```bash
   cp config/production/.env.example config/production/.env
   # Edit .env with production values
   ```

2. Deploy using Docker Compose:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

## Monitoring

- Prometheus metrics are available at `http://localhost:9090`
- Grafana dashboards are available at `http://localhost:3000`
- Default credentials are in the development environment file

## Documentation

- [API Documentation](docs/api/README.md)
- [Development Guide](docs/development.md)
- [Deployment Guide](docs/deployment.md)
- [Monitoring Guide](docs/monitoring.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


