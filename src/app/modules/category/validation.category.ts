import { z } from 'zod';

const createCategoryZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    thumbnail: z.string().optional(),
    status: z.string().optional(),
    isDelete: z.boolean().optional(),
  }),
});
const updateCategoryZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    thumbnail: z.string().optional(),
    status: z.string().optional(),
    isDelete: z.boolean().optional(),
  }),
});

export const CategoryValidation = {
  createCategoryZodSchema,
  updateCategoryZodSchema,
};
