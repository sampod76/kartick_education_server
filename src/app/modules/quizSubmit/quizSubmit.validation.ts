import { z } from 'zod';
import { STATUS_ARRAY } from '../../../constant/globalConstant';

const createQuizSubmitZodSchema = z.object({
  body: z.object({
    //
    serial_number: z.number().min(0).optional(),
    author: z.string().optional(),
    course: z.string().optional(),
    category: z.string().optional(),
    milestone: z.string().optional(),
    module: z.string().optional(),
    lesson: z.string().optional(),
    singleAnswer: z.string().optional(),
    //
    status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),
    singleQuiz: z.string({ required_error: 'single required' }),
    submitAnswers: z.array(z.string()),
    // userSubmitQuizzes: z.array(
    //   z.object({
    //     singleQuizId: z.string({ required_error: 'quizid required' }),
    //     submitAnswers: z.array(z.string().optional()),
    //   })
    // ),
  }),
});

const updateQuizSubmitZodSchema = z.object({
  body: z.object({
    //
    author: z.string().optional(),
    course: z.string().optional(),
    category: z.string().optional(),
    milestone: z.string().optional(),
    module: z.string().optional(),
    lesson: z.string().optional(),

    status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),
  }),
});

export const QuizSubmitValidation = {
  createQuizSubmitZodSchema,
  updateQuizSubmitZodSchema,
};
