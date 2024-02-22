import { z } from 'zod';

const createContactMailZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'name is required',
    }),
    email: z.string({ required_error: 'email is required' }),
    subject: z.string({ required_error: 'email is required' }),
    message: z.string({ required_error: 'message is required' }),

    user: z.string().optional(),
  }),
});
const updateContactMailZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    subject: z.string().optional(),
    message: z.string().optional(),
    isDelete: z.string().optional(),
    status: z.string().optional(),
  }),
});

export const ContactMailValidation = {
  createContactMailZodSchema,
  updateContactMailZodSchema,
};
