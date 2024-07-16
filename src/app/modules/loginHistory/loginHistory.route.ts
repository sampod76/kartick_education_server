import express from 'express';

import { UserLoginHistoryController } from './loginHistory.controller';

import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { UserLoginHistoryValidation } from './loginHistory.validation';
const router = express.Router();

router
  .route('/')
  .get(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.TEACHER,
      ENUM_USER_ROLE.SELLER,
      ENUM_USER_ROLE.STUDENT,
    ),
    UserLoginHistoryController.getAllUserLoginHistorys,
  );

router
  .route('/:id')
  .get(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.TEACHER,
      ENUM_USER_ROLE.SELLER,
      ENUM_USER_ROLE.STUDENT,
    ),
    UserLoginHistoryController.getSingleUserLoginHistory,
  )
  .patch(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequestZod(
      UserLoginHistoryValidation.updateUserLoginHistoryZodSchema,
    ),
    UserLoginHistoryController.updateUserLoginHistory,
  )
  .delete(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    UserLoginHistoryController.deleteUserLoginHistory,
  );

export const UserLoginHistoryRoutes = router;
