import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { QuizController } from './quiz.constroller';
import { QuizValidation } from './quiz.validation';

const router = express.Router();

router
  .route('/')
  .get(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.STUDENT,
      ENUM_USER_ROLE.SELLER,
    ),
    QuizController.getAllQuiz,
  )
  .post(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequestZod(QuizValidation.createQuizZodSchema),
    QuizController.createQuiz,
  );

router
  .route('/:id')
  .get(
    authMiddleware(
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.STUDENT,
      ENUM_USER_ROLE.SELLER,
    ),
    QuizController.getSingleQuiz,
  )
  .patch(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequestZod(QuizValidation.updateQuizZodSchema),
    QuizController.updateQuiz,
  )
  .delete(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    QuizController.deleteQuiz,
  );

export const QuizRoute = router;
