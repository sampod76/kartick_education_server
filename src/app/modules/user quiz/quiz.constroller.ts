import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';
// import { globalImport } from '../../../import/global_Import';
// import ApiError from '../../errors/ApiError';
import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';

import { QUIZ_FILTERABLE_FIELDS } from './quiz.consent';
import { IQuiz } from './quiz.interface';
import { QuizService } from './quiz.service';

// import { z } from 'zod'
const createQuiz = catchAsync(async (req: Request, res: Response) => {
  const { ...QuizData } = req.body;

  const result = await QuizService.createQuizByDb(QuizData);

  sendResponse<IQuiz>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull create  Quiz',
    data: result,
  });
  // next();
  /* res.status(200).send({
      success: true,
      data: result,
      message: 'successfull create  Quiz',
    }); */
});

const getAllQuiz = catchAsync(async (req: Request, res: Response) => {
  //****************search and filter start******* */
  const filters = pick(req.query, QUIZ_FILTERABLE_FIELDS);

  //****************pagination start************ */

  const paginationOptions = pick(req.query, PAGINATION_FIELDS);

  const result = await QuizService.getAllQuizFromDb(filters, paginationOptions);

  sendResponse<IQuiz[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull found Quizs',
    meta: result.meta,
    data: result.data,
  });
  // next();
});

const getSingleQuiz = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await QuizService.getSingleQuizFromDb(id);
  sendResponse<IQuiz>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull get Quiz',
    data: result,
  });
});
const updateQuiz = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const result = await QuizService.updateQuizFromDb(id, updateData);

  sendResponse<IQuiz>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull update Quiz',
    data: result,
  });
});

const deleteQuiz = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await QuizService.deleteQuizByIdFromDb(id);
  sendResponse<IQuiz>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull delete Quiz',
    data: result,
  });
});
export const QuizController = {
  createQuiz,
  getAllQuiz,
  getSingleQuiz,
  updateQuiz,
  deleteQuiz,
};
