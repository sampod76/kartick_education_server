import express from 'express';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import validateRequestZod from '../../middlewares/validateRequestZod';
const router = express.Router();

router.post(
  '/sign-up',
  validateRequestZod(UserValidation.createUserZodSchema),
  UserController.createStudent
);

router.post(
  '/create-moderator',
  validateRequestZod(UserValidation.createFacultyZodSchema),
  UserController.createModerator
);

router.post(
  '/create-admin',
  validateRequestZod(UserValidation.createAdminZodSchema),
  UserController.createAdmin
);

export const UserRoutes = router;
