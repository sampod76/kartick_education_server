import express from 'express';

import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { CourseController } from './course.constroller';
import { CourseValidation } from './course.validation';

const router = express.Router();

router
  .route('/')
  .get(CourseController.getAllCourse)
  .post(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    validateRequestZod(CourseValidation.createCourseZodSchema),
    CourseController.createCourse
  );

router
  .route('/review/:id')
  .post(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    validateRequestZod(CourseValidation.courseReviewZodSchema),
    CourseController.courseReviewsByUser
  )
  .delete(authMiddleware(ENUM_USER_ROLE.ADMIN), CourseController.deleteCourse);

router
  .route('/:id')
  .get(CourseController.getSingleCourse)
  .put(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    validateRequestZod(CourseValidation.updateCourseZodSchema),
    CourseController.updateCourse
  )
  .delete(authMiddleware(ENUM_USER_ROLE.ADMIN), CourseController.deleteCourse);

export const CourseRoute = router;
