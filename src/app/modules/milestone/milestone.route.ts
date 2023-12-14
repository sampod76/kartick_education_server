
import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { MilestoneController } from './milestone.controller';
import {MilestoneValidation } from './milestone.validation';

const router = express.Router();

router
  .route('/')
  .get(MilestoneController.getAllMilestone)
  .post(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    validateRequestZod(MilestoneValidation.createMilestoneZodSchema),
    MilestoneController.createMilestone
  );

router
  .route('/:id')
  .get(MilestoneController.getSingleMilestone)
  .put(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    validateRequestZod(MilestoneValidation.updateMilestoneZodSchema),
    MilestoneController.updateMilestone
  )
  .delete(authMiddleware(ENUM_USER_ROLE.ADMIN), MilestoneController.deleteMilestone);

export const MilestoneRoutes = router;