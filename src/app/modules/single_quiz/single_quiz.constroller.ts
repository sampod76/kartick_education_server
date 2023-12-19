import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';

import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { SINGLE_QUIZ_FILTERABLE_FIELDS } from './single_quiz.constant';
import { SingleQuizService } from './single_quiz.service';
import { ISingleQuiz } from './single_quiz.interface';


// import { z } from 'zod'
const createSingleQuiz = catchAsync(async (req: Request, res: Response) => {
  const { ...SingleQuizData } = req.body;

  const result = await SingleQuizService.createSingleQuizByDb(SingleQuizData);

  sendResponse<ISingleQuiz>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull create SingleQuiz',
    data: result,
  });
});

const getAllSingleQuiz = catchAsync(async (req: Request, res: Response) => {
  //****************search and filter start******* */
  // console.log(req.query);
  const queryObject = req.query;

  const filters = pick(queryObject, SINGLE_QUIZ_FILTERABLE_FIELDS);

  //****************pagination start************ */

  const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

  const result = await SingleQuizService.getAllSingleQuizFromDb(
    filters,
    paginationOptions
  );

  sendResponse<ISingleQuiz[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull Get  SingleQuiz',
    meta: result.meta,
    data: result.data,
  });
  // next();
});

const getSingleSingleQuiz = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SingleQuizService.getSingleSingleQuizFromDb(id);
  sendResponse<ISingleQuiz>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull get  SingleQuiz',
    data: result,
  });
});
const updateSingleQuiz = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const result = await SingleQuizService.updateSingleQuizFromDb(id, updateData);

  sendResponse<ISingleQuiz>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull update  SingleQuiz',
    data: result,
  });
});

const deleteSingleQuiz = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SingleQuizService.deleteSingleQuizByIdFromDb(
    id,
    req.query
  );
  sendResponse<ISingleQuiz>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull delete  SingleQuiz',
    data: result,
  });
});

const SingleQuizReviewsByUser = catchAsync(
  async (req: Request, res: Response) => {
    // const { id } = req.params;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await SingleQuizService.SingleQuizReviewsByUserFromDb();

    sendResponse<ISingleQuiz>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull update reviews',
      data: result,
    });
  }
);
export const SingleQuizController = {
  createSingleQuiz,
  getAllSingleQuiz,
  getSingleSingleQuiz,
  updateSingleQuiz,
  deleteSingleQuiz,
  SingleQuizReviewsByUser,
};
