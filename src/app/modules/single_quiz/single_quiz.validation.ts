import { z } from 'zod';
import { STATUS_ARRAY } from '../../../constant/globalConstant';
import { SINGLE_QUIZ_TYPE } from './single_quiz.constant';

const createSingleQuizZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title field is required' }),
    imgs: z.array(z.string().url().optional()).optional(),
    details: z.string().optional(),
    hints: z.string().optional(),
    short_description: z.string().optional(),
    serialNumber: z.number().min(0).optional(),
    time_duration: z.number().min(0).optional(),
    answers: z
      .array(
        z.object({
          title: z.string(),
          serialNumber: z.number().min(0).optional(),
          correct: z.boolean().optional(),
          img: z.string().optional(),
        })
      )
      .optional(),
    author: z.string().optional(),
    single_answer: z.string().optional(),
    quiz: z.string(),
    type: z.enum([...SINGLE_QUIZ_TYPE] as [string, ...string[]]).optional(),
    status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),
    demo_video: z.object({}).optional(),
    tags: z.array(z.string()).optional(),
    //optional
    correctAnswer:z.array(z.string()).optional(),
    
  }),
});

const updateSingleQuizZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    imgs: z.array(z.string().url().optional()).optional(),
    details: z.string().optional(),
    short_description: z.string().optional(),
    hints: z.string().optional(),
    serialNumber: z.number().min(0).optional(),
    time_duration: z.number().min(0).optional(),
    answers: z
      .array(
        z.object({
          title: z.string().optional(),
          serialNumber: z.number().min(0).optional(),
          correct: z.boolean().optional(),
          imgs: z.array(z.string().url().optional()).optional(),
          status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),
        })
      )
      .optional(),
    author: z.string().optional(),
    single_answer: z.string().optional(),
    quiz: z.string().optional(),
    type: z.enum([...SINGLE_QUIZ_TYPE] as [string, ...string[]]).optional(),
    status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),
    demo_video: z.object({}).optional(),
    tags: z.array(z.string()).optional(),
    correctAnswer:z.array(z.string()).optional(),
  }),
});

export const SingleQuizValidation = {
  createSingleQuizZodSchema,
  updateSingleQuizZodSchema,
};
