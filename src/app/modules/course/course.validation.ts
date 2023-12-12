import { z } from 'zod';
import { COURSE_TYPES } from './course.consent';

const createCourseZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title field is required' }),
    price: z.number().nonnegative().optional(),
    type: z.enum([...COURSE_TYPES] as [string, ...string[]]),
    category: z.string().optional(),
    // discount: z.number().nonnegative().max(100).optional(),
    discount: z
      .object({
        value: z.number().nonnegative().max(100).optional(),
        startDate: z.string(),
        expiryDate: z.string().optional(),
      })
      .optional(),
    vat: z.number().nonnegative().optional(),

    categoryDetails: z.object({
      category: z.string().optional(),
      title: z.string().optional(),
    }),
    header_1: z.string().optional(),
    header_2: z.string().optional(),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    status: z.enum(['active', 'deactive', 'save']).optional(),
    // course_mode: z.enum(['pre_recorded', 'jobs', 'events']).optional(),
    course_mode: z.string().optional(),
    publish: z.object({ date: z.string().optional() }).optional(), // Assuming publish is a string representing the ID of a related document
    publisher: z.string({ required_error: 'publisher field is required' }), // Assuming publisher is a string representing the ID of a related document
    publisherName: z.string({
      required_error: 'publisher Name field is required',
    }),
    tag: z.array(z.string().optional()).optional(),
    reviews: z
      .array(
        z.object({
          userId: z.string(), // Assuming user ID is a string of length 24
          star: z.number(),
          message: z.string().optional().nullable(),
        })
      )
      .optional()
      .nullable(),
  }),
});

const updateCourseZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    price: z.number().optional(),
    type: z.enum([...COURSE_TYPES] as [string, ...string[]]).optional(),
    categoryDetails: z
      .object({
        category: z.string().optional(),
        title: z.string().optional(),
      })
      .optional(),
    header_1: z.string().optional(),
    header_2: z.string().optional(),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    status: z.enum(['active', 'deactive', 'save']).optional(),
    // course_mode: z.enum(['pre_recorded', 'jobs', 'events']).optional(),
    course_mode: z.string().optional(),
    publish: z
      .object({ status: z.boolean().optional(), time: z.string().optional() })
      .optional(), // Assuming publish is a string representing the ID of a related document
    publisher: z.string().optional(), // Assuming publisher is a string representing the ID of a related document
    publisherName: z.string().optional(),
    tag: z.array(z.string().optional()).optional(),
  }),
});

const courseReviewZodSchema = z.object({
  body: z.object({
    reviews: z
      .object({
        star: z.number(),
        message: z.string().optional().nullable(),
      })
      .optional()
      .nullable(),
  }),
});
export const CourseValidation = {
  createCourseZodSchema,
  courseReviewZodSchema,
  updateCourseZodSchema,
};
