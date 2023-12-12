import express from 'express';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { QuizController } from './quiz.constroller';
import { QuizValidation } from './quiz.validation';

const router = express.Router();

router
  .route('/')
  .get(QuizController.getAllQuiz)
  .post(
    validateRequestZod(QuizValidation.createQuizZodSchema),
    QuizController.createQuiz
  );

router
  .route('/:id')
  .get(QuizController.getSingleQuiz)
  .put(
    validateRequestZod(QuizValidation.updateQuizZodSchema),
    QuizController.updateQuiz
  )
  .delete(QuizController.deleteQuiz);

export const QuizRoute = router;
