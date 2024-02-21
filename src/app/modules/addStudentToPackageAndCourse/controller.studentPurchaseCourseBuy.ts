import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';

import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { IStudentPurchasePackageCategoryCourse } from './interface.studentPurchaseCourseBuy';
import { StudentPurchasePackageCategoryCourseService } from './service.studentPurchaseCourseBuy';

import { ENUM_USER_ROLE } from '../../../enums/users';
import { student_purchase_category_course_FILTERABLE_FIELDS } from './constant.studentPurchaseCourseBuy';

// import { z } from 'zod'
const createStudentPurchasePackageCategoryCourse = catchAsync(
  async (req: Request, res: Response) => {
    const { ...PackageData } = req.body;

    const result =
      await StudentPurchasePackageCategoryCourseService.createStudentPurchasePackageCategoryCourseByDb(
        PackageData,
      );

    sendResponse<IStudentPurchasePackageCategoryCourse>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull create Package',
      data: result,
    });
  },
);

const getAllStudentPurchasePackageCategoryCourse = catchAsync(
  async (req: Request, res: Response) => {
    //****************search and filter start******* */
    // console.log(req.query);
    const queryObject = req.query;

    const filters = pick(
      queryObject,
      student_purchase_category_course_FILTERABLE_FIELDS,
    );

    if (req?.user?.role === ENUM_USER_ROLE.STUDENT) {
      filters.user = req?.user?.id;
    }

    //****************pagination start************ */

    const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

    const result =
      await StudentPurchasePackageCategoryCourseService.getAllStudentPurchasePackageCategoryCourseFromDb(
        filters,
        paginationOptions,
      );

    sendResponse<IStudentPurchasePackageCategoryCourse[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull Get Purchase Package',
      meta: result.meta,
      data: result.data,
    });

    // next();
  },
);

const getSingleStudentPurchasePackageCategoryCourse = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await StudentPurchasePackageCategoryCourseService.getStudentPurchasePackageCategoryCourseSingelFromDb(
        id,
      );
    sendResponse<IStudentPurchasePackageCategoryCourse>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull get  Package',
      data: result,
    });
  },
);

const getVerifyStudentPurchasePackageCategoryCourse = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await StudentPurchasePackageCategoryCourseService.getStudentPurchasePackageCategoryCourseVerifyFromDb(
        id,
        req.user,
      );
    sendResponse<IStudentPurchasePackageCategoryCourse[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull get  Package',
      data: result,
    });
  },
);

const updateStudentPurchasePackageCategoryCourse = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await StudentPurchasePackageCategoryCourseService.updateStudentPurchasePackageCategoryCourseFromDb(
        id,
        req.body,
        req,
      );
    sendResponse<IStudentPurchasePackageCategoryCourse>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull get  Package',
      data: result,
    });
  },
);

const deleteStudentPurchasePackageCategoryCourse = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await StudentPurchasePackageCategoryCourseService.deleteStudentPurchasePackageCategoryCourseByIdFromDb(
        id,
        req.query,
        req?.user,
      );
    sendResponse<IStudentPurchasePackageCategoryCourse>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull delete  Package',
      data: result,
    });
  },
);

export const StudentPurchasePackageCategoryCourseController = {
  createStudentPurchasePackageCategoryCourse,
  deleteStudentPurchasePackageCategoryCourse,
  getVerifyStudentPurchasePackageCategoryCourse,
  getSingleStudentPurchasePackageCategoryCourse,
  getAllStudentPurchasePackageCategoryCourse,
  updateStudentPurchasePackageCategoryCourse,
};
