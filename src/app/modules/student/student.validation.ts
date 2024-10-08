import { z } from 'zod';
import { bloodGroup, gender } from '../student/student.constant';

const updateStudentZodSchema = z.object({
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

    phoneNumber: z.string().optional(),
    bloodGroup: z.enum([...bloodGroup] as [string, ...string[]]).optional(),

    address: z.string().optional(),
    img: z.string().optional(),
  }),
});

export const StudentValidation = {
  updateStudentZodSchema,
};
