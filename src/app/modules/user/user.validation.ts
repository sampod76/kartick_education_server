import { z } from 'zod';
import { userAccountStatus } from './user.constant';

const createUserZodSchema = z.object({
  body: z.object({
    userId: z
      .string({
        required_error: 'User ID is required',
      })
      .optional(),
    fullName: z.object({
      firstName: z.string({
        required_error: 'First Name is required',
      }),
      middleName: z.string().optional(),
      lastName: z.string({
        required_error: 'Last Name is required',
      }),
    }),
    email: z.string({
      required_error: 'Email is required',
    }),
    role: z.string({
      required_error: 'Role is required',
    }),
    password: z
      .string({
        required_error: 'Password is required.',
      })
      .optional(),
    dateOfBirth: z.string({
      required_error: 'Date of Birth is required',
    }),
    gender: z.string({
      required_error: 'Gender is required',
    }),
    phoneNumber: z.string({
      required_error: 'Phone Number is required',
    }),
    profileImage: z.string({
      required_error: 'Profile Image is required',
    }),
    address: z.string({
      required_error: 'Address is required',
    }),
    locationLink: z.string({
      required_error: 'Location Link is required',
    }),
    status: z.enum([...userAccountStatus] as [string, ...string[]]),
    isDelete: z.enum(['yes', 'no']),
  }),
});

const updateUserZodSchema = z.object({
  body: z.object({
    userId: z.string().optional(),
    fullName: z
      .object({
        firstName: z.string().optional(),
        middleName: z.string().optional(),
        lastName: z.string().optional(),
      })
      .optional(),
    email: z.string().optional(),
    role: z.string().optional(),
    password: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    phoneNumber: z.string().optional(),
    profileImage: z.string().optional(),
    address: z.string().optional(),
    locationLink: z.string().optional(),
    status: z.enum([...userAccountStatus] as [string, ...string[]]).optional(),
    isDelete: z.enum(['yes', 'no']).optional(),
  }),
});

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
};
