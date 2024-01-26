import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';

import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { IPurchaseCourse } from './purchase_courses.interface';
import { PurchaseCourseService } from './purchase_courses.service';

import { PURCHASE_COURSE_FILTERABLE_FIELDS } from './purchase_courses.constant';

// import { z } from 'zod'
const createPurchaseCourse = catchAsync(
  async (req: Request, res: Response) => {
    const { ...CourseData } = req.body;

    const result =
      await PurchaseCourseService.createPurchaseCourseByDb(CourseData);

    sendResponse<IPurchaseCourse>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull create Course',
      data: result,
    });
  },
);

const getAllCoursePurchase = catchAsync(
  async (req: Request, res: Response) => {
    //****************search and filter start******* */
    // console.log(req.query);
    const queryObject = req.query;

    const filters = pick(queryObject, PURCHASE_COURSE_FILTERABLE_FIELDS);

    //****************pagination start************ */

    const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

    const result = await PurchaseCourseService.getAllPurchaseCourseFromDb(
      filters,
      paginationOptions,
    );

    sendResponse<IPurchaseCourse[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull Get Purchase Course',
      meta: result.meta,
      data: result.data,
    });

    // next();
  },
);
const getAllpurchaseAndPendingCourses = catchAsync(
  async (req: Request, res: Response) => {
    //****************search and filter start******* */
    // console.log(req.query);
    const queryObject = req.query;

    const filters = pick(queryObject, PURCHASE_COURSE_FILTERABLE_FIELDS);

    //****************pagination start************ */

    const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

    const result = await PurchaseCourseService.getAllpurchaseAndPendingCoursesFromDb(
      filters,
      paginationOptions,
    );

    sendResponse<IPurchaseCourse[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull Get Purchase Course',
      meta: result.meta,
      data: result.data,
    });

    // next();
  },
);

const getSingleCoursePurchase = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await PurchaseCourseService.getPurchaseCourseSingelFromDb(id);
    sendResponse<IPurchaseCourse>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull get  Course',
      data: result,
    });
  },
);

const getVerifyCoursePurchase = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PurchaseCourseService.getPurchaseCourseVerifyFromDb(
      id,
      req.user,
    );
    sendResponse<IPurchaseCourse[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull get  Course',
      data: result,
    });
  },
);

const updatePurchaseCourse = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PurchaseCourseService.updatePurchaseCourseFromDb(
      id,
      req.body,
    );
    sendResponse<IPurchaseCourse>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull get  Course',
      data: result,
    });
  },
);

const deleteCoursePurchase = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PurchaseCourseService.deletePurchaseCourseByIdFromDb(
      id,
      req.query,
    );
    sendResponse<IPurchaseCourse>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull delete  Course',
      data: result,
    });
  },
);

export const PurchaseCourseController = {
  createPurchaseCourse,
  deleteCoursePurchase,
  getVerifyCoursePurchase,
  getSingleCoursePurchase,
  getAllCoursePurchase,
  updatePurchaseCourse,
  getAllpurchaseAndPendingCourses
};
