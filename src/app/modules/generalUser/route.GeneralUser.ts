import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { GeneralUserController } from './controller.GeneralUser';
import { GeneralUserValidation } from './validation.GeneralUser';

const router = express.Router();
router
  .route('/')
  .get(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    GeneralUserController.getAllGeneralUsers
  )
  // sign up user
  .post(
    validateRequestZod(
      GeneralUserValidation.createGeneralUserByFirebaseZodSchema
    ),
    GeneralUserController.createGeneralUserByFirebase
  );
// general user create by admin
router
  .route('/create-general-user-by-admin')
  .post(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    GeneralUserController.createGeneralUserByAdmin
  );

router
  .route('/get-course/:id')
  .get(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    GeneralUserController.getSingleGeneralUserToCourse
  );

router
  .route('/update-course-quiz/:id')
  .put(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    GeneralUserController.updateCourseVedioOrQuiz
  );

router
  .route('/:id')
  .get(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    GeneralUserController.getSingleGeneralUser
  )
  .delete(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    GeneralUserController.deleteGeneralUser
  )
  .put(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    validateRequestZod(GeneralUserValidation.updateGeneralUserZodSchema),
    GeneralUserController.updateGeneralUser
  );

export const GeneralUserRoutes = router;
