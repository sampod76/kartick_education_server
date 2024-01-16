import { z } from 'zod';
import { PURCHASE_PACKAGE_TYPES_ARRAY } from './purchase_package.constant';

const createPurchasePackageZodSchema = z.object({
  body: z.object({
    //
    package: z.string(),
    expiry_date: z.string(),
    total_purchase_student: z.number(),
    remaining_purchase_student: z.number(),
    students: z.array(z.string()),
    user:z.string(),
    //
    membership: z.object({
      title: z.string(),
      uid: z.string().optional(),
    }),
    title: z.string(),
    date_range: z.array(z.string()),
    categories: z.array(
      z.object({
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
        label: z.string().optional(),
        biannual: z
          .object({
            price: z.number(),
            each_student_increment: z.number().optional(),
          })
          .optional(),
        monthly: z
          .object({
            price: z.number(),
            each_student_increment: z.number().optional(),
          })
          .optional(),
        yearly: z
          .object({
            price: z.number(),
            each_student_increment: z.number().optional(),
          })
          .optional(),
      })
    ),

    type: z.enum([...PURCHASE_PACKAGE_TYPES_ARRAY] as [string, ...string[]]),
    status: z.enum(['active', 'deactivate', 'save']),
    biannual: z
      .object({
        price: z.number(),
        each_student_increment: z.number().optional(),
      })
      .optional(),
    monthly: z
      .object({
        price: z.number(),
        each_student_increment: z.number().optional(),
      })
      .optional(),
    yearly: z
      .object({
        price: z.number(),
        each_student_increment: z.number().optional(),
      })
      .optional(),
    isDelete: z.enum(['yes', 'no']).optional(),
  }),
});

const updatePurchasePackageZodSchema = z.object({
  body: z.object({
    //
    package: z.string(),
    expiry_date: z.string(),
    total_purchase_student: z.number(),
    remaining_purchase_student: z.number(),
    students: z.array(z.string()),
    //
    membership: z.object({
      title: z.string(),
      uid: z.string().optional(),
    }),
    title: z.string(),
    date_range: z.array(z.string()),
    categories: z.array(
      z.object({
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
        label: z.string().optional(),
        biannual: z
          .object({
            price: z.number(),
            each_student_increment: z.number().optional(),
          })
          .optional(),
        monthly: z
          .object({
            price: z.number(),
            each_student_increment: z.number().optional(),
          })
          .optional(),
        yearly: z
          .object({
            price: z.number(),
            each_student_increment: z.number().optional(),
          })
          .optional(),
      })
    ),

    type: z.enum(['bundle', 'select', 'multiple_select']).optional(),
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
    isDelete: z.enum(['yes', 'no']).optional(),
  }),
});

export const PurchasePackageValidation = {
  createPurchasePackageZodSchema,
  updatePurchasePackageZodSchema,
};
