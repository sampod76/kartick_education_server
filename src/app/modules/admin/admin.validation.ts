import { z } from 'zod';
import { bloodGroup, gender } from '../student/student.constant';

const updateAdmin = z.object({
  body: z.object({
    name: z
      .object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      })
      .optional(),
    gender: z.enum([...gender] as [string, ...string[]]).optional(),
    dateOfBirth: z.string().optional(),
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),
    bloodGroup: z.enum([...bloodGroup] as [string, ...string[]]).optional(),

    address: z.string().optional(),
    isDelete: z.string().optional(),
    additionalRole: z.string().optional(),

    img: z.string().url().optional(),
  }),
});

export const AdminValidation = {
  updateAdmin,
};
