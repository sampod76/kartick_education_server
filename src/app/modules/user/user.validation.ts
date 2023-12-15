import { z } from 'zod';
import { bloodGroup, gender } from '../student/student.constant';

const SignUpZodSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    student: z.object({
      name: z.object({
        firstName: z.string({
          required_error: 'First name is required',
        }),
        lastName: z.string({
          required_error: 'Last name is required',
        }),
        middleName: z.string().optional(),
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
      bloodGroup: z.enum([...bloodGroup] as [string, ...string[]]).optional(),
 
      address: z.string({
        required_error: 'address is required',
      }),
      img: z.string({required_error:"img is required"}),
      courseId: z.string({required_error:"courseId is required"}).optional(),
    }),
  }),
});

const createModeratorZodSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    moderator: z.object({
      name: z.object({
        firstName: z.string({
          required_error: 'First name is required',
        }),
        lastName: z.string({
          required_error: 'Last name is required',
        }),
        middleName: z.string().optional(),
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
      bloodGroup: z.enum([...bloodGroup] as [string, ...string[]]).optional(),
 
      address: z.string({
        required_error: 'address is required',
      }),
      img: z.string({required_error:"img is required"}),
      courseId: z.string({required_error:"courseId is required"}),

    }),
  }),
});

const createAdminZodSchema = z.object({
  body: z.object({
    password: z.string().optional(),

    admin: z.object({
      name: z.object({
        firstName: z.string({
          required_error: 'First name is required',
        }),
        lastName: z.string({
          required_error: 'Last name is required',
        }),
        middleName: z.string().optional(),
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
      bloodGroup: z.enum([...bloodGroup] as [string, ...string[]]).optional(),

      address: z.string({
        required_error: 'address is required',
      }),
      img: z.string({required_error:"img is required"}),
      
      
    }),
  }),
});

export const UserValidation = {
  createUserZodSchema: SignUpZodSchema,
  createFacultyZodSchema: createModeratorZodSchema,
  createAdminZodSchema,
};
