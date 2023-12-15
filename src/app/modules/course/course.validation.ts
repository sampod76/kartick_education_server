import { z } from 'zod';
import { COURSE_STATUS, COURSE_TYPES } from './course.constant';

const createCourseZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title field is required' }),
    img: z.string({ required_error: 'img field is required' }),
    details: z.string({ required_error: 'details field is required' }),
    author_id: z.string({ required_error: 'author_id field is required' }),
    main_course_category_id: z.string({
      required_error: 'main_course_category_id field is required',
    }),
    sub1_course_category_id: z.string({
      required_error: 'sub1_course_category_id field is required',
    }),
    duration: z.string({ required_error: 'duration field is required' }),
    level: z.string({ required_error: 'level field is required' }),
    price_type: z.enum([...COURSE_TYPES] as [string, ...string[]]),
    status: z.enum([...COURSE_STATUS] as [string, ...string[]]),
    demo_video_id: z.string({
      required_error: 'demo_video_id field is required',
    }),
  }),
});

const updateCourseZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title field is required' }).optional(),
    img: z.string({ required_error: 'img field is required' }).optional(),
    details: z
      .string({ required_error: 'details field is required' })
      .optional(),
    author_id: z
      .string({ required_error: 'author_id field is required' })
      .optional(),
    main_course_category_id: z
      .string({
        required_error: 'main_course_category_id field is required',
      })
      .optional(),
    sub1_course_category_id: z
      .string({
        required_error: 'sub1_course_category_id field is required',
      })
      .optional(),
    duration: z
      .string({ required_error: 'duration field is required' })
      .optional(),
    level: z.string({ required_error: 'level field is required' }).optional(),
    price_type: z.enum([...COURSE_TYPES] as [string, ...string[]]).optional(),
    status: z.enum([...COURSE_STATUS] as [string, ...string[]]).optional(),
    demo_video_id: z
      .string({
        required_error: 'damo_vedio_id field is required',
      })
      .optional(),
  }),
});

export const CourseValidation = {
  createCourseZodSchema,

  updateCourseZodSchema,
};
