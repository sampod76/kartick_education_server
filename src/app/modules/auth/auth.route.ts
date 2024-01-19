import express from 'express';

import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
const router = express.Router();

router.post(
  '/login',
  validateRequestZod(AuthValidation.loginZodSchema),
  AuthController.loginUser
);

router.post(
  '/refresh-token',
  validateRequestZod(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken
);

router.post(
  '/change-password',
  validateRequestZod(AuthValidation.changePasswordZodSchema),
  authMiddleware(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.MODERATOR,
    ENUM_USER_ROLE.STUDENT,
    ENUM_USER_ROLE.SELLER
  ),
  AuthController.changePassword
);

router.get(
  '/profile',
  authMiddleware(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.MODERATOR,
    ENUM_USER_ROLE.STUDENT,
    ENUM_USER_ROLE.SELLER
  ),
  AuthController.profile
);

router.post(
  '/forgot-password',
  validateRequestZod(AuthValidation.forgotPassword),
  AuthController.forgotPass
);

// router.post(
//   '/reset-password',
//   AuthController.resetPassword
// );

export const AuthRoutes = router;
