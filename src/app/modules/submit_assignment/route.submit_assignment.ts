import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';

import { SubmitAssignmentController } from './constroller.submit_assignment';
import { submitAssignmentValidation } from './validation.submit_assignment';

const router = express.Router();

router
  .route('/')
  // This route is open
  .get(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.SELLER,
      ENUM_USER_ROLE.STUDENT,
    ),
    SubmitAssignmentController.getAllSubmitAssignment,
  )
  .post(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.SELLER,
      ENUM_USER_ROLE.STUDENT,
    ),
    validateRequestZod(
      submitAssignmentValidation.createsubmitAssignmentZodSchema,
    ),
    SubmitAssignmentController.createSubmitAssignment,
  );

router
  .route('/:id')
  // This route is open
  .get(SubmitAssignmentController.getSingleSubmitAssignment)
  .patch(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.SELLER,
      // ENUM_USER_ROLE.STUDENT,
    ),
    validateRequestZod(
      submitAssignmentValidation.updatesubmitAssignmentZodSchema,
    ),
    SubmitAssignmentController.updateSubmitAssignment,
  )
  .delete(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.SELLER,
      // ENUM_USER_ROLE.STUDENT,
    ),
    SubmitAssignmentController.deleteSubmitAssignment,
  );

export const SubmitAssignmentRoute = router;
