import { Redis } from 'ioredis';
import { IAnnotation } from '../models/Annotation';
import { logger } from './logger';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});

type EventType = 'create' | 'update' | 'delete';

export const publishAnnotationEvent = async (type: EventType, annotation: IAnnotation) => {
  try {
    const event = {
      type,
      annotation: {
        _id: annotation._id,
        streamId: annotation.streamId,
        timestamp: annotation.timestamp,
        data: annotation.data,
        userId: annotation.userId,
        createdAt: annotation.createdAt,
        updatedAt: annotation.updatedAt
      }
    };

    await redis.publish(
      `annotations:${annotation.streamId}`,
      JSON.stringify(event)
    );
  } catch (error) {
    logger.error('Redis publish error:', error);
    throw error;
  }
};

export { redis };
