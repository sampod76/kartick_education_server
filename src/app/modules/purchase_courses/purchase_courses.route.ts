import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { PurchaseCourseController } from './purchase_courses.controller';
import { PurchaseCourseValidation } from './purchase_courses.validation';

const router = express.Router();

router
  .route('/')
  .get(PurchaseCourseController.getAllCoursePurchase)
  .post(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.TEACHER,
      ENUM_USER_ROLE.STUDENT
    ),
    validateRequestZod(
      PurchaseCourseValidation.createPurchaseCourseZodSchema
    ),
    PurchaseCourseController.createPurchaseCourse
  );

router
  .route('/:id')
  .get(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.TEACHER,
      ENUM_USER_ROLE.STUDENT
    ),
    PurchaseCourseController.getSingleCoursePurchase
  )
  .delete(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    PurchaseCourseController.deleteCoursePurchase
  )
  .patch(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    PurchaseCourseController.updatePurchaseCourse
  );

export const PurchaseCourseRoute = router;
