"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralUserValidation = void 0;
const zod_1 = require("zod");
const constant_GeneralUser_1 = require("./constant.GeneralUser");
const createGeneralUserByFirebaseZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        gender: zod_1.z.enum([...constant_GeneralUser_1.GENDER]).optional(),
        dateOfBirth: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        profileImage: zod_1.z.string().optional(),
        uid: zod_1.z.string({ required_error: 'uid must be provide' }),
        status: zod_1.z.enum(['active', 'deactive']).optional(),
        //notifications token
        fcm_token: zod_1.z.string().optional(),
    }),
});
const updateGeneralUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        gender: zod_1.z.enum([...constant_GeneralUser_1.GENDER]).optional(),
        dateOfBirth: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        profileImage: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'deactive']).optional(),
        fcm_token: zod_1.z.string().optional(),
        learnedToday: zod_1.z
            .object({
            date: zod_1.z.string().optional(),
            time: zod_1.z.number().optional(),
        })
            .optional(),
    }),
});
// const updateCourseOrQuizZodSchema = z.object({
//   body: z.object({
//     purchase_courses: z
//       .array(
//         z
//           .object({
//             total_completed_lessions: z
//               .array(
//                 z
//                   .string()
//                   .refine(val => Types.ObjectId.isValid(val), {
//                     message: 'Invalid Video ID',
//                   })
//                   .optional()
//               )
//               .optional(),
//           })
//           .optional()
//       )
//       .optional(),
//   }),
// });
exports.GeneralUserValidation = {
    updateGeneralUserZodSchema,
    createGeneralUserByFirebaseZodSchema,
};
