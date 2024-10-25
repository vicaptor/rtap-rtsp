import { WebSocketServer, WebSocket } from 'ws';
import { Redis } from 'ioredis';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface WebSocketClient extends WebSocket {
  isAlive: boolean;
  userId?: string;
  streams: Set<string>;
}

export const setupWebSocket = (wss: WebSocketServer, redis: Redis) => {
  // Set up Redis subscriber
  const subscriber = redis.duplicate();
  
  // Handle WebSocket connections
  wss.on('connection', async (ws: WebSocketClient, req) => {
    ws.isAlive = true;
    ws.streams = new Set();

    // Handle authentication
    const token = req.url?.split('token=')[1];
    if (!token) {
      ws.close(1008, 'Authentication required');
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      ws.userId = decoded.userId;
    } catch (error) {
      ws.close(1008, 'Invalid token');
      return;
    }

    // Handle incoming messages
    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message);
        
        switch (data.type) {
          case 'subscribe':
            if (data.streamId) {
              ws.streams.add(data.streamId);
              await subscriber.subscribe(`annotations:${data.streamId}`);
            }
            break;

          case 'unsubscribe':
            if (data.streamId) {
              ws.streams.delete(data.streamId);
              // Only unsubscribe if no other clients are listening
              const hasOtherSubscribers = Array.from(wss.clients).some(
                (client: WebSocketClient) => 
                  client !== ws && client.streams.has(data.streamId)
              );
              if (!hasOtherSubscribers) {
                await subscriber.unsubscribe(`annotations:${data.streamId}`);
              }
            }
            break;

          default:
            logger.warn(`Unknown message type: ${data.type}`);
        }
      } catch (error) {
        logger.error('WebSocket message error:', error);
      }
    });

    // Handle client pings
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    // Clean up on connection close
    ws.on('close', async () => {
      for (const streamId of ws.streams) {
        const hasOtherSubscribers = Array.from(wss.clients).some(
          (client: WebSocketClient) => 
            client !== ws && client.streams.has(streamId)
        );
        if (!hasOtherSubscribers) {
          await subscriber.unsubscribe(`annotations:${streamId}`);
        }
      }
    });
  });

  // Handle Redis messages
  subscriber.on('message', (channel: string, message: string) => {
    const streamId = channel.split(':')[1];
    Array.from(wss.clients)
      .filter((client: WebSocketClient) => 
        client.readyState === WebSocket.OPEN && 
        client.streams.has(streamId)
      )
      .forEach((client: WebSocketClient) => {
        client.send(message);
      });
  });

  // Implement WebSocket heartbeat
  const interval = setInterval(() => {
    wss.clients.forEach((ws: WebSocketClient) => {
      if (!ws.isAlive) {
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
    subscriber.quit();
  });
};
