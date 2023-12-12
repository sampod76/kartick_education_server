import express from 'express';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { UserController } from './users.controller';
import { UserValidation } from './users.validation';
import { GeneralUserValidation } from '../generalUser/validation.GeneralUser';
import { GeneralUserController } from '../generalUser/controller.GeneralUser';

const router = express.Router();

router
  .route('/create-general-user')
  .post(
    validateRequestZod(UserValidation.createGeneralUserZodSchema),
    UserController.createGeneralUser
  );

router
  .route('/sign-up')
  .post(
    validateRequestZod(
      GeneralUserValidation.createGeneralUserByFirebaseZodSchema
    ),
    GeneralUserController.createGeneralUserByFirebase
  );

router
  .route('/create-admin')
  .post(
    validateRequestZod(UserValidation.createAdminZodSchema),
    UserController.createAdmin
  );

router
  .route('/create-moderator')
  .post(
    validateRequestZod(UserValidation.createModeratorZodSchema),
    UserController.createModerator
  );

export const UserRoute = router;
