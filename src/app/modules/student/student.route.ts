import express from 'express';

import { StudentController } from './student.controller';

import validateRequestZod from '../../middlewares/validateRequestZod';
import authMiddleware from '../../middlewares/authMiddleware';
import { ENUM_USER_ROLE } from '../../../enums/users';
import { StudentValidation } from './student.validation';
const router = express.Router();

router
  .route('/')
  .get( authMiddleware(ENUM_USER_ROLE.ADMIN), StudentController.getAllStudents)


router
  .route('/:id')
  .get( authMiddleware(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.student),StudentController.getSingleStudent)
  .put(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    validateRequestZod(StudentValidation.updateStudentZodSchema),
    StudentController.updateStudent
  )
  .delete(authMiddleware(ENUM_USER_ROLE.ADMIN), StudentController.deleteStudent);

export const StudentRoutes = router;
