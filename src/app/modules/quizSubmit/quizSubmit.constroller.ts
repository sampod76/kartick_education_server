import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';

import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { IQuizSubmit } from './quizSubmit.interface';
import { QuizSubmitService } from './quizSubmit.service';

import { QUIZ_SUBMIT_FILTERABLE_FIELDS } from './quizSubmit.constant';

// import { z } from 'zod'
const createQuizSubmit = catchAsync(async (req: Request, res: Response) => {
  const { ...QuizSubmitData } = req.body;

  const result = await QuizSubmitService.createQuizSubmitByDb(
    QuizSubmitData,
    req.user,
  );

  sendResponse<IQuizSubmit>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull create QuizSubmit',
    data: result,
  });
});

const getAllQuizSubmit = catchAsync(async (req: Request, res: Response) => {
  //****************search and filter start******* */
  // console.log(req.query);
  const queryObject = req.query;

  const filters = pick(queryObject, QUIZ_SUBMIT_FILTERABLE_FIELDS);

  //****************pagination start************ */

  const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

  const result = await QuizSubmitService.getAllQuizSubmitFromDb(
    filters,
    paginationOptions,
  );

  sendResponse<IQuizSubmit[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull Get  QuizSubmit',
    meta: result.meta,
    data: result.data,
  });
  // next();
});
const getQuizSubmitAnalytics = catchAsync(
  async (req: Request, res: Response) => {
    //****************search and filter start******* */
    // console.log(req.query);
    const queryObject = req.query;

    const filters = pick(queryObject, QUIZ_SUBMIT_FILTERABLE_FIELDS);

    //****************pagination start************ */

    const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

    const result = await QuizSubmitService.getQuizSubmitAnalyticsFromDb(
      filters,
      paginationOptions,
    );

    sendResponse<IQuizSubmit[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull Get  QuizSubmit',
      meta: result.meta,
      data: result.data,
    });
    // next();
  },
);

const getSingleQuizSubmit = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await QuizSubmitService.getQuizSubmitSingelFromDb(id);
  sendResponse<IQuizSubmit>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull get  QuizSubmit',
    data: result,
  });
});

const getVerifyQuizSubmit = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await QuizSubmitService.getQuizSubmitVerifyFromDb(
    id,
    req.user,
  );
  sendResponse<IQuizSubmit[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull get  QuizSubmit',
    data: result,
  });
});

const deleteQuizSubmit = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await QuizSubmitService.deleteQuizSubmitByIdFromDb(
    id,
    req.query,
  );
  sendResponse<IQuizSubmit>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull delete  QuizSubmit',
    data: result,
  });
});

export const QuizSubmitController = {
  createQuizSubmit,
  getAllQuizSubmit,
  getSingleQuizSubmit,
  deleteQuizSubmit,
  getVerifyQuizSubmit,
  getQuizSubmitAnalytics,
};
