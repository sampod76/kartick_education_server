import { z } from 'zod';

const createFileUploadezodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    userId: z.string().optional(),
    filename: z.string(),
    path: z.string(),
    size: z.number().optional(),
    mimetype: z.string().optional(),
    category: z.string().optional(),
    url: z.string().optional(),
    tag: z.array(z.string().optional()).optional(),
  }),
});

const updateFileUploadezodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    userId: z.string().optional(),
    filename: z.string().optional(),
    url: z.string().optional(),
    path: z.string().optional(),
    size: z.number().optional(),
    mimetype: z.string().optional(),
    category: z.string().optional(),
    tag: z.array(z.string().optional()).optional(),
  }),
});

export const FileUploadeValidation = {
  createFileUploadezodSchema,
  updateFileUploadezodSchema,
};
