"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const loginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email().optional(),
        password: zod_1.z.string().optional(),
        uid: zod_1.z.string({ required_error: 'UserId is required' }),
        role: zod_1.z.string({ required_error: 'role is required' }).optional(),
    }),
});
const refreshTokenZodSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'refreshToken is required',
        }),
    }),
});
exports.AuthValidation = {
    loginZodSchema,
    refreshTokenZodSchema,
};
