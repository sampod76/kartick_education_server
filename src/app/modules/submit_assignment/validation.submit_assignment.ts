import { Types } from 'mongoose';
import { z } from 'zod';
import { STATUS_ARRAY, YN_ARRAY } from '../../../constant/globalConstant';
export const zodFileSchema = z.object({
  original_filename: z.string(),
  fileType: z.string(),
  category: z.string(),
  path: z.string(),
  server_url: z.string(),
  size: z.number().positive(),
});
export const submitAssignmentBodyData = z.object({
  assignment: z.union([
    z.string({ required_error: 'assignment is required' }),
    z.instanceof(Types.ObjectId),
  ]),
  assignmentCreator: z.union([
    z.string({ required_error: 'assignment is required' }),
    z.instanceof(Types.ObjectId),
  ]),
  marks: z.number().optional(),
  note: z.string().optional(),
  pdfs: z.array(zodFileSchema),
  lesson: z.union([
    z.string({ required_error: 'lesson is required' }),
    z.instanceof(Types.ObjectId),
  ]), // MongoDB ObjectId
  module: z.union([
    z.string({ required_error: 'module is required' }),
    z.instanceof(Types.ObjectId),
  ]),
  milestone: z.union([
    z.string({ required_error: 'milestone is required' }),
    z.instanceof(Types.ObjectId),
  ]),
  course: z.union([
    z.string({ required_error: 'course is required' }),
    z.instanceof(Types.ObjectId),
  ]),
  category: z.union([
    z.string({ required_error: 'category is required' }),
    z.instanceof(Types.ObjectId),
  ]),
  //
  author: z
    .union([
      z.string({ required_error: 'author is required' }),
      z.instanceof(Types.ObjectId),
    ])
    .optional(),
  authorEmail: z.string().optional(),
  accountCreateAuthor: z
    .union([z.string(), z.instanceof(Types.ObjectId)])
    .optional(),
  status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),
});
const createsubmitAssignmentZodSchema = z.object({
  body: submitAssignmentBodyData,
});

const updatesubmitAssignmentZodSchema = z.object({
  body: submitAssignmentBodyData
    .merge(
      z.object({
        isDelete: z.enum([...YN_ARRAY] as [string, ...string[]]).optional(),
      }),
    )
    .deepPartial(),
});

export const submitAssignmentValidation = {
  createsubmitAssignmentZodSchema,
  updatesubmitAssignmentZodSchema,
};
