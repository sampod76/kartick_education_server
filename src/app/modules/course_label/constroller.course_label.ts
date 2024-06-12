import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';
// import { globalImport } from '../../../import/global_Import';
// import ApiError from '../../errors/ApiError';
import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';

import { Course_label_FILTERABLE_FIELDS } from './consent.course_label';
import { ICourse_label } from './interface.course_label';
import { Course_labelService } from './service.course_label';

// import { z } from 'zod'
const createCourse_label = catchAsync(async (req: Request, res: Response) => {
  if (req?.user?.id) {
    req.body.author = req.user.id;
  }

  const result = await Course_labelService.createCourse_labelByDb(req.body);

  sendResponse<ICourse_label>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull create Course_label Course_label',
    data: result,
  });
  // next();
  /* res.status(200).send({
      success: true,
      data: result,
      message: 'successfull create Course_label Course_label',
    }); */
});

const getAllCourse_label = catchAsync(async (req: Request, res: Response) => {
  //****************search and filter start******* */
  let queryObject = req.query;
  queryObject = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(queryObject).filter(([_, value]) => Boolean(value)),
  );
  const filters = pick(queryObject, Course_label_FILTERABLE_FIELDS);

  //****************pagination start************ */

  const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

  const result = await Course_labelService.getAllCourse_labelFromDb(
    filters,
    paginationOptions,
  );

  sendResponse<ICourse_label[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull Get Course_label Course_label',
    meta: result.meta,
    data: result.data,
  });
  // next();
});
const getAllCourse_labelChildrenTitle = catchAsync(
  async (req: Request, res: Response) => {
    //****************search and filter start******* */
    let queryObject = req.query;
    queryObject = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(queryObject).filter(([_, value]) => Boolean(value)),
    );
    const filters = pick(queryObject, Course_label_FILTERABLE_FIELDS);

    //****************pagination start************ */

    const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

    const result =
      await Course_labelService.getAllCourse_labelChildrenTitleFromDb(
        filters,
        paginationOptions,
      );

    sendResponse<ICourse_label[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull Get Course_label Course_label',
      meta: result.meta,
      data: result.data,
    });
    // next();
  },
);

const getSingleCourse_label = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    /*   if (!globalImport.ObjectId.isValid(id)) {
      throw new ApiError(400, 'invalid id sampod');
    } */

    const result = await Course_labelService.getSingleCourse_labelFromDb(id);

    /* if (!result) {
      throw new ApiError(400, 'No data found');
    } */
    sendResponse<ICourse_label>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull get Course_label Course_label',
      data: result,
    });
  },
);
const updateCourse_label = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  /*   if (!globalImport.ObjectId.isValid(id)) {
      throw new ApiError(400, 'invalid id sampod');
    } */

  const result = await Course_labelService.updateCourse_labelFromDb(
    id,
    updateData,
  );

  /* if (!result) {
      throw new ApiError(400, 'No data found');
    } */
  sendResponse<ICourse_label>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull update Course_label Course_label',
    data: result,
  });
});

const deleteCourse_label = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await Course_labelService.deleteCourse_labelByIdFromDb(id);
  sendResponse<ICourse_label>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull delete Course_label Course_label',
    data: result,
  });
});
export const Course_labelController = {
  createCourse_label,
  getAllCourse_label,
  getSingleCourse_label,
  updateCourse_label,
  deleteCourse_label,
  getAllCourse_labelChildrenTitle,
};
