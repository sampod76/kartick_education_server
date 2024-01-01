import { z } from 'zod';
import { STATUS_ARRAY } from '../../../constant/globalConstant';

const createLessonZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title field is required' }),
    img: z.string().url().optional(),
    video: z.string().optional(),
    details: z.string().optional(),
    short_description: z.string().optional(),
    author: z.string().optional(),
    module: z.string({ required_error: 'module field is required' }),
    status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),
    lesson_number: z.number().min(0).optional(),
    lecture: z.number().min(0).optional(),
    demo_video: z.object({}).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const updateLessonZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    img: z.string().url().optional(),
    video: z.string().optional(),
    details: z.string().optional(),
    short_description: z.string().optional(),
    author: z.string().optional(),
    module: z.string().optional(),
    status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),
    lesson_number: z.number().min(0).optional(),
    lecture: z.number().min(0).optional(),
    demo_video: z.object({}).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const LessonValidation = {
  createLessonZodSchema,
  updateLessonZodSchema,
};
