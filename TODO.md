# AI Implementation Prompts for RTAP-RTSP System

## 1. Project Structure Setup

```prompt
Create a complete project structure for a RTAP-RTSP streaming system with the following requirements:
- Uses Docker and Docker Compose
- Includes RTSP server, annotation service, and API gateway
- Supports monitoring and logging
- Follows modern best practices for project organization
- Include .gitignore, README.md, and directory structure
Please provide the complete directory tree and the content of key configuration files.
```

## 2. Docker Configuration

```prompt
Create Docker and Docker Compose configuration for a RTAP-RTSP streaming system with:
- RTSP server service based on MediaMTX
- Node.js annotation service
- Nginx API gateway
- MongoDB for storage
- Redis for caching
- Prometheus and Grafana for monitoring
Include:
1. Main docker-compose.yml
2. Individual Dockerfiles for each service
3. Development and production configurations
4. Network and volume setup
5. Environment variables structure
```

## 3. RTSP Server Implementation

```prompt
Create a Go-based RTSP server implementation using MediaMTX with:
- Configuration for multiple stream types (RTSP, HLS, WebRTC)
- Authentication middleware
- Stream health monitoring
- Media storage management
- Integration with the annotation service
Include:
1. Main server code
2. Configuration structure
3. API endpoints
4. Monitoring setup
```

## 4. Annotation Service

```prompt
Create a Node.js-based annotation service with:
- WebSocket server for real-time annotations
- REST API for annotation CRUD operations
- MongoDB integration
- Redis pub/sub for real-time updates
- Authentication and authorization
Include:
1. Server setup code
2. WebSocket handlers
3. API routes
4. Database models
5. Authentication middleware
```

## 5. API Gateway Configuration

```prompt
Create an Nginx API gateway configuration with:
- Routing for RTSP and annotation services
- SSL/TLS setup
- Rate limiting
- Load balancing
- CORS configuration
- WebSocket proxy support
Include:
1. nginx.conf
2. SSL configuration
3. Proxy settings
4. Rate limiting rules
```

## 6. Monitoring Setup

```prompt
Create monitoring configuration for the RTAP-RTSP system using:
- Prometheus for metrics collection
- Grafana for visualization
- Custom metrics for streaming and annotation services
Include:
1. Prometheus configuration
2. Grafana dashboards
3. Alert rules
4. Custom metrics setup
```

## 7. Client SDK

```prompt
Create a TypeScript/JavaScript client SDK for the RTAP-RTSP system with:
- Media player integration
- Annotation overlay management
- WebSocket connection handling
- Error handling
- TypeScript types and documentation
Include:
1. SDK core classes
2. Media player wrapper
3. Annotation manager
4. WebSocket client
5. Type definitions
```

## 8. Testing Suite

```prompt
Create a comprehensive testing suite for the RTAP-RTSP system including:
- Unit tests for each service
- Integration tests for service communication
- Performance tests for streaming and annotation
- Load testing configuration
Include:
1. Test structure
2. Test cases
3. Testing utilities
4. CI/CD integration
```

## 9. Development Scripts

```prompt
Create development scripts and Makefile for the RTAP-RTSP system with:
- Build commands
- Development environment setup
- Testing commands
- Deployment scripts
- Database management
Include:
1. Makefile
2. Shell scripts
3. Development utilities
4. Documentation
```

## 10. Documentation

```prompt
Create comprehensive documentation for the RTAP-RTSP system including:
- System architecture
- API documentation
- Deployment guide
- Development setup
- Troubleshooting guide
Include:
1. README.md
2. API docs
3. Architecture diagrams
4. Setup guides
5. Contributing guidelines
```
