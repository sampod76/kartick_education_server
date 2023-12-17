import { z } from 'zod';
import { STATUS_ARRAY } from '../../../constant/globalConstant';

const createModuleZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title field is required' }),
    milestone: z.string({ required_error: 'milestone field is required' }),
    img: z.string().url().optional(),
    details: z.string().optional(),
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
    milestone: z.string().optional(),
    img: z.string().url().optional(),
    course: z.string().optional(),
    details: z.string().optional(),
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
