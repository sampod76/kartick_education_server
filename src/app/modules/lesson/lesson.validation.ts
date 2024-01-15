import { z } from 'zod';
import { STATUS_ARRAY } from '../../../constant/globalConstant';

const createLessonZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title field is required' }),
    imgs: z.array(z.string().url().optional()).optional(),
    videos: z.array(
      z.object({ platform: z.string().optional(), link: z.string().url() })
    ),
    details: z.string().optional(),
    short_description: z.string().optional(),
    author: z.string().optional(),
    //
    course: z.string({ required_error: 'course field is required' }),
    category: z.string({ required_error: 'category field is required' }),
    milestone: z.string({ required_error: 'milestone field is required' }),
    module: z.string({ required_error: 'module field is required' }),
    //
    status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),
    isDelete: z.string().optional(),
    lesson_number: z.number().min(0).optional(),
    lecture: z.number().min(0).optional(),
    demo_video: z.object({}).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const updateLessonZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    imgs: z.array(z.string().url().optional()).optional(),
    details: z.string().optional(),
    short_description: z.string().optional(),
    author: z.string().optional(),
    //
    course: z.string().optional(),
    category: z.string().optional(),
    milestone: z.string().optional(),
    module: z.string().optional(),
    //
    status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),
    lesson_number: z.number().min(0).optional(),
    videos: z
      .array(
        z.object({
          platform: z.string().optional(),
          link: z.string().url().optional(),
        })
      )
      .optional(),
    lecture: z.number().min(0).optional(),
    demo_video: z.object({}).optional(),
    tags: z.array(z.string()).optional(),
    isDelete: z.string().optional(),
  }),
});

export const LessonValidation = {
  createLessonZodSchema,
  updateLessonZodSchema,
};
