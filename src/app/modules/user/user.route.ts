import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
const router = express.Router();

router.get(
  '/',
  authMiddleware(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.MODERATOR
  ),
  UserController.getUsers
);
router.get(
  '/:id',
  authMiddleware(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.MODERATOR
  ),
  UserController.getSingleUser
);

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
router.post(
  '/create-seller',
  validateRequestZod(UserValidation.createSellerZodSchema),
  UserController.createSeller
);
router.post(
  '/create-trainer',
  validateRequestZod(UserValidation.createTrainerZodSchema),
  UserController.createTrainer
);

export const UserRoutes = router;
