import { z } from 'zod';
import { STATUS_ARRAY } from '../../../constant/globalConstant';

const createQuizZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title field is required' }),
    img: z.string().url().optional(),
    details: z.string().optional(),
    passingGrade: z.number().min(0).max(100).optional(),
    minus_skip: z.boolean().optional(),

    //
    author: z.string().optional(),
    lesson: z.string().optional(),
    module: z.string({ required_error: 'module field is required' }),
    status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),
    demo_video: z.object({}).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const updateQuizZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    img: z.string().url().optional(),
    details: z.string().optional(),
    passingGrade: z.number().min(0).max(100).optional(),
    minus_skip: z.boolean().optional(),

    //
    author: z.string().optional(),
    lesson: z.string().optional(),
    module: z.string().optional(),
    status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),
    demo_video: z.object({}).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const QuizValidation = {
  createQuizZodSchema,
  updateQuizZodSchema,
};
