import { z } from 'zod';
import { STATUS_ARRAY } from '../../../constant/globalConstant';

const createModuleZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title field is required' }),
    category: z.string().optional(),
    course: z.string().optional(),
    milestone: z.string({ required_error: 'milestone field is required' }),
    imgs: z.array(z.string().url().optional()).optional(),
    details: z.string().optional(),
    short_description: z.string().optional(),
    author: z.string().optional(),
    status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),
    module_number: z.number().min(0).optional(),
    demo_video: z.object({}).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const updateModuleZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    category: z.string().optional(),
    course: z.string().optional(),
    milestone: z.string().optional(),
    imgs: z.array(z.string().url().optional()).optional(),
    details: z.string().optional(),
    short_description: z.string().optional(),
    author: z.string().optional(),
    status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),
    module_number: z.number().min(0).optional(),
    demo_video: z.object({}).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const moduleValidation = {
  createModuleZodSchema,
  updateModuleZodSchema,
};
