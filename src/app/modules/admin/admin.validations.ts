import { z } from 'zod';

const createAdminZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'name is required' }),
    uid: z.string({ required_error: 'uid is required' }),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    email: z.string({ required_error: 'email is required' }).email(),
    phone: z.string().optional(),
    emergencyphone: z.string().optional(),
    address: z.string().optional(),
    designation: z.string().optional(),
    status: z.string().optional(),
  }),
});
const updateAdminZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    emergencyphone: z.string().optional(),
    address: z.string().optional(),
    designation: z.string().optional(),
    status: z.string().optional(),
  }),
});

export const AdminValidation = {
  createAdminZodSchema,
  updateAdminZodSchema,
};
