import { z } from 'zod';
import { Module_STATUS } from './module.constant';
const createModuleZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title is Required (zod)' }),
    module_number: z.string({
      required_error: 'module_number is Required (zod)',
    }),
    img: z.string({ required_error: 'img is Required (zod)' }),
    details: z.string({ required_error: 'details is Required (zod)' }),
    milestone_id: z.string({
      required_error: 'milestone_id is Required (zod)',
    }),
    status: z.enum([...Module_STATUS] as [string, ...string[]]),
  }),
});
const updateModuleZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title is Required (zod)' }).optional(),
    module_number: z.string({
      required_error: 'module_number is Required (zod)',
    }).optional(),
    img: z.string({ required_error: 'img is Required (zod)' }).optional(),
    details: z.string({ required_error: 'details is Required (zod)' }).optional(),
    milestone_id: z.string({
      required_error: 'milestone_id is Required (zod)',
    }).optional(),
    status: z.enum([...Module_STATUS] as [string, ...string[]]).optional(),
  }),
});

export const ModuleValidation = {
  createModuleZodSchema,
  updateModuleZodSchema,
};
