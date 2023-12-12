import { z } from 'zod';
import { GENDER } from '../generalUser/constant.GeneralUser';

const createGeneralUserZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    // password: z.string({ required_error: 'Password is required' }),
    gender: z.enum([...GENDER] as [string, ...string[]]).optional(),
    dateOfBirth: z.string().optional(),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email(),
    phone: z.string({
      required_error: 'Contact number is required',
    }),
    address: z.string().optional(),
    profileImage: z.string().optional(),
    status: z.enum(['active', 'deactive']).optional(),
    otherInfo: z
      .object({ uid: z.string().optional(), photoURL: z.string().optional() })
      .optional(),
  }),
});

const createModeratorZodSchema = z.object({
  body: z.object({
    // password: z.string().optional(),
    name: z.string({ required_error: 'Name is required' }),
    gender: z.enum([...GENDER] as [string, ...string[]]).optional(),
    dateOfBirth: z.string().optional(),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email(),
    phone: z.string({
      required_error: 'Contact number is required',
    }),
    address: z.string().optional(),
    emergencyphone: z.string().optional(),
    designation: z.string().optional(),
    profileImage: z.string().optional(),
    status: z.enum(['active', 'deactive']).optional(),
    otherInfo: z
      .object({ uid: z.string().optional(), photoURL: z.string().optional() })
      .optional(),
  }),
});

const createAdminZodSchema = z.object({
  body: z.object({
    // password: z.string().optional(),
    name: z.string({ required_error: 'Name is required' }),
    gender: z.enum([...GENDER] as [string, ...string[]]).optional(),
    dateOfBirth: z.string().optional(),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email(),
    phone: z.string({
      required_error: 'Contact number is required',
    }),
    address: z.string().optional(),
    emergencyphone: z.string().optional(),
    designation: z.string().optional(),
    profileImage: z.string().optional(),
    status: z.enum(['active', 'deactive']).optional(),
    otherInfo: z
      .object({ uid: z.string().optional(), photoURL: z.string().optional() })
      .optional(),
  }),
});

export const UserValidation = {
  createGeneralUserZodSchema,
  createModeratorZodSchema,
  createAdminZodSchema,
};
