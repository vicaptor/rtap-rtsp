# RTAP-RTSP System Architecture

## Overview

The RTAP-RTSP system is a distributed streaming and annotation platform built with modern microservices architecture. It enables real-time video streaming with synchronized annotations.

## System Components

### 1. RTSP Server
- Built with Go and MediaMTX
- Handles video streaming (RTSP, HLS, WebRTC)
- Manages stream health and storage
- Provides API for stream management

### 2. Annotation Service
- Node.js-based microservice
- Real-time annotation handling via WebSocket
- MongoDB for persistent storage
- Redis for real-time pub/sub
- JWT-based authentication

### 3. API Gateway
- Nginx-based gateway
- SSL/TLS termination
- Load balancing
- Rate limiting
- CORS and security headers
- WebSocket proxy support

### 4. Monitoring Stack
- Prometheus for metrics collection
- Grafana for visualization
- Custom service metrics
- Alert management

## Data Flow

1. Client Connection:
   ```mermaid
   sequenceDiagram
   Client->>API Gateway: Connect
   API Gateway->>Auth Service: Validate
   Auth Service->>API Gateway: Token
   API Gateway->>Client: Connection Established
   ```

2. Stream Flow:
   ```mermaid
   sequenceDiagram
   Source->>RTSP Server: Stream
   RTSP Server->>Storage: Record
   Client->>API Gateway: Request Stream
   API Gateway->>RTSP Server: Proxy Request
   RTSP Server->>Client: Stream Data
   ```

3. Annotation Flow:
   ```mermaid
   sequenceDiagram
   Client->>API Gateway: WebSocket Connect
   API Gateway->>Annotation Service: Proxy WS
   Client->>Annotation Service: Create Annotation
   Annotation Service->>MongoDB: Store
   Annotation Service->>Redis: Publish
   Annotation Service->>Connected Clients: Broadcast
   ```

## Security

1. Authentication
   - JWT-based token system
   - Role-based access control
   - SSL/TLS encryption

2. Network Security
   - Internal service isolation
   - Rate limiting
   - CORS protection
   - Security headers

## Scalability

1. Horizontal Scaling
   - Stateless services
   - Load balanced components
   - Distributed caching

2. Performance Optimization
   - Redis caching
   - Connection pooling
   - Stream optimization

## Monitoring

1. Metrics Collection
   - Service health
   - Performance metrics
   - Business metrics

2. Alerting
   - Service availability
   - Performance thresholds
   - Error rates

## Deployment Architecture

```
[Client] → [CDN/Load Balancer]
    ↓
[API Gateway (Nginx)]
    ↓
[Service Mesh]
    ↓
┌─────────────────┬─────────────────┬─────────────────┐
│   RTSP Server   │   Annotation    │   Monitoring    │
│   (Go/MediaMTX) │    Service      │    Stack        │
└────────┬────────┴────────┬────────┴────────┬────────┘
         │                 │                 │
         ↓                 ↓                 ↓
    [Storage]         [MongoDB]         [Prometheus]
                         ↕                 ↕
                     [Redis]           [Grafana]
