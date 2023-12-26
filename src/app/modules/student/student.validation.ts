import { z } from 'zod';
import { bloodGroup, gender } from '../student/student.constant';

const updateStudentZodSchema = z.object({
  body: z.object({
    name: z.object({
      firstName: z.string({
        required_error: 'First name is required',
      }).optional(),
      lastName: z.string({
        required_error: 'Last name is required',
      }).optional(),
      middleName: z.string().optional(),
    }).optional(),
    gender: z.enum([...gender] as [string, ...string[]], {
      required_error: 'Gender is required',
    }).optional(),
    dateOfBirth: z.string({
      required_error: 'Date of birth is required',
    }).optional(),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email(),
      phoneNumber: z.string({
      required_error: 'phoneNumber is required',
    }).optional(),   
    bloodGroup: z.enum([...bloodGroup] as [string, ...string[]]).optional(),

    address: z.string({
      required_error: 'address is required',
    }).optional(),
    img: z.string({required_error:"img is required"}).optional(),
  }),
});

export const StudentValidation = {
  updateStudentZodSchema,
};
