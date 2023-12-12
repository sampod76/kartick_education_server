import { z } from 'zod';

const createQuizZodSchema = z.object({
  body: z.object({
    quizId: z.string().optional(),
    quizList: z.array(
      z.object({
        title: z.string({ required_error: 'title is required' }).trim(),
        serial_no: z.number().int(),
        answers: z
          .array(z.string())
          .nonempty({ message: 'Answer is required' }),
        correct_answer: z.string({
          required_error: 'correct_answer is required',
        }),
        header_1: z.string().trim().optional(),
        header_2: z.string().trim().optional(),
        description: z.string().trim().optional(),
        thumbnail: z.string().trim().optional(),
        tag: z.array(z.string().optional()).optional(),
        hint: z.string().trim().optional(),
      })
    ),
    status: z.enum(['active', 'deactive', 'save']).optional(),
    tag: z.array(z.string()).optional(),
    course: z.string({ required_error: 'course _id is required' }), // Assuming the course is represented as a string
    courseId: z.string({ required_error: 'courseId is required' }),
    hint: z.string().trim().optional(),
  }),
});

const updateQuizZodSchema = z.object({
  body: z.object({
    quizId: z.optional(z.string()),
    quizList: z.optional(
      z.array(
        z.object({
          title: z.optional(z.string()),
          serial_no: z.optional(z.number().int()),
          answers: z.optional(z.array(z.string())),
          header_1: z.optional(z.string().trim()),
          header_2: z.optional(z.string().trim()),
          description: z.optional(z.string().trim()),
          thumbnail: z.optional(z.string().trim()),
          tag: z.optional(z.array(z.string().optional())),
          hint: z.optional(z.string().trim()),
        })
      )
    ),
    status: z.enum(['active', 'deactive', 'save']).optional(),
    tag: z.optional(z.array(z.string())),
    course: z.optional(z.string()),
    courseId: z.optional(z.string()),
    hint: z.optional(z.string().trim()),
  }),
});

export const QuizValidation = {
  createQuizZodSchema,
  updateQuizZodSchema,
};
