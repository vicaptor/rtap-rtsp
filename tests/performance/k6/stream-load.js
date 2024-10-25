import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export let options = {
  stages: [
    { duration: '1m', target: 50 },  // Ramp up to 50 users
    { duration: '3m', target: 50 },  // Stay at 50 users
    { duration: '1m', target: 100 }, // Ramp up to 100 users
    { duration: '3m', target: 100 }, // Stay at 100 users
    { duration: '1m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    errors: ['rate<0.1'],             // Error rate should be below 10%
  },
};

const BASE_URL = 'http://localhost:8080';
const API_URL = `${BASE_URL}/api`;

// Simulate user behavior
export default function() {
  // Login
  const loginRes = http.post(`${API_URL}/auth/login`, {
    email: 'test@example.com',
    password: 'password123',
  });

  check(loginRes, {
    'login successful': (r) => r.status === 200,
  }) || errorRate.add(1);

  const token = loginRes.json('token');

  // Get stream information
  const streamRes = http.get(`${API_URL}/streams/test-stream`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  check(streamRes, {
    'stream info retrieved': (r) => r.status === 200,
  }) || errorRate.add(1);

  // Create annotation
  const annotationRes = http.post(
    `${API_URL}/annotations`,
    JSON.stringify({
      streamId: 'test-stream',
      timestamp: Date.now(),
      type: 'marker',
      data: { x: 100, y: 100 },
    }),
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  check(annotationRes, {
    'annotation created': (r) => r.status === 201,
  }) || errorRate.add(1);

  sleep(1);
}
