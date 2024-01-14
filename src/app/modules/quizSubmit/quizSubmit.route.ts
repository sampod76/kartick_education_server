import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { QuizSubmitController } from './quizSubmit.constroller';
import { QuizSubmitValidation } from './quizSubmit.validation';

const router = express.Router();

router
  .route('/')
  .get(QuizSubmitController.getAllQuizSubmit)
  .post(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.STUDENT
    ),
    validateRequestZod(QuizSubmitValidation.createQuizSubmitZodSchema),
    QuizSubmitController.createQuizSubmit
  );
router
  .route('/verify')
  .get(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.STUDENT
    )
  );
router
  .route('/:id')
  .get(QuizSubmitController.getSingleQuizSubmit)
  .delete(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    QuizSubmitController.deleteQuizSubmit
  );

export const QuizSubmitRoute = router;