import { z } from 'zod';
import { STATUS_ARRAY } from '../../../constant/globalConstant';

const createShow_advance_classesZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title field is required' }),
    buttonLink: z.string().url().optional(),
    classes: z.array(
      z.object({
        title: z.string({ required_error: 'Class title is required' }),
        img: z.string({ required_error: 'Class image is required' }),
        short_description: z.string({
          required_error: 'Class short description is required',
        }),
        course: z.string().optional(),
        buttonLink: z.string().url().optional(),
      }),
    ),
    page: z.string({ required_error: 'Page field is required' }),
    //
    details: z.string().optional(),
    short_description: z.string().optional(),
    author: z.string().optional(),
    status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),
    demo_video: z.object({}).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const updateShow_advance_classesZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    buttonLink: z.string().url().optional(),
    classes: z.array(
      z.object({
        title: z.string().optional(),
        img: z.string().optional(),
        course: z.string().optional(),
        short_description: z.string().optional(),
        buttonLink: z.string().url().optional(),
      }),
    ),
    page: z.string().optional(),
    //
    details: z.string().optional(),
    short_description: z.string().optional(),
    author: z.string().optional(),
    status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),
    demo_video: z.object({}).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const Show_advance_classesValidation = {
  createShow_advance_classesZodSchema,
  updateShow_advance_classesZodSchema,
};
