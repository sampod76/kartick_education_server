"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MilestoneValidation = void 0;
const zod_1 = require("zod");
const globalConstant_1 = require("../../../constant/globalConstant");
const createMilestoneZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'title field is required' }),
        img: zod_1.z.string().url().optional(),
        course: zod_1.z.string({ required_error: 'course id is required' }),
        details: zod_1.z.string().optional(),
        author: zod_1.z.string().optional(),
        status: zod_1.z.enum([...globalConstant_1.STATUS_ARRAY]).optional(),
        favorite: zod_1.z.enum([...globalConstant_1.YN_ARRAY]).optional(),
        showing_number: zod_1.z.number().min(0).optional(),
        demo_video: zod_1.z.object({}).optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
const updateMilestoneZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        img: zod_1.z.string().url().optional(),
        course: zod_1.z.string().optional(),
        details: zod_1.z.string().optional(),
        author: zod_1.z.string().optional(),
        status: zod_1.z.enum([...globalConstant_1.STATUS_ARRAY]).optional(),
        favorite: zod_1.z.enum([...globalConstant_1.YN_ARRAY]).optional(),
        showing_number: zod_1.z.number().min(0).optional(),
        demo_video: zod_1.z.object({}).optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.MilestoneValidation = {
    createMilestoneZodSchema,
    updateMilestoneZodSchema,
};
