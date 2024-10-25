import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../../services/annotation-service/src';
import { User } from '../../services/annotation-service/src/models/User';
import jwt from 'jsonwebtoken';

describe('API Integration Tests', () => {
  let mongoServer: MongoMemoryServer;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    // Create test user and generate token
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    userId = user._id.toString();
    authToken = jwt.sign({ userId }, process.env.JWT_SECRET || 'test-secret');
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('Authentication', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'new@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('username', 'newuser');
    });

    it('should login existing user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
  });

  describe('Annotations', () => {
    it('should create new annotation', async () => {
      const res = await request(app)
        .post('/api/annotations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          streamId: 'test-stream',
          timestamp: Date.now(),
          type: 'marker',
          data: { x: 100, y: 100 }
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('streamId', 'test-stream');
      expect(res.body).toHaveProperty('userId', userId);
    });

    it('should get annotations for stream', async () => {
      const res = await request(app)
        .get('/api/annotations/test-stream')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/annotations')
        .send({
          streamId: 'test-stream',
          timestamp: Date.now(),
          type: 'marker',
          data: { x: 100, y: 100 }
        });

      expect(res.status).toBe(401);
    });
  });
});
