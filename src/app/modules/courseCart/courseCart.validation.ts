import { z } from 'zod';
import { STATUS_ARRAY } from '../../../constant/globalConstant';

const createCourseCartZodSchema = z.object({
  body: z.object({
    user: z.string({ required_error: 'User is required' }),
    course: z.string({ required_error: 'Course is required' }),
    status: z.enum([...STATUS_ARRAY] as [string, ...string[]]).optional(),
    isDelete: z.string().optional(),
  }),
});



export const CourseCartValidation = {
createCourseCartZodSchema,
  
};
