import express from 'express';
import { ModeratorController } from './moderator.controller';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { ModeratorValidation } from './moderator.validations';
import authMiddleware from '../../middlewares/authMiddleware';
import { ENUM_USER_ROLE } from '../../../enums/users';


const router = express.Router();

router
  .route('/')
  .get( authMiddleware(ENUM_USER_ROLE.ADMIN), ModeratorController.getAllModerators)


router
  .route('/:id')
  .get( authMiddleware(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.MODERATOR),ModeratorController.getSingleModerator)
  .put(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    validateRequestZod(ModeratorValidation.updateModeratorZodSchema),
    ModeratorController.updateModerator
  )
  .delete(authMiddleware(ENUM_USER_ROLE.ADMIN), ModeratorController.deleteModerator);

export const ModeratorRoutes = router;
