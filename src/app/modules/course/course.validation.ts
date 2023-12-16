import { z } from 'zod';
import { COURSE_STATUS, COURSE_TYPES } from './course.constant';

const createCourseZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title field is required' }),
    img: z.string().optional(),
    details: z.string(),
    author: z.string({ required_error: 'author_id field is required' }),
    category: z.string({
      required_error: 'main_course_category_id field is required',
    }),
    // sub1_course_category_id: z.string({
    //   required_error: 'sub1_course_category_id field is required',
    // }),
    duration: z.string().optional(),
    level: z.string().optional(),
    price_type: z.enum([...COURSE_TYPES] as [string, ...string[]]).optional(),
    status: z.enum([...COURSE_STATUS] as [string, ...string[]]).optional(),
    demo_video: z.object({}).optional(),
  }),
});

const updateCourseZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    img: z.string().optional(),
    details: z.string().optional(),
    author_id: z.string().optional(),
    category: z.string().optional(),
    // sub1_course_category_id: z
    //   .string({
    //     required_error: 'sub1_course_category_id field is required',
    //   })
    //   .optional(),
    duration: z.string().optional(),
    level: z.string().optional(),
    price_type: z.enum([...COURSE_TYPES] as [string, ...string[]]).optional(),
    status: z.enum([...COURSE_STATUS] as [string, ...string[]]).optional(),
    demo_video: z.object({}).optional(),
  }),
});

export const CourseValidation = {
  createCourseZodSchema,
  updateCourseZodSchema,
};
