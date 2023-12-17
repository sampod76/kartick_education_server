"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const student_constant_1 = require("../student/student.constant");
const SignUpZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string(),
        student: zod_1.z.object({
            name: zod_1.z.object({
                firstName: zod_1.z.string({
                    required_error: 'First name is required',
                }),
                lastName: zod_1.z.string({
                    required_error: 'Last name is required',
                }),
            }),
            gender: zod_1.z.enum([...student_constant_1.gender], {
                required_error: 'Gender is required',
            }),
            dateOfBirth: zod_1.z.string({
                required_error: 'Date of birth is required',
            }),
            email: zod_1.z
                .string({
                required_error: 'Email is required',
            })
                .email(),
            phoneNumber: zod_1.z.string({
                required_error: 'phoneNumber is required',
            }),
            address: zod_1.z.string(),
            img: zod_1.z.string({ required_error: 'img is required' }),
        }),
    }),
});
const createModeratorZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string().optional(),
        moderator: zod_1.z.object({
            name: zod_1.z
                .object({
                firstName: zod_1.z.string(),
                lastName: zod_1.z.string(),
            })
                .optional(),
            gender: zod_1.z.enum([...student_constant_1.gender]).optional(),
            dateOfBirth: zod_1.z.string().optional(),
            email: zod_1.z.string().email().optional(),
            phoneNumber: zod_1.z.string().optional(),
            address: zod_1.z.string().optional(),
            img: zod_1.z.string().optional(),
        }),
    }),
});
const createAdminZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string().optional(),
        admin: zod_1.z.object({
            name: zod_1.z
                .object({
                firstName: zod_1.z.string(),
                lastName: zod_1.z.string(),
            })
                .optional(),
            gender: zod_1.z.enum([...student_constant_1.gender]).optional(),
            dateOfBirth: zod_1.z.string().optional(),
            email: zod_1.z.string().email().optional(),
            phoneNumber: zod_1.z.string().optional(),
            address: zod_1.z.string().optional(),
            img: zod_1.z.string().optional(),
        }),
    }),
});
exports.UserValidation = {
    SignUpZodSchema,
    createModeratorZodSchema,
    createAdminZodSchema,
};
