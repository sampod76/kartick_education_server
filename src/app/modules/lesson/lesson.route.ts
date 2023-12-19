import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { LessonController } from './lesson.constroller';
import { LessonValidation } from './lesson.validation';

const router = express.Router();

router
  .route('/')
  .get(LessonController.getAllLesson)
  .post(
    authMiddleware(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequestZod(LessonValidation.createLessonZodSchema),
    LessonController.createLesson
  );

router
  .route('/:id')
  .get(LessonController.getSingleLesson)
  .patch(
    authMiddleware(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequestZod(LessonValidation.updateLessonZodSchema),
    LessonController.updateLesson
  )
  .delete(authMiddleware(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN), LessonController.deleteLesson);

export const LessonRoute = router;
