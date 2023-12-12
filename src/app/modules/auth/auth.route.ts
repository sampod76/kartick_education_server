import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
const router = express.Router();

router.route('/login').post(
  // any role login -- uid and role must be provide
  validateRequestZod(AuthValidation.loginZodSchema),
  // authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
  AuthController.loginUser
);

router
  .route('/my-profile')
  .get(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    AuthController.myProfile
  )
  .put(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    AuthController.myProfileUpdate
  );

router
  .route('/refresh-token')
  .post(
    validateRequestZod(AuthValidation.refreshTokenZodSchema),
    AuthController.refreshToken
  );

export const AuthRouter = router;
