import { z } from 'zod';
import { STATUS_ARRAY } from '../../../constant/globalConstant';

const createShort_overviewZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title field is required' }),

    cards: z.array(
      z.object({
        title: z.string({ required_error: 'Point title is required' }),
        countNumber: z.string().optional(),
        short_description: z.string().optional(),
      }),
    ),
    page: z.string({ required_error: 'Page field is required' }).optional(),
    //
    details: z.string().optional(),
    short_description: z.string().optional(),
    //
    author: z.string().optional(),
    status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),
    demo_video: z.object({}).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const updateShort_overviewZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    imgs: z.array(z.string().url().optional()).optional(),
    imgTitle: z.string().optional(),
    page: z.string().optional(),
    cards: z.array(
      z.object({
        title: z.string().optional(),
      }),
    ),
    //
    details: z.string().optional(),
    short_description: z.string().optional(),
    author: z.string().optional(),
    status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),
    demo_video: z.object({}).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const Short_overviewValidation = {
  createShort_overviewZodSchema,
  updateShort_overviewZodSchema,
};
