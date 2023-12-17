"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseValidation = void 0;
const zod_1 = require("zod");
const globalConstant_1 = require("../../../constant/globalConstant");
const course_constant_1 = require("./course.constant");
const createCourseZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'title field is required' }),
        img: zod_1.z.string().optional(),
        details: zod_1.z.string().optional(),
        author: zod_1.z.string({ required_error: 'author_id field is required' }),
        category: zod_1.z.string({
            required_error: 'main_course_category_id field is required',
        }),
        // sub1_course_category_id: z.string({
        //   required_error: 'sub1_course_category_id field is required',
        // }),
        duration: zod_1.z.string().optional(),
        level: zod_1.z.string().optional(),
        price_type: zod_1.z.enum([...course_constant_1.COURSE_TYPES]).optional(),
        status: zod_1.z.enum([...globalConstant_1.STATUS_ARRAY]).optional(),
        favorite: zod_1.z.enum([...globalConstant_1.YN_ARRAY]).optional(),
        showing_number: zod_1.z.number().min(0).optional(),
        price: zod_1.z.number().min(0).optional(),
        demo_video: zod_1.z.object({}).optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
const updateCourseZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        img: zod_1.z.string().optional(),
        details: zod_1.z.string().optional(),
        author_id: zod_1.z.string().optional(),
        category: zod_1.z.string().optional(),
        // sub1_course_category_id: z
        //   .string({
        //     required_error: 'sub1_course_category_id field is required',
        //   })
        //   .optional(),
        duration: zod_1.z.string().optional(),
        level: zod_1.z.string().optional(),
        price_type: zod_1.z.enum([...course_constant_1.COURSE_TYPES]).optional(),
        status: zod_1.z.enum([...globalConstant_1.STATUS_ARRAY]).optional(),
        price: zod_1.z.number().min(0).optional(),
        favorite: zod_1.z.enum([...globalConstant_1.YN_ARRAY]).optional(),
        showing_number: zod_1.z.number().min(0).optional(),
        demo_video: zod_1.z.object({}).optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.CourseValidation = {
    createCourseZodSchema,
    updateCourseZodSchema,
};
