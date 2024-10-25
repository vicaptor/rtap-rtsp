import ws from 'k6/ws';
import { check } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export let options = {
  stages: [
    { duration: '1m', target: 100 },  // Ramp up to 100 connections
    { duration: '3m', target: 100 },  // Stay at 100 connections
    { duration: '1m', target: 200 },  // Ramp up to 200 connections
    { duration: '3m', target: 200 },  // Stay at 200 connections
    { duration: '1m', target: 0 },    // Ramp down to 0 connections
  ],
  thresholds: {
    errors: ['rate<0.1'], // Error rate should be below 10%
  },
};

export default function() {
  const url = 'ws://localhost:8080/ws';
  const params = { tags: { my_tag: 'websocket' } };

  const res = ws.connect(url, params, function(socket) {
    socket.on('open', () => {
      socket.send(JSON.stringify({
        type: 'subscribe',
        streamId: 'test-stream'
      }));
    });

    socket.on('message', (data) => {
      const message = JSON.parse(data);
      check(message, {
        'message has type': (obj) => obj.type !== undefined,
      }) || errorRate.add(1);
    });

    socket.on('error', () => {
      errorRate.add(1);
    });

    // Send periodic annotations
    setInterval(() => {
      socket.send(JSON.stringify({
        type: 'annotation',
        annotation: {
          streamId: 'test-stream',
          timestamp: Date.now(),
          type: 'marker',
          data: { x: 100, y: 100 }
        }
      }));
    }, 1000);
  });

  check(res, { 'status is 101': (r) => r && r.status === 101 });
}
