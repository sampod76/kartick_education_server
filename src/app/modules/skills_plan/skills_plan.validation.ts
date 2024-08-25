import { z } from 'zod';
import { STATUS_ARRAY } from '../../../constant/globalConstant';

const createSkills_planZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title field is required' }),
    imgs: z.array(z.string({ required_error: 'image is required' }).url()),
    imgTitle: z.string({ required_error: 'title field is required' }),
    points: z.array(
      z.object({
        title: z.string({ required_error: 'Point title is required' }),
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

const updateSkills_planZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    imgs: z.array(z.string().url().optional()).optional(),
    imgTitle: z.string().optional(),
    page: z.string().optional(),
    points: z.array(
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

export const Skills_planValidation = {
  createSkills_planZodSchema,
  updateSkills_planZodSchema,
};
