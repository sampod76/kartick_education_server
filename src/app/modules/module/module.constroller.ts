import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';

import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { MODULE_FILTERABLE_FIELDS } from './module.constant';
import { IModule } from './module.interface';
import { ModuleService } from './module.service';

// import { z } from 'zod'
const createModule = catchAsync(async (req: Request, res: Response) => {
  if (req?.user?.id) {
    req.body.author = req.user.id;
  }
  const result = await ModuleService.createModuleByDb(req.body);

  sendResponse<IModule>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull create  Module',
    data: result,
  });
});

const getAllModule = catchAsync(async (req: Request, res: Response) => {
  //****************search and filter start******* */
  // console.log(req.query);
  const queryObject = req.query;

  const filters = pick(queryObject, MODULE_FILTERABLE_FIELDS);

  //****************pagination start************ */

  const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

  const result = await ModuleService.getAllModuleFromDb(
    filters,
    paginationOptions,
  );

  sendResponse<IModule[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull Get  Module',
    meta: result.meta,
    data: result.data,
  });
  // next();
});

const getSingleModule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const filters = pick(req.query, MODULE_FILTERABLE_FIELDS);
  const result = await ModuleService.getSingleModuleFromDb(id, filters);
  sendResponse<IModule>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull get  Module',
    data: result,
  });
});
const updateModule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const result = await ModuleService.updateModuleFromDb(id, updateData);

  sendResponse<IModule>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull update  Module',
    data: result,
  });
});

const deleteModule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ModuleService.deleteModuleByIdFromDb(id, req.query);
  sendResponse<IModule>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull delete  Module',
    data: result,
  });
});

const ModuleReviewsByUser = catchAsync(async (req: Request, res: Response) => {
  // const { id } = req.params;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const result = await ModuleService.ModuleReviewsByUserFromDb();

  sendResponse<IModule>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull update reviews',
    data: result,
  });
});
export const ModuleController = {
  createModule,
  getAllModule,
  getSingleModule,
  updateModule,
  deleteModule,
  ModuleReviewsByUser,
};
