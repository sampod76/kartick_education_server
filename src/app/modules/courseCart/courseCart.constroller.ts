import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';

import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { CourseCart_FILTERABLE_FIELDS } from './courseCart.constant';
import { ICourseCart } from './courseCart.interface';
import { CourseCartService } from './courseCart.service';

// import { z } from 'zod'
const createCourseCart = catchAsync(async (req: Request, res: Response) => {
  const { ...CourseCartData } = req.body;

  const result = await CourseCartService.createCourseCartByDb(CourseCartData);

  sendResponse<ICourseCart>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull create CourseCart',
    data: result,
  });
});

const getAllCourseCart = catchAsync(async (req: Request, res: Response) => {
  //****************search and filter start******* */
  // console.log(req.query);
  const queryObject = req.query;

  const filters = pick(queryObject, CourseCart_FILTERABLE_FIELDS);

  //****************pagination start************ */

  const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

  const result = await CourseCartService.getAllCourseCartFromDb(
    filters,
    paginationOptions,
  );


  sendResponse<ICourseCart[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull Get  CourseCart',
    meta: result.meta,
    data: result.data,
  });
  // next();
});

const getSingleCourseCart = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CourseCartService.getSingleCourseCartFromDb(id);
  sendResponse<ICourseCart>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull get  CourseCart',
    data: result,
  });
});
const updateCourseCart = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const result = await CourseCartService.updateCourseCartFromDb(id, updateData);

  sendResponse<ICourseCart>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull update  CourseCart',
    data: result,
  });
});

const deleteCourseCart = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CourseCartService.deleteCourseCartByIdFromDb(
    id,
    req.query,
  );
  sendResponse<ICourseCart>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull delete  CourseCart',
    data: result,
  });
});

const CourseCartReviewsByUser = catchAsync(
  async (req: Request, res: Response) => {
    // const { id } = req.params;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await CourseCartService.CourseCartReviewsByUserFromDb();

    sendResponse<ICourseCart>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull update reviews',
      data: result,
    });
  },
);
export const CourseCartController = {
  createCourseCart,
  getAllCourseCart,
  getSingleCourseCart,
  updateCourseCart,
  deleteCourseCart,
  CourseCartReviewsByUser,
};
