import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { validateRequest } from '../middleware/validate';
import { isAuthenticated } from '../middleware/auth';
import * as annotationController from '../controllers/annotations';

const router = Router();

// Get annotations for a stream
router.get(
  '/:streamId',
  [
    param('streamId').isString(),
    query('start').optional().isNumeric(),
    query('end').optional().isNumeric(),
    validateRequest
  ],
  isAuthenticated,
  annotationController.getAnnotations
);

// Create new annotation
router.post(
  '/',
  [
    body('streamId').isString(),
    body('timestamp').isNumeric(),
    body('type').isIn(['marker', 'label', 'bbox', 'polygon', 'comment']),
    body('data').exists(),
    validateRequest
  ],
  isAuthenticated,
  annotationController.createAnnotation
);

// Update annotation
router.put(
  '/:id',
  [
    param('id').isMongoId(),
    body('data').exists(),
    validateRequest
  ],
  isAuthenticated,
  annotationController.updateAnnotation
);

// Delete annotation
router.delete(
  '/:id',
  [
    param('id').isMongoId(),
    validateRequest
  ],
  isAuthenticated,
  annotationController.deleteAnnotation
);

// Batch operations
router.post(
  '/batch',
  [
    body('annotations').isArray(),
    validateRequest
  ],
  isAuthenticated,
  annotationController.batchCreateAnnotations
);

export { router as annotationRoutes };
