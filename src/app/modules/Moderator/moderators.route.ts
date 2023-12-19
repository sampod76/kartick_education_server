import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { ModeratorController } from './moderator.controller';
import { ModeratorValidation } from './moderator.validations';

const router = express.Router();

router
  .route('/')
  .get(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    ModeratorController.getAllModerators
  );

router
  .route('/:id')
  .get(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MODERATOR),
    ModeratorController.getSingleModerator
  )
  .patch(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    validateRequestZod(ModeratorValidation.updateModeratorZodSchema),
    ModeratorController.updateModerator
  )
  .delete(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    ModeratorController.deleteModerator
  );

export const ModeratorRoutes = router;
