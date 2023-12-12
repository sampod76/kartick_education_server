"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoContestUserValidation = void 0;
const zod_1 = require("zod");
const createPhotoContestUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        contest: zod_1.z.string({ required_error: 'contest id is required' }),
        name: zod_1.z.string({ required_error: 'name is required' }),
        email: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        header_1: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        thumbnail: zod_1.z.string({ required_error: 'thumbnail is required' }),
    }),
});
const updatePhotoContestUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        email: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        header_1: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        thumbnail: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'deactive']).optional(),
    }),
});
//create photo vote --loverect
const createPhotoContestVoteZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        loveReact: zod_1.z.enum(['yes', 'no']).optional(),
        // loveReact: z.string().optional().optional(),
        message: zod_1.z.string().optional(),
        share: zod_1.z.enum(['yes', 'no']).optional(),
    }),
});
//winner prize update
const updatePhotoContestUserWinner = zod_1.z.object({
    body: zod_1.z.object({
        winnerData: zod_1.z
            .object({
            contest: zod_1.z.string(),
            contest_number: zod_1.z.string().optional(),
            date: zod_1.z.string(),
            winner: zod_1.z.number().nonnegative(),
        })
            .optional(),
    }),
});
exports.PhotoContestUserValidation = {
    createPhotoContestUserZodSchema,
    updatePhotoContestUserZodSchema,
    updatePhotoContestUserWinner,
    createPhotoContestVoteZodSchema,
};
