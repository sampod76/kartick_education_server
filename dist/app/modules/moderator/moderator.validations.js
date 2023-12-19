"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModeratorValidation = void 0;
const zod_1 = require("zod");
const student_constant_1 = require("../student/student.constant");
const updateModeratorZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.object({
            firstName: zod_1.z.string({
                required_error: 'First name is required',
            }).optional(),
            lastName: zod_1.z.string({
                required_error: 'Last name is required',
            }).optional(),
            middleName: zod_1.z.string().optional(),
        }).optional(),
        gender: zod_1.z.enum([...student_constant_1.gender], {
            required_error: 'Gender is required',
        }).optional(),
        dateOfBirth: zod_1.z.string({
            required_error: 'Date of birth is required',
        }).optional(),
        email: zod_1.z
            .string({
            required_error: 'Email is required',
        })
            .email(),
        phoneNumber: zod_1.z.string({
            required_error: 'phoneNumber is required',
        }).optional(),
        bloodGroup: zod_1.z.enum([...student_constant_1.bloodGroup]).optional(),
        address: zod_1.z.string({
            required_error: 'address is required',
        }).optional(),
        img: zod_1.z.string({ required_error: "img is required" }).optional(),
        courseId: zod_1.z.string({ required_error: "courseId is required" }).optional(),
    }),
});
exports.ModeratorValidation = {
    updateModeratorZodSchema,
};
