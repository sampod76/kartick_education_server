import { z } from 'zod';
import { Milestone_STATUS } from './milestone.constant';
const createMilestoneZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title is Required (zod)' }),
    img: z.string({ required_error: 'img is Required (zod)' }),
    details: z.string({ required_error: 'details is Required (zod)' }),
    course_id: z.string({ required_error: 'course_id is Required (zod)' }),
    status: z.enum([...Milestone_STATUS] as [string, ...string[]]),
  }),
});
const updateMilestoneZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title is Required (zod)' }).optional(),
    img: z.string({ required_error: 'img is Required (zod)' }).optional(),
    details: z
      .string({ required_error: 'details is Required (zod)' })
      .optional(),
    course_id: z
      .string({ required_error: 'course_id is Required (zod)' })
      .optional(),
    status: z.enum([...Milestone_STATUS] as [string, ...string[]]).optional(),
  }),
});

export const MilestoneValidation = { createMilestoneZodSchema, updateMilestoneZodSchema };
