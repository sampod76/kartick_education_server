import httpStatus from 'http-status';
import { Types } from 'mongoose';
import { z } from 'zod';
import { STATUS_ARRAY, YN_ARRAY } from '../../../constant/globalConstant';
import ApiError from '../../errors/ApiError';
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
  totalMarks: z.number(),
  passMarks: z.number(),
  startTime: z
    .union([z.string({ required_error: 'startTime is required' }), z.date()])
    .optional(),
  endTime: z
    .union([z.string({ required_error: 'endTime is required' }), z.date()])
    .optional(),
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
  status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),
});
const createAssignmentZodSchema = z
  .object({
    body: assignmentBodyData,
  })
  .refine(
    ({ body }) => {
      if (body.startTime || body.endTime) {
        if (body.startTime && new Date(body.startTime).getTime() < Date.now()) {
          throw new ApiError(
            httpStatus.NOT_ACCEPTABLE,
            'StartTime is not be gater then now date',
          );
        } else if (
          body.endTime &&
          body.startTime &&
          new Date(body?.startTime).getTime() > new Date(body.endTime).getTime()
        ) {
          throw new ApiError(
            httpStatus.NOT_ACCEPTABLE,
            'Start time should be before End time',
          );
        } else {
          return true;
        }
      }
      return true;
    },
    {
      message: 'Date time error',
    },
  );
const updateAssignmentZodSchema = z
  .object({
    body: assignmentBodyData
      .merge(
        z.object({
          isDelete: z.enum([...YN_ARRAY] as [string, ...string[]]).optional(),
        }),
      )
      .deepPartial(),
  })
  .refine(
    ({ body }) => {
      if (body.startTime || body.endTime) {
        if (body.startTime && new Date(body.startTime).getTime() < Date.now()) {
          throw new ApiError(
            httpStatus.NOT_ACCEPTABLE,
            'StartTime is not be gater then now date',
          );
        } else if (
          body.endTime &&
          body.startTime &&
          new Date(body?.startTime).getTime() > new Date(body.endTime).getTime()
        ) {
          throw new ApiError(
            httpStatus.NOT_ACCEPTABLE,
            'Start time should be before End time',
          );
        } else {
          return true;
        }
      }
      return true;
    },
    {
      message: 'Date time error',
    },
  );

export const AssignmentValidation = {
  createAssignmentZodSchema,
  updateAssignmentZodSchema,
};
