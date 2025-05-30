# Testing Suite

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


This directory contains comprehensive tests for the RTAP-RTSP system.

## Structure

```
tests/
├── unit/               # Unit tests for individual components
│   ├── rtsp-server/    # RTSP server tests
│   └── annotation-service/ # Annotation service tests
├── integration/        # Integration tests between services
└── performance/        # Performance and load tests
    └── k6/            # k6 load testing scripts
```

## Running Tests

### Unit Tests

For RTSP server:
```bash
cd services/rtsp-server
go test ./... -v
```

For Annotation service:
```bash
cd services/annotation-service
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### Performance Tests

Install k6:
```bash
# For Ubuntu/Debian
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

Run load tests:
```bash
k6 run tests/performance/k6/stream-load.js
k6 run tests/performance/k6/ws-load.js
```

## Test Coverage

To generate coverage reports:

For Go:
```bash
go test ./... -coverprofile=coverage.out
go tool cover -html=coverage.out
```

For TypeScript:
```bash
npm run test:coverage
