import { z } from 'zod';
import { STATUS_ARRAY } from '../../../constant/globalConstant';

const createSingleQuizZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title field is required' }),
    img: z.string().url().optional(),
    details: z.string().optional(),
    hints: z.string().optional(),
    serialNumber:z.number().min(0).optional(),
    time_duration:z.number().min(0).optional(),
    answers:z.array(z.object({
      title:z.string(),
      serialNumber:z.number().min(0).optional(),
      correct:z.boolean().optional(),
      img:z.string().url().optional(),
    })).optional(),
    author: z.string().optional(),
    quiz: z.string().optional(),
    module: z.string({ required_error: 'module field is required' }),
    status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),
    demo_video: z.object({}).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const updateSingleQuizZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title field is required' }),
    img: z.string().url().optional(),
    details: z.string().optional(),
    hints: z.string().optional(),
    serialNumber:z.number().min(0).optional(),
    time_duration:z.number().min(0).optional(),
    answers:z.array(z.object({
      title:z.string().optional(),
      serialNumber:z.number().min(0).optional(),
      correct:z.boolean().optional(),
      img:z.string().url().optional(),
      status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),
    })).optional(),
    author: z.string().optional(),
    quiz: z.string().optional(),
    module: z.string().optional(),
    status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),
    demo_video: z.object({}).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const SingleQuizValidation = {
  createSingleQuizZodSchema,
  updateSingleQuizZodSchema,
};
