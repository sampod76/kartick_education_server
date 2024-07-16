import { Types } from 'mongoose';
import { z } from 'zod';
export const zodFileSchema = z.object({
  original_filename: z.string(),
  fileType: z.string(),
  category: z.string(),
  path: z.string(),
  server_url: z.string(),
  size: z.number().positive(),
});
export const assignmentBodyData = z.object({
  title: z.string(),
  description: z.string(),
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
  author: z.union([
    z.string({ required_error: 'author is required' }),
    z.instanceof(Types.ObjectId),
  ]),
});
const createAssignmentZodSchema = z.object({
  body: assignmentBodyData,
});
const updateAssignmentZodSchema = z.object({
  body: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      pdfs: z.array(zodFileSchema).optional(),
      isDelete: z.string().optional(),
    })
    .deepPartial(),
});

export const AssignmentValidation = {
  createAssignmentZodSchema,
  updateAssignmentZodSchema,
};
