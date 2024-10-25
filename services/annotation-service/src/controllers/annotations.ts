import { Request, Response, NextFunction } from 'express';
import Annotation, { IAnnotation } from '../models/Annotation';
import { publishAnnotationEvent } from '../utils/redis';
import { logger } from '../utils/logger';

// Get annotations for a stream
export const getAnnotations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { streamId } = req.params;
    const { start, end } = req.query;
    
    const query: any = { streamId };
    if (start || end) {
      query.timestamp = {};
      if (start) query.timestamp.$gte = Number(start);
      if (end) query.timestamp.$lte = Number(end);
    }

    const annotations = await Annotation.find(query)
      .sort({ timestamp: 1 })
      .populate('userId', 'username');

    res.json(annotations);
  } catch (error) {
    next(error);
  }
};

// Create new annotation
export const createAnnotation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const annotation = new Annotation({
      ...req.body,
      userId: req.user._id
    });

    await annotation.save();
    await publishAnnotationEvent('create', annotation);

    res.status(201).json(annotation);
  } catch (error) {
    next(error);
  }
};

// Update annotation
export const updateAnnotation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const annotation = await Annotation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { data: req.body.data } },
      { new: true }
    );

    if (!annotation) {
      return res.status(404).json({ message: 'Annotation not found' });
    }

    await publishAnnotationEvent('update', annotation);
    res.json(annotation);
  } catch (error) {
    next(error);
  }
};

// Delete annotation
export const deleteAnnotation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const annotation = await Annotation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!annotation) {
      return res.status(404).json({ message: 'Annotation not found' });
    }

    await publishAnnotationEvent('delete', annotation);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Batch create annotations
export const batchCreateAnnotations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const annotations = req.body.annotations.map((a: any) => ({
      ...a,
      userId: req.user._id
    }));

    const created = await Annotation.insertMany(annotations);
    
    // Publish events for each annotation
    await Promise.all(
      created.map(annotation => publishAnnotationEvent('create', annotation))
    );

    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};
