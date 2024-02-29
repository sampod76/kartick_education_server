import { z } from 'zod';
import { bloodGroup, gender } from '../student/student.constant';

const updateSeller = z.object({
  body: z.object({
    name: z
      .object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        middleName: z.string().optional(),
      })
      .optional(),
    gender: z.enum([...gender] as [string, ...string[]]).optional(),
    dateOfBirth: z.string().optional(),
    details: z.string().optional(),
    // email: z
    //   .string()
    //   .email(),
    phoneNumber: z.string().optional(),
    bloodGroup: z.enum([...bloodGroup] as [string, ...string[]]).optional(),

    address: z.string().optional(),
    img: z.string().url().optional(),
    user_bio: z.string().optional(),
    isDelete: z.string().optional(),
    status: z.string().optional(),
  }),
});

export const SellerValidation = {
  updateSeller,
};
