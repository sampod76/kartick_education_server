import { z } from 'zod';

const createModeratorZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'name is required' }),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    email: z.string().email().optional(),
    uid: z.string().optional(),
    phone: z.string().optional(),
    emergencyphone: z.string().optional(),
    address: z.string().optional(),
    designation: z.string().optional(),
    status: z.enum(['active', 'deactive']).optional(),
    profileImage: z.string().optional(),
  }),
});
const updateModeratorZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    email: z.string().email().optional(),
    uid: z.string().optional(),
    phone: z.string().optional(),
    emergencyphone: z.string().optional(),
    address: z.string().optional(),
    designation: z.string().optional(),
    status: z.enum(['active', 'deactive']).optional(),
    profileImage: z.string().optional(),
  }),
});

export const ModeratorValidation = {
  createModeratorZodSchema,
  updateModeratorZodSchema,
};
