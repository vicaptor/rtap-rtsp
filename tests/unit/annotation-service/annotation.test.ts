import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Annotation } from '../../../services/annotation-service/src/models/Annotation';
import { User } from '../../../services/annotation-service/src/models/User';

describe('Annotation Model Test', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Annotation.deleteMany({});
    await User.deleteMany({});
  });

  it('should create & save annotation successfully', async () => {
    // Create test user
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    const validAnnotation = new Annotation({
      streamId: 'test-stream',
      timestamp: Date.now(),
      type: 'marker',
      data: { x: 100, y: 100 },
      userId: user._id
    });

    const savedAnnotation = await validAnnotation.save();
    
    expect(savedAnnotation._id).toBeDefined();
    expect(savedAnnotation.streamId).toBe(validAnnotation.streamId);
    expect(savedAnnotation.type).toBe(validAnnotation.type);
    expect(savedAnnotation.userId.toString()).toBe(user._id.toString());
  });

  it('should fail to save annotation with invalid type', async () => {
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    const annotationWithInvalidType = new Annotation({
      streamId: 'test-stream',
      timestamp: Date.now(),
      type: 'invalid-type',
      data: { x: 100, y: 100 },
      userId: user._id
    });

    let err;
    try {
      await annotationWithInvalidType.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('should fail to save annotation without required fields', async () => {
    const annotationWithoutRequired = new Annotation({
      data: { x: 100, y: 100 }
    });

    let err;
    try {
      await annotationWithoutRequired.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('should find annotations by streamId', async () => {
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    // Create multiple annotations
    await Annotation.create([
      {
        streamId: 'stream1',
        timestamp: Date.now(),
        type: 'marker',
        data: { x: 100, y: 100 },
        userId: user._id
      },
      {
        streamId: 'stream1',
        timestamp: Date.now(),
        type: 'marker',
        data: { x: 200, y: 200 },
        userId: user._id
      },
      {
        streamId: 'stream2',
        timestamp: Date.now(),
        type: 'marker',
        data: { x: 300, y: 300 },
        userId: user._id
      }
    ]);

    const stream1Annotations = await Annotation.find({ streamId: 'stream1' });
    expect(stream1Annotations).toHaveLength(2);
  });
});
