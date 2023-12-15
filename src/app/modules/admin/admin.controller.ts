import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { adminFilterableFields } from './admin.constant';
import { IAdmin } from './admin.interface';
import { AdminService } from './admin.service';
import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import { PAGINATION_FIELDS } from '../../../constant/pagination';
import sendResponse from '../../share/sendResponse';

const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, adminFilterableFields);
  const paginationOptions = pick(req.query, PAGINATION_FIELDS);

  const result = await AdminService.getAllAdminsDB(filters, paginationOptions);

  sendResponse<IAdmin[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admins retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleAdmin = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await AdminService.getSingleAdminDB(id);

  sendResponse<IAdmin>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin retrieved successfully !',
    data: result,
  });
});

const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;

  const result = await AdminService.updateAdminDB(id, updatedData);

  sendResponse<IAdmin>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin updated successfully !',
    data: result,
  });
});
const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await AdminService.deleteAdminDB(id);

  sendResponse<IAdmin>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin deleted successfully !',
    data: result,
  });
});

export const AdminController = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
};
