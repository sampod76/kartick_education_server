import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { SingleQuizController } from './single_quiz.constroller';
import { SingleQuizValidation } from './single_quiz.validation';

const router = express.Router();

router
  .route('/')
  .get(SingleQuizController.getAllSingleQuiz)
  .post(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequestZod(SingleQuizValidation.createSingleQuizZodSchema),
    SingleQuizController.createSingleQuiz
  );

router
  .route('/:id')
  .get(SingleQuizController.getSingleSingleQuiz)
  .patch(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequestZod(SingleQuizValidation.updateSingleQuizZodSchema),
    SingleQuizController.updateSingleQuiz
  )
  .delete(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    SingleQuizController.deleteSingleQuiz
  );

export const SingleQuizRoute = router;
