import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';

import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { LESSON_FILTERABLE_FIELDS } from './lesson.constant';
import { ILesson } from './lesson.interface';
import { LessonService } from './lesson.service';

// import { z } from 'zod'
const createLesson = catchAsync(async (req: Request, res: Response) => {
  const { ...LessonData } = req.body;

  const result = await LessonService.createLessonByDb(LessonData);

  sendResponse<ILesson>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull create Lesson',
    data: result,
  });
});

const getAllLesson = catchAsync(async (req: Request, res: Response) => {
  //****************search and filter start******* */
  // console.log(req.query);
  const queryObject = req.query;

  const filters = pick(queryObject, LESSON_FILTERABLE_FIELDS);

  //****************pagination start************ */

  const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

  const result = await LessonService.getAllLessonFromDb(
    filters,
    paginationOptions
  );

  sendResponse<ILesson[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull Get  Lesson',
    meta: result.meta,
    data: result.data,
  });
  // next();
});

const getSingleLesson = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await LessonService.getSingleLessonFromDb(id);
  sendResponse<ILesson>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull get  Lesson',
    data: result,
  });
});
const updateLesson = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const result = await LessonService.updateLessonFromDb(id, updateData);

  sendResponse<ILesson>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull update  Lesson',
    data: result,
  });
});

const deleteLesson = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await LessonService.deleteLessonByIdFromDb(
    id,
    req.query
  );
  sendResponse<ILesson>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull delete  Lesson',
    data: result,
  });
});

const LessonReviewsByUser = catchAsync(
  async (req: Request, res: Response) => {
    // const { id } = req.params;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await LessonService.LessonReviewsByUserFromDb();

    sendResponse<ILesson>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull update reviews',
      data: result,
    });
  }
);
export const LessonController = {
  createLesson,
  getAllLesson,
  getSingleLesson,
  updateLesson,
  deleteLesson,
  LessonReviewsByUser,
};
