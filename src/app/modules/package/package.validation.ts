import { z } from 'zod';
import { PACKAGE_TYPES_ARRAY } from './package.constant';

const createPackageZodSchema = z.object({
  body: z.object({
    membership: z.object({
      title: z.string(),
      uid: z.string().optional(),
    }),
    title: z.string({ required_error: 'package name is required' }),
    img: z.string().optional(),
    categories: z.array(
      z.object({
        category: z.string(),
        label: z.string().optional(),
        //! -------if type is multiple select --------
        biannual: z
          .object({
            price: z.number().optional(),
            each_student_increment: z.number(),
          })
          .optional(),
        monthly: z
          .object({
            price: z.number().optional(),
            each_student_increment: z.number(),
          })
          .optional(),
        yearly: z
          .object({
            price: z.number().optional(),
            each_student_increment: z.number(),
          })
          .optional(),
      })
    ),
    date_range: z.array(z.string()).optional(),
    type: z.enum([...PACKAGE_TYPES_ARRAY] as [string, ...string[]]),
    status: z.enum(['active', 'deactivate', 'save']).optional(),
    biannual: z
      .object({
        price: z.number(),
        each_student_increment: z.number(),
      })
      .optional(),
    monthly: z
      .object({
        price: z.number(),
        each_student_increment: z.number(),
      })
      .optional(),
    yearly: z
      .object({
        price: z.number(),
        each_student_increment: z.number(),
      })
      .optional(),
    isDelete: z.string().optional(),
  }),
});

const updatePackageZodSchema = z.object({
  body: z.object({
    membership: z.object({
      title: z.string().optional(),
      uid: z.string().optional(),
    }),
    title: z.string().optional(),
    img: z.string().optional(),
    categories: z.array(
      z.object({
        category: z.string(),
        label: z.string().optional(),
        // //! -------if type is multiple select --------
        // biannual: z
        //   .object({
        //     price: z.number().optional(),
        //     each_student_increment: z.number(),
        //   })
        //   .optional(),
        // monthly: z
        //   .object({
        //     price: z.number().optional(),
        //     each_student_increment: z.number(),
        //   })
        //   .optional(),
        // yearly: z
        //   .object({
        //     price: z.number().optional(),
        //     each_student_increment: z.number(),
        //   })
        //   .optional(),
      })
    ),
    date_range: z.array(z.string()).optional(),
    type: z.enum([...PACKAGE_TYPES_ARRAY] as [string, ...string[]]).optional(),
    status: z.enum(['active', 'deactivate', 'save']).optional(),
    biannual: z
      .object({
        price: z.number().optional(),
        each_student_increment: z.number().optional(),
      })
      .optional(),
    monthly: z
      .object({
        price: z.number().optional(),
        each_student_increment: z.number().optional(),
      })
      .optional(),
    yearly: z
      .object({
        price: z.number().optional(),
        each_student_increment: z.number().optional(),
      })
      .optional(),
    isDelete: z.string().optional(),
  }),
});
const increaseStudentPackageZodSchema = z.object({
  body: z.object({
    studentId:z.string(),
  }),
});

export const PackageValidation = {
  createPackageZodSchema,
  updatePackageZodSchema,
  increaseStudentPackageZodSchema
};
