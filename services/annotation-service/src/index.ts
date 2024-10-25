import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import cors from 'cors';
import dotenv from 'dotenv';
import { annotationRoutes } from './routes/annotations';
import { authRoutes } from './routes/auth';
import { setupWebSocket } from './websocket';
import { errorHandler } from './middleware/error';
import { authMiddleware } from './middleware/auth';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Redis client setup
const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/rtap')
  .then(() => logger.info('Connected to MongoDB'))
  .catch((err) => logger.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(authMiddleware);

// Routes
app.use('/api/annotations', annotationRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', version: process.env.npm_package_version });
});

// WebSocket setup
setupWebSocket(wss, redis);

// Error handling
app.use(errorHandler);

// Start server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  logger.info(`Annotation service listening on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      redis.quit();
      process.exit(0);
    });
  });
});

export { app, server };
