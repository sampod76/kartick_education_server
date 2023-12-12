import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';
// import { globalImport } from '../../../import/global_Import';
// import ApiError from '../../errors/ApiError';
import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { COURSE_FILTERABLE_FIELDS } from './course.consent';
import { ICourse } from './course.interface';
import { CourseService } from './course.service';

// import { z } from 'zod'
const createCourse = catchAsync(async (req: Request, res: Response) => {
  const { ...courseData } = req.body;

  const result = await CourseService.createCourseByDb(courseData);

  sendResponse<ICourse>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull create academic Course',
    data: result,
  });
});

const getAllCourse = catchAsync(async (req: Request, res: Response) => {
  //****************search and filter start******* */
  // console.log(req.query);
  let queryObject = req.query;
  queryObject = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(queryObject).filter(([_, value]) => Boolean(value))
  );
  const filters = pick(queryObject, COURSE_FILTERABLE_FIELDS);

  //****************pagination start************ */

  const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

  const result = await CourseService.getAllCourseFromDb(
    filters,
    paginationOptions
  );

  sendResponse<ICourse[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull Get academic Course',
    meta: result.meta,
    data: result.data,
  });
  // next();
});

const getSingleCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CourseService.getSingleCourseFromDb(id);
  sendResponse<ICourse>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull get academic Course',
    data: result,
  });
});
const updateCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const result = await CourseService.updateCourseFromDb(id, updateData);

  sendResponse<ICourse>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull update academic Course',
    data: result,
  });
});

const deleteCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CourseService.deleteCourseByIdFromDb(id);
  sendResponse<ICourse>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull delete academic Course',
    data: result,
  });
});

const courseReviewsByUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const result = await CourseService.courseReviewsByUserFromDb(
    id,
    req.body,
    req
  );

  sendResponse<ICourse>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull update reviews',
    data: result,
  });
});
export const CourseController = {
  createCourse,
  getAllCourse,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  courseReviewsByUser,
};
