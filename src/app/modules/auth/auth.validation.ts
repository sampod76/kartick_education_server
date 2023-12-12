import { z } from 'zod';

const loginZodSchema = z.object({
  body: z.object({
    email: z.string().email().optional(),
    password: z.string().optional(),
    uid: z.string({ required_error: 'UserId is required' }),
    role: z.string({ required_error: 'role is required' }).optional(),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'refreshToken is required',
    }),
  }),
});

export const AuthValidation = {
  loginZodSchema,
  refreshTokenZodSchema,
};
