import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { Skills_planController } from './skills_plan.constroller';
import { Skills_planValidation } from './skills_plan.validation';

const router = express.Router();

router
  .route('/')
  .get(Skills_planController.getAllSkills_plan)
  .post(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequestZod(Skills_planValidation.createSkills_planZodSchema),
    Skills_planController.createSkills_plan,
  );

router
  .route('/:id')
  .get(Skills_planController.getSingleSkills_plan)
  .patch(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequestZod(Skills_planValidation.updateSkills_planZodSchema),
    Skills_planController.updateSkills_plan,
  )
  .delete(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    Skills_planController.deleteSkills_plan,
  );

export const Skills_planRoute = router;
