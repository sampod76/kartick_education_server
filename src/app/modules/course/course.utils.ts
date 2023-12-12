import { Course } from './course.model';

export const findLastCourseId = async () => {
  const lastCourseId = await Course.findOne({}, { courseId: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();
  return lastCourseId?.courseId ? lastCourseId.courseId : undefined;
};

export const generateCourseId = async (): Promise<string> => {
  const currentId =
    (await findLastCourseId()) || (0).toString().padStart(3, '0');
  // increment by 1
  const incrementId = (Number(currentId) + 1).toString().padStart(3, '0');
  return incrementId;
};
