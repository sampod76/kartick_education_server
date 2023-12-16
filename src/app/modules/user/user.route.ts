import express from 'express';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
const router = express.Router();

router.post(
  '/create-student',
  validateRequestZod(UserValidation.SignUpZodSchema),
  UserController.createStudent
);

router.post(
  '/create-moderator',
  validateRequestZod(UserValidation.createModeratorZodSchema),
  UserController.createModerator
);

router.post(
  '/create-admin',
  validateRequestZod(UserValidation.createAdminZodSchema),
  UserController.createAdmin
);

export const UserRoutes = router;
