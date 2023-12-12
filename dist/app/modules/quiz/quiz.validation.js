"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizValidation = void 0;
const zod_1 = require("zod");
const createQuizZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        quizId: zod_1.z.string().optional(),
        quizList: zod_1.z.array(zod_1.z.object({
            title: zod_1.z.string({ required_error: 'title is required' }).trim(),
            serial_no: zod_1.z.number().int(),
            answers: zod_1.z
                .array(zod_1.z.string())
                .nonempty({ message: 'Answer is required' }),
            correct_answer: zod_1.z.string({
                required_error: 'correct_answer is required',
            }),
            header_1: zod_1.z.string().trim().optional(),
            header_2: zod_1.z.string().trim().optional(),
            description: zod_1.z.string().trim().optional(),
            thumbnail: zod_1.z.string().trim().optional(),
            tag: zod_1.z.array(zod_1.z.string().optional()).optional(),
            hint: zod_1.z.string().trim().optional(),
        })),
        status: zod_1.z.enum(['active', 'deactive', 'save']).optional(),
        tag: zod_1.z.array(zod_1.z.string()).optional(),
        course: zod_1.z.string({ required_error: 'course _id is required' }),
        courseId: zod_1.z.string().optional(),
        hint: zod_1.z.string().trim().optional(),
    }),
});
const updateQuizZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        quizId: zod_1.z.optional(zod_1.z.string()),
        quizList: zod_1.z.optional(zod_1.z.array(zod_1.z.object({
            title: zod_1.z.optional(zod_1.z.string()),
            serial_no: zod_1.z.optional(zod_1.z.number().int()),
            answers: zod_1.z.optional(zod_1.z.array(zod_1.z.string())),
            header_1: zod_1.z.optional(zod_1.z.string().trim()),
            header_2: zod_1.z.optional(zod_1.z.string().trim()),
            description: zod_1.z.optional(zod_1.z.string().trim()),
            thumbnail: zod_1.z.optional(zod_1.z.string().trim()),
            tag: zod_1.z.optional(zod_1.z.array(zod_1.z.string().optional())),
            hint: zod_1.z.optional(zod_1.z.string().trim()),
        }))),
        status: zod_1.z.enum(['active', 'deactive', 'save']).optional(),
        tag: zod_1.z.optional(zod_1.z.array(zod_1.z.string())),
        course: zod_1.z.optional(zod_1.z.string()),
        courseId: zod_1.z.optional(zod_1.z.string()),
        hint: zod_1.z.optional(zod_1.z.string().trim()),
    }),
});
exports.QuizValidation = {
    createQuizZodSchema,
    updateQuizZodSchema,
};
