import { z } from 'zod';
import { STATUS_ARRAY, YN_ARRAY } from '../../../constant/globalConstant';

const createMilestoneZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title field is required' }),
    img: z.string().url().optional(),
    course: z.string({ required_error: 'course id is required' }),
    details: z.string().optional(),
    author: z.string().optional(),
    status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),
    favorite: z.enum([...YN_ARRAY] as [string, ...string[]]).optional(),
    milestone_number: z
      .number({ required_error: 'mileston number is required' })
      .min(0),
    demo_video: z.object({}).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const updateMilestoneZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    img: z.string().url().optional(),
    course: z.string().optional(),
    details: z.string().optional(),
    author: z.string().optional(),
    status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),
    favorite: z.enum([...YN_ARRAY] as [string, ...string[]]).optional(),
    milestone_number: z.number().min(0).optional(),
    demo_video: z.object({}).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const MilestoneValidation = {
  createMilestoneZodSchema,
  updateMilestoneZodSchema,
};
