"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModeratorValidation = void 0;
const zod_1 = require("zod");
const createModeratorZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'name is required' }),
        dateOfBirth: zod_1.z.string().optional(),
        gender: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        uid: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        emergencyphone: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        designation: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'deactive']).optional(),
        profileImage: zod_1.z.string().optional(),
    }),
});
const updateModeratorZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        dateOfBirth: zod_1.z.string().optional(),
        gender: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        uid: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        emergencyphone: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        designation: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'deactive']).optional(),
        profileImage: zod_1.z.string().optional(),
    }),
});
exports.ModeratorValidation = {
    createModeratorZodSchema,
    updateModeratorZodSchema,
};
