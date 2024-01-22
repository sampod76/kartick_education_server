import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';

import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { IStudentPurchasePackageCourse } from './interface.studentPurchaseCourseBuy';
import { StudentPurchasePackageCourseService } from './service.studentPurchaseCourseBuy';

import { ENUM_USER_ROLE } from '../../../enums/users';
import { student_purchase_course_FILTERABLE_FIELDS } from './constant.studentPurchaseCourseBuy';

// import { z } from 'zod'
const createStudentPurchasePackageCourse = catchAsync(
  async (req: Request, res: Response) => {
    const { ...PackageData } = req.body;

    const result =
      await StudentPurchasePackageCourseService.createStudentPurchasePackageCourseByDb(
        PackageData,
      );

    sendResponse<IStudentPurchasePackageCourse>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull create Package',
      data: result,
    });
  },
);

const getAllStudentPurchasePackageCourse = catchAsync(
  async (req: Request, res: Response) => {
    //****************search and filter start******* */
    // console.log(req.query);
    const queryObject = req.query;

    const filters = pick(
      queryObject,
      student_purchase_course_FILTERABLE_FIELDS,
    );

    if (req?.user?.role === ENUM_USER_ROLE.STUDENT) {
      filters.user = req?.user?.id;
    }

    //****************pagination start************ */

    const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

    const result =
      await StudentPurchasePackageCourseService.getAllStudentPurchasePackageCourseFromDb(
        filters,
        paginationOptions,
      );

    sendResponse<IStudentPurchasePackageCourse[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull Get Purchase Package',
      meta: result.meta,
      data: result.data,
    });

    // next();
  },
);

const getSingleStudentPurchasePackageCourse = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await StudentPurchasePackageCourseService.getStudentPurchasePackageCourseSingelFromDb(
        id,
      );
    sendResponse<IStudentPurchasePackageCourse>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull get  Package',
      data: result,
    });
  },
);

const getVerifyStudentPurchasePackageCourse = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await StudentPurchasePackageCourseService.getStudentPurchasePackageCourseVerifyFromDb(
        id,
        req.user,
      );
    sendResponse<IStudentPurchasePackageCourse[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull get  Package',
      data: result,
    });
  },
);

const updateStudentPurchasePackageCourse = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await StudentPurchasePackageCourseService.updateStudentPurchasePackageCourseFromDb(
        id,
        req.body,
      );
    sendResponse<IStudentPurchasePackageCourse>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull get  Package',
      data: result,
    });
  },
);

const deleteStudentPurchasePackageCourse = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await StudentPurchasePackageCourseService.deleteStudentPurchasePackageCourseByIdFromDb(
        id,
        req.query,
      );
    sendResponse<IStudentPurchasePackageCourse>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull delete  Package',
      data: result,
    });
  },
);

export const StudentPurchasePackageCourseController = {
  createStudentPurchasePackageCourse,
  deleteStudentPurchasePackageCourse,
  getVerifyStudentPurchasePackageCourse,
  getSingleStudentPurchasePackageCourse,
  getAllStudentPurchasePackageCourse,
  updateStudentPurchasePackageCourse,
};
