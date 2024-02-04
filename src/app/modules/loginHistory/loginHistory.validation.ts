import { z } from 'zod';

const updateUserLoginHistoryZodSchema = z.object({
  body: z.object({
   
  }),
});

export const UserLoginHistoryValidation = {
  updateUserLoginHistoryZodSchema,
};
