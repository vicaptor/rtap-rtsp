## [0.3.2] - 2024-10-25

### Added
- 

### Changed
- 

### Deprecated
- 

### Removed
- 

### Fixed
- 

### Security
- 

# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.2] - 2024-10-25

### Added
- Unit tests for RTSP server
- Integration tests for MediaMTX client
- Test cases for API endpoints
- Makefile for building and testing
- Updated testing requirements in ISSUES.md

### Changed
- Enhanced ISSUES.md with Go installation instructions
- Improved test coverage for RTSP server
- Better documentation of testing requirements

### Fixed
- Added missing test files
- Improved test organization
- Added proper test documentation

## [0.3.1] - 2024-01-09

### Added
- MediaMTX client package for API integration
- Complete RTSP stream management implementation
- Real-time stream monitoring with WebSocket broadcasts
- Improved error handling and status reporting
- Stream statistics collection

### Changed
- Enhanced RTSP server implementation with MediaMTX integration
- Improved WebSocket handling with client tracking
- Better stream status monitoring

### Fixed
- Implemented all TODO items in main.go
- Added proper error handling for API calls
- Improved WebSocket connection management

## [0.3.0] - 2024-01-09

### Added
- RTSP server Go implementation
- API endpoints for stream management
- WebSocket support for real-time updates
- Stream monitoring system
- Health check endpoint
- Stream statistics tracking

### Changed
- Enhanced RTSP server with Go wrapper
- Improved stream management capabilities
- Added real-time monitoring

## [0.2.1] - 2024-01-09

### Added
- ISSUES.md with prerequisites and known issues
- Complete package.json for annotation service
- TypeScript configuration for annotation service
- Detailed nginx configuration with SSL and routing
- Health check endpoints for all services

### Changed
- Enhanced API gateway configuration with better security
- Improved CORS handling in nginx
- Updated documentation with installation requirements

### Fixed
- Missing configuration files for annotation service
- Incomplete nginx configuration
- Missing TypeScript setup

## [0.2.0] - 2024-01-09

### Added
- Docker configuration for all services
- MediaMTX RTSP server setup
- Node.js annotation service configuration
- Nginx API gateway setup
- MongoDB and Redis configurations
- Prometheus and Grafana monitoring setup
- Health checks for services
- SSL/TLS support in API gateway

### Changed
- Updated docker-compose.yml with all services
- Enhanced service configurations with environment variables
- Improved networking setup between services

### Security
- Added SSL/TLS configuration for API gateway
- Basic authentication for RTSP streams
- Secure passwords for MongoDB and Redis

## [0.1.0] - 2024-01-09

### Added
- Initial project structure setup
- Docker and Docker Compose configuration
- RTSP server service configuration
- Annotation service setup
- API Gateway with Nginx
- Prometheus and Grafana monitoring setup
- Development environment configuration
- Basic documentation
- Git configuration and ignore rules
