import { z } from 'zod';

const createPurchase_categoryZodSchema = z.object({
  body: z.object({
    category: z.string({ required_error: 'category is required' }),
  }),
});

const updatePurchase_categoryZodSchema = z.object({
  body: z.object({
    category: z.string().optional(),
  }),
});

export const Purchase_categoryValidation = {
  createPurchase_categoryZodSchema,
  updatePurchase_categoryZodSchema,
};
