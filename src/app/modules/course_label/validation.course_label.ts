import { z } from 'zod';

const createCourse_labelZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    thumbnail: z.string().optional(),
    status: z.string().optional(),
    serial_number: z.number().optional(),
    isDelete: z.string().optional(),
  }),
});
const updateCourse_labelZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    thumbnail: z.string().optional(),
    status: z.string().optional(),
    serial_number: z.number().optional(),
    isDelete: z.string().optional(),
  }),
});

export const Course_labelValidation = {
  createCourse_labelZodSchema,
  updateCourse_labelZodSchema,
};
