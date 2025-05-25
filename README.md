# RTAP-RTSP System

## License

```
#
# Copyright 2025 Tom Sapletta <info@softreck.dev>
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
```

## Author
- Tom Sapletta <info@softreck.dev>


Real-Time Annotation Platform with RTSP Streaming capabilities.

## Features

- RTSP streaming with HLS and WebRTC support
- Real-time annotation system
- WebSocket-based live updates
- Secure API gateway
- Comprehensive monitoring
- TypeScript client SDK
- Complete test coverage

## Architecture

The system consists of several microservices:

- RTSP Server (Go/MediaMTX)
- Annotation Service (Node.js)
- API Gateway (Nginx)
- Monitoring Stack (Prometheus/Grafana)
- Client SDK (TypeScript)

For detailed architecture information, see [Architecture Documentation](docs/architecture.md).

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/your-org/rtap-rtsp.git
cd rtap-rtsp
```

2. Setup development environment:
```bash
./scripts/setup-dev.sh
```

3. Start services:
```bash
make dev
```

4. Access services:
- RTSP Server: rtsp://localhost:8554
- API Gateway: http://localhost:8080
- Grafana: http://localhost:3001

## Documentation

- [API Documentation](docs/api/README.md)
- [Deployment Guide](docs/deployment.md)
- [Development Guide](docs/development.md)
- [Troubleshooting Guide](docs/troubleshooting.md)

## Development

1. Build all services:
```bash
make build
```

2. Run tests:
```bash
make test
```

3. Start development environment:
```bash
make dev
```

See [Development Guide](docs/development.md) for more details.

## Testing

- Unit tests: `make test-unit`
- Integration tests: `make test-integration`
- Performance tests: `make test-performance`

See [Testing Documentation](tests/README.md) for more details.

## Deployment

1. Configure environment:
```bash
cp config/production/.env.example config/production/.env
```

2. Deploy:
```bash
export DEPLOY_ENV=production
./scripts/deploy.sh
```

See [Deployment Guide](docs/deployment.md) for full instructions.

## Monitoring

- Prometheus metrics at http://localhost:9090
- Grafana dashboards at http://localhost:3001
- Custom service metrics and alerts

See monitoring documentation for dashboard setup.

## Client SDK

```typescript
import { RTAPClient } from 'rtap-client-sdk';

const client = new RTAPClient({
  playerConfig: { /* ... */ },
  annotationConfig: { /* ... */ },
  wsConfig: { /* ... */ }
});

await client.initialize(videoElement);
await client.loadStream('rtsp://example.com/stream');
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

See [Development Guide](docs/development.md) for coding standards.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues and support:
1. Check [Troubleshooting Guide](docs/troubleshooting.md)
2. Search existing issues
3. Create a new issue with details

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and changes.
