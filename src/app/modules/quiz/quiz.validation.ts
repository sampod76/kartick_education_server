import { z } from 'zod';
import { STATUS_ARRAY } from '../../../constant/globalConstant';

const createQuizZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title field is required' }),
    imgs: z.array(z.string().url().optional()).optional(),
    details: z.string().optional(),
    short_description: z.string().optional(),
    passingGrade: z.number().min(0).max(100).optional(),
    minus_skip: z.boolean().optional(),

    //
    serial_number: z.number().min(0).optional(),
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
    imgs: z.array(z.string().url().optional()).optional(),
    short_description: z.string().optional(),
    details: z.string().optional(),
    passingGrade: z.number().min(0).max(100).optional(),
    minus_skip: z.boolean().optional(),

    //
    serial_number: z.number().min(0).optional(),
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
