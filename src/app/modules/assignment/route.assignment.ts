import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { AssignmentController } from './constroller.assignment';
import { AssignmentValidation } from './validation.assignment';

const router = express.Router();

router
  .route('/')
  // This route is open
  .get(AssignmentController.getAllAssignment)
  .post(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.SELLER,
    ),
    validateRequestZod(AssignmentValidation.createAssignmentZodSchema),
    AssignmentController.createAssignment,
  );

router
  .route('/:id')
  // This route is open
  .get(AssignmentController.getSingleAssignment)
  .patch(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.SELLER,
    ),
    validateRequestZod(AssignmentValidation.updateAssignmentZodSchema),
    AssignmentController.updateAssignment,
  )
  .delete(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.SELLER,
    ),
    AssignmentController.deleteAssignment,
  );

export const AssignmentRoute = router;
