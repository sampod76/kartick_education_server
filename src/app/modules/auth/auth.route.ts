import express from 'express';

import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
import validateRequestZod from '../../middlewares/validateRequestZod';
import authMiddleware from '../../middlewares/authMiddleware';
import { ENUM_USER_ROLE } from '../../../enums/users';
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
    ENUM_USER_ROLE.STUDENT
  ),
  AuthController.changePassword
);
// router.post(
//   '/forgot-password',
//   AuthController.forgotPass
// );

// router.post(
//   '/reset-password',
//   AuthController.resetPassword
// );

export const AuthRoutes = router;
