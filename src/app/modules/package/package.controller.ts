import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';

import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { IPackage } from './package.interface';
import { PackageService } from './package.service';

import { PACKAGE_FILTERABLE_FIELDS } from './package.constant';

// import { z } from 'zod'
const createPackage = catchAsync(async (req: Request, res: Response) => {
  const { ...PackageData } = req.body;

  const result = await PackageService.createPackageByDb(PackageData);

  sendResponse<IPackage>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull create Package',
    data: result,
  });
});

const getAllPackage = catchAsync(async (req: Request, res: Response) => {
  //****************search and filter start******* */
  // console.log(req.query);
  const queryObject = req.query;

  const filters = pick(queryObject, PACKAGE_FILTERABLE_FIELDS);

  //****************pagination start************ */

  const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

  const result = await PackageService.getAllPackageFromDb(
    filters,
    paginationOptions,
  );

  sendResponse<IPackage[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull Get  Package',
    meta: result.meta,
    data: result.data,
  });
  // next();
});

const getSinglePackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PackageService.getPackageSingelFromDb(id);
  sendResponse<IPackage>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull get  Package',
    data: result,
  });
});

const getVerifyPackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PackageService.getPackageVerifyFromDb(id, req.user);
  sendResponse<IPackage[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull get  Package',
    data: result,
  });
});
const updatePackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PackageService.updatePackageFromDb(id, req.body);
  sendResponse<IPackage>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull get  Package',
    data: result,
  });
});
const increaseStudentPackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PackageService.increaseStudentPackageFromDb(id, req.body);
  sendResponse<IPackage>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull get  Package',
    data: result,
  });
});

const deletePackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PackageService.deletePackageByIdFromDb(id, req.query);
  sendResponse<IPackage>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull delete  Package',
    data: result,
  });
});

export const PackageController = {
  createPackage,
  getAllPackage,
  getSinglePackage,
  deletePackage,
  updatePackage,
  getVerifyPackage,
  increaseStudentPackage
};
