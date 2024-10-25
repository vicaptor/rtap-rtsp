import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validate';
import * as authController from '../controllers/auth';
import { isAuthenticated, isAdmin } from '../middleware/auth';

const router = Router();

// Register new user
router.post(
  '/register',
  [
    body('username').isString().trim().isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isString().isLength({ min: 6 }),
    validateRequest
  ],
  authController.register
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').isString(),
    validateRequest
  ],
  authController.login
);

// Get current user
router.get(
  '/me',
  isAuthenticated,
  authController.getCurrentUser
);

// Update user
router.put(
  '/me',
  [
    body('email').optional().isEmail(),
    body('password').optional().isString().isLength({ min: 6 }),
    validateRequest
  ],
  isAuthenticated,
  authController.updateUser
);

// Admin routes
router.get(
  '/users',
  isAuthenticated,
  isAdmin,
  authController.getAllUsers
);

export { router as authRoutes };
