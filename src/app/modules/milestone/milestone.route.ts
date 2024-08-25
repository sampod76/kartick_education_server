import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { MilestoneController } from './milestone.constroller';
import { MilestoneValidation } from './milestone.validation';

const router = express.Router();

router
  .route('/')
  .get(MilestoneController.getAllMilestone)
  .post(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.SELLER,
    ),
    validateRequestZod(MilestoneValidation.createMilestoneZodSchema),
    MilestoneController.createMilestone,
  );

router
  .route('/:id')
  .get(MilestoneController.getSingleMilestone)
  .patch(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.SELLER,
    ),
    validateRequestZod(MilestoneValidation.updateMilestoneZodSchema),
    MilestoneController.updateMilestone,
  )
  .delete(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.SELLER,
    ),
    MilestoneController.deleteMilestone,
  );

export const MilestoneRoute = router;
