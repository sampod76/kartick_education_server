import { z } from 'zod';
import { STATUS_ARRAY, YN_ARRAY } from '../../../constant/globalConstant';
import { COURSE_TYPES } from './course.constant';

const createCourseZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title field is required' }),
    img: z.string().optional(),
    details: z.string().optional(),
    author: z.string({ required_error: 'author_id field is required' }),
    category: z.string({
      required_error: 'main_course_category_id field is required',
    }),
    // sub1_course_category_id: z.string({
    //   required_error: 'sub1_course_category_id field is required',
    // }),
    duration: z.array(z.string()).optional(),
    level: z.string().optional(),
    price_type: z.enum([...COURSE_TYPES] as [string, ...string[]]).optional(),
    status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),
    favorite: z.enum([...YN_ARRAY] as [string, ...string[]]).optional(),
    showing_number: z.number().min(0).optional(),
    price: z.number().min(0).optional(),
    demo_video: z.object({}).optional(),
    tags: z.array(z.string()).optional(),
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
    duration: z.array(z.string()).optional(),
    level: z.string().optional(),
    price_type: z.enum([...COURSE_TYPES] as [string, ...string[]]).optional(),
    status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),
    price: z.number().min(0).optional(),
    favorite: z.enum([...YN_ARRAY] as [string, ...string[]]).optional(),
    showing_number: z.number().min(0).optional(),
    demo_video: z.object({}).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const CourseValidation = {
  createCourseZodSchema,
  updateCourseZodSchema,
};
