import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { StudentPurchasePackageCourseController } from './studentPurchaseCourseBuy.controller';
import { StudentPurchasePackageCourseValidation } from './studentPurchaseCourseBuy.validation';

const router = express.Router();

router
  .route('/')
  .get(
    StudentPurchasePackageCourseController.getAllStudentPurchasePackageCourse,
  )
  .post(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,

      ENUM_USER_ROLE.SELLER,
    ),
    validateRequestZod(
      StudentPurchasePackageCourseValidation.createStudentPurchasePackageCourseZodSchema,
    ),
    StudentPurchasePackageCourseController.createStudentPurchasePackageCourse,
  );

router
  .route('/:id')
  .get(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.TEACHER,
      ENUM_USER_ROLE.STUDENT,
    ),
    StudentPurchasePackageCourseController.getSingleStudentPurchasePackageCourse,
  )
  .delete(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    StudentPurchasePackageCourseController.deleteStudentPurchasePackageCourse,
  )
  .patch(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequestZod(
      StudentPurchasePackageCourseValidation.updateStudentPurchasePackageCourseZodSchema,
    ),
    StudentPurchasePackageCourseController.updateStudentPurchasePackageCourse,
  );

export const StudentPurchasePackageCourseRoute = router;
