# API Documentation

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


## Overview

The RTAP-RTSP system provides RESTful APIs and WebSocket endpoints for stream management and real-time annotations.

## Authentication

All API requests require JWT authentication:

```http
Authorization: Bearer <token>
```

### Get Token

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJ...",
  "user": {
    "id": "123",
    "username": "user",
    "email": "user@example.com"
  }
}
```

## Stream Management

### List Streams

```http
GET /api/streams
```

Response:
```json
{
  "streams": [
    {
      "id": "stream1",
      "name": "Camera 1",
      "status": "active",
      "url": "rtsp://server/stream1"
    }
  ]
}
```

### Start Stream

```http
POST /api/streams
Content-Type: application/json

{
  "name": "Camera 1",
  "source": "rtsp://camera/stream"
}
```

### Stop Stream

```http
DELETE /api/streams/{id}
```

## Annotations

### Create Annotation

```http
POST /api/annotations
Content-Type: application/json

{
  "streamId": "stream1",
  "timestamp": 1234567890,
  "type": "marker",
  "data": {
    "x": 100,
    "y": 100,
    "label": "Object"
  }
}
```

### Get Stream Annotations

```http
GET /api/annotations/{streamId}
```

Response:
```json
{
  "annotations": [
    {
      "id": "ann1",
      "streamId": "stream1",
      "timestamp": 1234567890,
      "type": "marker",
      "data": {
        "x": 100,
        "y": 100,
        "label": "Object"
      }
    }
  ]
}
```

## WebSocket API

### Connect

```javascript
const ws = new WebSocket('ws://server/ws');
ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'subscribe',
    streamId: 'stream1'
  }));
};
```

### Message Types

1. Subscribe:
```json
{
  "type": "subscribe",
  "streamId": "stream1"
}
```

2. Annotation:
```json
{
  "type": "annotation",
  "annotation": {
    "streamId": "stream1",
    "timestamp": 1234567890,
    "type": "marker",
    "data": {
      "x": 100,
      "y": 100
    }
  }
}
```

## Error Handling

All API errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

Common error codes:
- `AUTH_REQUIRED`: Authentication required
- `INVALID_TOKEN`: Invalid or expired token
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid request data
