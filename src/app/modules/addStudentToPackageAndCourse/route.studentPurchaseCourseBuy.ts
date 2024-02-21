import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { StudentPurchasePackageCategoryCourseController } from './controller.studentPurchaseCourseBuy';
import { StudentPurchasePackageCategoryCourseValidation } from './validation.studentPurchaseCourseBuy';

const router = express.Router();

router
  .route('/')
  .get(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.SELLER,
      ENUM_USER_ROLE.STUDENT,
    ),
    StudentPurchasePackageCategoryCourseController.getAllStudentPurchasePackageCategoryCourse,
  )
  .post(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.SELLER,
    ),
    validateRequestZod(
      StudentPurchasePackageCategoryCourseValidation.createStudentPurchasePackageCategoryCourseZodSchema,
    ),
    StudentPurchasePackageCategoryCourseController.createStudentPurchasePackageCategoryCourse,
  );

router
  .route('/:id')
  .get(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.TEACHER,
      ENUM_USER_ROLE.STUDENT,
      ENUM_USER_ROLE.SELLER,
    ),
    StudentPurchasePackageCategoryCourseController.getSingleStudentPurchasePackageCategoryCourse,
  )
  .delete(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.SELLER,
    ),
    StudentPurchasePackageCategoryCourseController.deleteStudentPurchasePackageCategoryCourse,
  )
  .patch(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.SELLER,
    ),
    validateRequestZod(
      StudentPurchasePackageCategoryCourseValidation.updateStudentPurchasePackageCategoryCourseZodSchema,
    ),
    StudentPurchasePackageCategoryCourseController.updateStudentPurchasePackageCategoryCourse,
  );

export const StudentPurchasePackageCategoryCourseRoute = router;
