"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationValidation = void 0;
const zod_1 = require("zod");
const createNotificationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({
            required_error: 'Title is required',
        })
            .max(200),
        body: zod_1.z
            .string({
            required_error: 'Message is required',
        })
            .max(1000),
        subTitle: zod_1.z.string().max(200).optional(),
        icon: zod_1.z.string().max(200).optional(),
        thumbnail: zod_1.z.string().max(200).optional(),
        status: zod_1.z.string().max(200).optional(),
        users: zod_1.z.array(zod_1.z.string().max(200).optional()),
    }),
});
const updateNotificationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        thumbnail: zod_1.z.string().optional(),
        status: zod_1.z.string().optional(),
    }),
});
exports.NotificationValidation = {
    createNotificationZodSchema,
    updateNotificationZodSchema,
};
