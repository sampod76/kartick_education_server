import { z } from 'zod';

const createStudentPurchasePackageCourseZodSchema = z.object({
  body: z.object({
    //
    sellerPackage: z.string().optional(),
    course: z.string().optional(),
    author: z.string().optional(),
    status: z.enum(['active', 'deactivate', 'save']).optional(),
  }),
});

const updateStudentPurchasePackageCourseZodSchema = z.object({
  body: z.object({
    sellerPackage: z.string().optional(),
    course: z.string().optional(),
    author: z.string().optional(),
    status: z.enum(['active', 'deactivate', 'save']).optional(),
  }),
});

export const StudentPurchasePackageCourseValidation = {
  createStudentPurchasePackageCourseZodSchema,
  updateStudentPurchasePackageCourseZodSchema,
};
