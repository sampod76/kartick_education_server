import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { PAGINATION_FIELDS } from '../../../constant/pagination';
import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { UserLoginHistoryFilterableFields } from './loginHistory.constant';
import { IUserLoginHistory } from './loginHistory.interface';
import { UserLoginHistoryService } from './loginHistory.service';

const getAllUserLoginHistorys = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, UserLoginHistoryFilterableFields);
    const paginationOptions = pick(req.query, PAGINATION_FIELDS);

    const result = await UserLoginHistoryService.getAllUserLoginHistorys(
      filters,
      paginationOptions,
    );

    sendResponse<IUserLoginHistory[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'UserLoginHistorys retrieved successfully !',
      meta: result.meta,
      data: result.data,
    });
  },
);

const getSingleUserLoginHistory = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await UserLoginHistoryService.getSingleUserLoginHistory(id);

    sendResponse<IUserLoginHistory>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'UserLoginHistory retrieved successfully !',
      data: result,
    });
  },
);

const updateUserLoginHistory = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedData = req.body;

    const result = await UserLoginHistoryService.updateUserLoginHistory(
      id,
      updatedData,
    );

    sendResponse<IUserLoginHistory>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'UserLoginHistory updated successfully !',
      data: result,
    });
  },
);
const deleteUserLoginHistory = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await UserLoginHistoryService.deleteUserLoginHistory(
      id,
      req.query,
    );

    sendResponse<IUserLoginHistory>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'UserLoginHistory deleted successfully !',
      data: result,
    });
  },
);

export const UserLoginHistoryController = {
  getAllUserLoginHistorys,
  getSingleUserLoginHistory,
  updateUserLoginHistory,
  deleteUserLoginHistory,
};
