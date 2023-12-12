"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseValidation = void 0;
const zod_1 = require("zod");
const course_consent_1 = require("./course.consent");
const createCourseZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'title field is required' }),
        price: zod_1.z.number().nonnegative().optional(),
        type: zod_1.z.enum([...course_consent_1.COURSE_TYPES]),
        category: zod_1.z.string().optional(),
        // discount: z.number().nonnegative().max(100).optional(),
        discount: zod_1.z
            .object({
            value: zod_1.z.number().nonnegative().max(100).optional(),
            startDate: zod_1.z.string(),
            expiryDate: zod_1.z.string().optional(),
        })
            .optional(),
        vat: zod_1.z.number().nonnegative().optional(),
        categoryDetails: zod_1.z.object({
            category: zod_1.z.string().optional(),
            title: zod_1.z.string().optional(),
        }),
        header_1: zod_1.z.string().optional(),
        header_2: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        thumbnail: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'deactive', 'save']).optional(),
        // course_mode: z.enum(['pre_recorded', 'jobs', 'events']).optional(),
        course_mode: zod_1.z.string().optional(),
        publish: zod_1.z.object({ date: zod_1.z.string().optional() }).optional(),
        publisher: zod_1.z.string({ required_error: 'publisher field is required' }),
        publisherName: zod_1.z.string({
            required_error: 'publisher Name field is required',
        }),
        tag: zod_1.z.array(zod_1.z.string().optional()).optional(),
        reviews: zod_1.z
            .array(zod_1.z.object({
            userId: zod_1.z.string(),
            star: zod_1.z.number(),
            message: zod_1.z.string().optional().nullable(),
        }))
            .optional()
            .nullable(),
    }),
});
const updateCourseZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        price: zod_1.z.number().optional(),
        type: zod_1.z.enum([...course_consent_1.COURSE_TYPES]).optional(),
        categoryDetails: zod_1.z
            .object({
            category: zod_1.z.string().optional(),
            title: zod_1.z.string().optional(),
        })
            .optional(),
        header_1: zod_1.z.string().optional(),
        header_2: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        thumbnail: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'deactive', 'save']).optional(),
        // course_mode: z.enum(['pre_recorded', 'jobs', 'events']).optional(),
        course_mode: zod_1.z.string().optional(),
        publish: zod_1.z
            .object({ status: zod_1.z.boolean().optional(), time: zod_1.z.string().optional() })
            .optional(),
        publisher: zod_1.z.string().optional(),
        publisherName: zod_1.z.string().optional(),
        tag: zod_1.z.array(zod_1.z.string().optional()).optional(),
    }),
});
const courseReviewZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        reviews: zod_1.z
            .object({
            star: zod_1.z.number(),
            message: zod_1.z.string().optional().nullable(),
        })
            .optional()
            .nullable(),
    }),
});
exports.CourseValidation = {
    createCourseZodSchema,
    courseReviewZodSchema,
    updateCourseZodSchema,
};
