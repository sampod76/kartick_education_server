import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { Course_labelController } from './constroller.course_label';
import { Course_labelValidation } from './validation.course_label';

const router = express.Router();

router
  .route('/')
  // This route is open
  .get(Course_labelController.getAllCourse_label)
  .post(
    authMiddleware(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequestZod(Course_labelValidation.createCourse_labelZodSchema),
    Course_labelController.createCourse_label
  );


router
  .route('/Course_label-children')
  // This route is open
  .get(Course_labelController.getAllCourse_labelChildrenTitle)


router
  .route('/:id')
  // This route is open
  .get(Course_labelController.getSingleCourse_label)
  .patch(
    authMiddleware(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequestZod(Course_labelValidation.updateCourse_labelZodSchema),
    Course_labelController.updateCourse_label
  )
  .delete(
    authMiddleware(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),
    Course_labelController.deleteCourse_label
  );

export const Course_labelRoute = router;
