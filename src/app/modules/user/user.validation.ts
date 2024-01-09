import { z } from 'zod';
import { gender } from '../student/student.constant';

const SignUpZodSchema = z.object({
  body: z.object({
    password: z.string(),
    student: z.object({
      name: z.object({
        firstName: z.string({
          required_error: 'First name is required',
        }),
        lastName: z.string({
          required_error: 'Last name is required',
        }),
      }),
      gender: z.enum([...gender] as [string, ...string[]], {
        required_error: 'Gender is required',
      }),
      dateOfBirth: z.string({
        required_error: 'Date of birth is required',
      }),
      email: z
        .string({
          required_error: 'Email is required',
        })
        .email(),
      phoneNumber: z.string({
        required_error: 'phoneNumber is required',
      }),
      address: z.string(),
      img: z.string({ required_error: 'img is required' }),
    }),
  }),
});

const createModeratorZodSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    moderator: z.object({
      name: z
        .object({
          firstName: z.string(),
          lastName: z.string(),
        })
        .optional(),
      gender: z.enum([...gender] as [string, ...string[]]).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email().optional(),
      phoneNumber: z.string().optional(),
      address: z.string().optional(),
      img: z.string().optional(),
    }),
  }),
});

const createAdminZodSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    admin: z.object({
      name: z
        .object({
          firstName: z.string(),
          lastName: z.string(),
        })
        .optional(),
      gender: z.enum([...gender] as [string, ...string[]]).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email().optional(),
      phoneNumber: z.string().optional(),
      address: z.string().optional(),
      user_bio: z.string().optional(),
      img: z.string().optional(),
    }),
  }),
});
const createSellerZodSchema = z.object({
  body: z.object({
    password: z.string().optional(),

    seller: z.object({
      name: z
        .object({
          firstName: z.string(),
          lastName: z.string(),
        })
        .optional(),
      gender: z.enum([...gender] as [string, ...string[]]).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email().optional(),
      phoneNumber: z.string().optional(),
      address: z.string().optional(),
      img: z.string().optional(),
      user_bio: z.string().optional(),
    }),
  }),
});
const createTrainerZodSchema = z.object({
  body: z.object({
    password: z.string().optional(),

    trainer: z.object({
      name: z
        .object({
          firstName: z.string(),
          lastName: z.string(),
        })
        .optional(),
      gender: z.enum([...gender] as [string, ...string[]]).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email().optional(),
      phoneNumber: z.string().optional(),
      address: z.string().optional(),
      img: z.string().optional(),
      user_bio: z.string().optional(),
    }),
  }),
});

export const UserValidation = {
  SignUpZodSchema,
  createModeratorZodSchema,
  createAdminZodSchema,
  createSellerZodSchema,
  createTrainerZodSchema,
};
