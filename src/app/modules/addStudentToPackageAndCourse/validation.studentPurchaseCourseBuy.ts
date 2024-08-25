import { z } from 'zod';

const createStudentPurchasePackageCategoryCourseZodSchema = z.object({
  body: z.object({
    //
    sellerPackage: z.string().optional(),
    purchaseCourse: z.string().optional(),

    purchaseCategory: z.string().optional(), // when seller by single category then add
    author: z.string().optional(),
    status: z.enum(['active', 'deactivate', 'save']).optional(),
  }),
});

const updateStudentPurchasePackageCategoryCourseZodSchema = z.object({
  body: z.object({
    sellerPackage: z.string().optional(),
    purchaseCourse: z.string().optional(),
    purchaseCategory: z.string().optional(), // when seller by single category then add
    author: z.string().optional(),
    status: z.enum(['active', 'deactivate', 'save']).optional(),
  }),
});

export const StudentPurchasePackageCategoryCourseValidation = {
  createStudentPurchasePackageCategoryCourseZodSchema,
  updateStudentPurchasePackageCategoryCourseZodSchema,
};
