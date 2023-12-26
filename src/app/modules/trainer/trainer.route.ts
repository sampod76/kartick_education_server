import express from 'express';

import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { TrainerController } from './trainer.controller';
import { TrainerValidation } from './trainer.validation';
const router = express.Router();

router
  .route('/')
  .get(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    TrainerController.getAllTrainers
  );

router
  .route('/:id')
  .get(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.TRAINER
    ),
    TrainerController.getSingleTrainer
  )
  .patch(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.TRAINER
    ),
    validateRequestZod(TrainerValidation.updateTrainer),
    TrainerController.updateTrainer
  )
  .delete(
    authMiddleware(ENUM_USER_ROLE.SUPER_ADMIN,ENUM_USER_ROLE.ADMIN),
    TrainerController.deleteTrainer
  );

export const TrainerRoutes = router;
