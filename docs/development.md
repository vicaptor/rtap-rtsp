# Development Guide

## Setup Development Environment

1. Install prerequisites:
```bash
./scripts/setup-dev.sh
```

2. Configure environment:
```bash
cp config/development/.env.example config/development/.env
```

## Project Structure

```
.
├── services/               # Microservices
│   ├── rtsp-server/       # Go RTSP server
│   ├── annotation-service/# Node.js annotation service
│   └── api-gateway/       # Nginx gateway
├── client-sdk/            # TypeScript client SDK
├── config/                # Configuration files
├── docs/                  # Documentation
├── monitoring/            # Monitoring configuration
└── tests/                # Test suites
```

## Development Workflow

1. Create feature branch:
```bash
git checkout -b feature/new-feature
```

2. Start development environment:
```bash
make dev
```

3. Run tests:
```bash
make test
```

4. Update documentation:
   - Update API docs if endpoints change
   - Update architecture docs if design changes
   - Update deployment docs if process changes

5. Create pull request:
   - Include tests
   - Update CHANGELOG.md
   - Follow commit message convention

## Testing

### Unit Tests

```bash
make test-unit
```

### Integration Tests

```bash
make test-integration
```

### Performance Tests

```bash
make test-performance
```

## Code Style

### Go

- Follow [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments)
- Use `go fmt` and `go vet`
- Document exported functions

### TypeScript

- Follow ESLint configuration
- Use TypeScript strict mode
- Document public APIs

### Git Commits

Format:
```
type(scope): description

[body]

[footer]
```

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Tests
- chore: Maintenance

## Debugging

### RTSP Server

1. Enable debug logging:
```yaml
# mediamtx.yml
debug: true
```

2. View logs:
```bash
make logs
```

### Annotation Service

1. Enable debug mode:
```bash
DEBUG=* npm run dev
```

2. Use Chrome DevTools:
   - chrome://inspect
   - Configure network targets

## Common Tasks

### Adding a New API Endpoint

1. Update API documentation
2. Implement endpoint
3. Add tests
4. Update client SDK
5. Update CHANGELOG.md

### Adding a New Feature

1. Design
   - Update architecture docs
   - Create technical spec
   - Review with team

2. Implementation
   - Create feature branch
   - Write tests first
   - Implement feature
   - Update documentation

3. Review
   - Self-review checklist
   - Create pull request
   - Address feedback

4. Release
   - Merge to main
   - Update version
   - Deploy

## Troubleshooting

### Common Issues

1. Build Failures
   - Check dependencies
   - Verify environment variables
   - Check disk space

2. Test Failures
   - Check test environment
   - Verify database connection
   - Check test data

3. Runtime Errors
   - Check logs
   - Verify configurations
   - Check resource usage
