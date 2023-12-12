"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const constant_GeneralUser_1 = require("../generalUser/constant.GeneralUser");
const createGeneralUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }),
        // password: z.string({ required_error: 'Password is required' }),
        gender: zod_1.z.enum([...constant_GeneralUser_1.GENDER]).optional(),
        dateOfBirth: zod_1.z.string().optional(),
        email: zod_1.z
            .string({
            required_error: 'Email is required',
        })
            .email(),
        phone: zod_1.z.string({
            required_error: 'Contact number is required',
        }),
        address: zod_1.z.string().optional(),
        profileImage: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'deactive']).optional(),
        otherInfo: zod_1.z
            .object({ uid: zod_1.z.string().optional(), photoURL: zod_1.z.string().optional() })
            .optional(),
    }),
});
const createModeratorZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        // password: z.string().optional(),
        name: zod_1.z.string({ required_error: 'Name is required' }),
        gender: zod_1.z.enum([...constant_GeneralUser_1.GENDER]).optional(),
        dateOfBirth: zod_1.z.string().optional(),
        email: zod_1.z
            .string({
            required_error: 'Email is required',
        })
            .email(),
        phone: zod_1.z.string({
            required_error: 'Contact number is required',
        }),
        address: zod_1.z.string().optional(),
        emergencyphone: zod_1.z.string().optional(),
        designation: zod_1.z.string().optional(),
        profileImage: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'deactive']).optional(),
        otherInfo: zod_1.z
            .object({ uid: zod_1.z.string().optional(), photoURL: zod_1.z.string().optional() })
            .optional(),
    }),
});
const createAdminZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        // password: z.string().optional(),
        name: zod_1.z.string({ required_error: 'Name is required' }),
        gender: zod_1.z.enum([...constant_GeneralUser_1.GENDER]).optional(),
        dateOfBirth: zod_1.z.string().optional(),
        email: zod_1.z
            .string({
            required_error: 'Email is required',
        })
            .email(),
        phone: zod_1.z.string({
            required_error: 'Contact number is required',
        }),
        address: zod_1.z.string().optional(),
        emergencyphone: zod_1.z.string().optional(),
        designation: zod_1.z.string().optional(),
        profileImage: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'deactive']).optional(),
        otherInfo: zod_1.z
            .object({ uid: zod_1.z.string().optional(), photoURL: zod_1.z.string().optional() })
            .optional(),
    }),
});
exports.UserValidation = {
    createGeneralUserZodSchema,
    createModeratorZodSchema,
    createAdminZodSchema,
};
