import { z } from 'zod';

const createPurchaseCourseZodSchema = z.object({
  body: z.object({
    course: z.string({ required_error: 'Course is required' }),
  }),
});

const updatePurchaseCourseZodSchema = z.object({
  body: z.object({
    course: z.string().optional(),
  }),
});

export const PurchaseCourseValidation = {
  createPurchaseCourseZodSchema,
  updatePurchaseCourseZodSchema,
};
