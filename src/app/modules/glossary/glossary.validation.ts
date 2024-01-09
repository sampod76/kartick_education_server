import { z } from 'zod';
import { STATUS_ARRAY } from '../../../constant/globalConstant';

const createGlossaryZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    imgs: z.array(z.string().url().optional()).optional(),
    videos: z.array(
      z.object({ platform: z.string().optional(), link: z.string().url() })
    ).optional(),
    details: z.string().optional(),
    short_description: z.string().optional(),
    author: z.string().optional(),
    module: z.string({ required_error: 'module field is required' }),
    status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),

    demo_video: z.object({}).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const updateGlossaryZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    imgs: z.array(z.string().url().optional()).optional(),
    details: z.string().optional(),
    short_description: z.string().optional(),
    author: z.string().optional(),
    module: z.string().optional(),
    status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),

    videos: z
      .array(
        z.object({
          platform: z.string().optional(),
          link: z.string().url().optional(),
        })
      )
      .optional(),

    demo_video: z.object({}).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const GlossaryValidation = {
  createGlossaryZodSchema,
  updateGlossaryZodSchema,
};
