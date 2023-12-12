"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessionValidation = void 0;
const zod_1 = require("zod");
const createLessionZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, { message: 'Title is required' }).trim(),
        vedio: zod_1.z.object({ link: zod_1.z.string(), player_no: zod_1.z.number() }),
        serial_no: zod_1.z.number().optional(),
        duration: zod_1.z.number().optional(),
        course: zod_1.z.string({ required_error: 'course id is required' }),
        courseId: zod_1.z.string({ required_error: 'courseId is required' }),
        //
        //
        courseTitle: zod_1.z.string().optional(),
        header_1: zod_1.z.string().optional(),
        header_2: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        thumbnail: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'deactive', 'save']).optional(),
        tag: zod_1.z.array(zod_1.z.string().optional()).optional(),
    }),
});
const updateLessionZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        courseTitle: zod_1.z.string().optional(),
        header_1: zod_1.z.string().optional(),
        header_2: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        thumbnail: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'deactive', 'save']).optional(),
        course: zod_1.z.string().optional(),
        courseId: zod_1.z.string(),
        tag: zod_1.z.array(zod_1.z.string().optional()).optional(),
        vedio: zod_1.z
            .object({ link: zod_1.z.string().optional(), player_no: zod_1.z.number().optional() })
            .optional(),
        serial_no: zod_1.z.number().optional(),
        duration: zod_1.z.number().optional(),
    }),
});
exports.LessionValidation = {
    createLessionZodSchema,
    updateLessionZodSchema,
};
