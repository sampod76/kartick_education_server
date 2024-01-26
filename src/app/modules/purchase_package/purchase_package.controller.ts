import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';

import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { IPurchasePackage } from './purchase_package.interface';
import { PurchasePackageService } from './purchase_package.service';

import { PURCHASE_PACKAGE_FILTERABLE_FIELDS } from './purchase_package.constant';

// import { z } from 'zod'
const createPurchasePackage = catchAsync(
  async (req: Request, res: Response) => {
    const { ...PackageData } = req.body;

    const result =
      await PurchasePackageService.createPurchasePackageByDb(PackageData);

    sendResponse<IPurchasePackage>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull create Package',
      data: result,
    });
  },
);

const getAllPackagePurchase = catchAsync(
  async (req: Request, res: Response) => {
    //****************search and filter start******* */
    // console.log(req.query);
    const queryObject = req.query;

    const filters = pick(queryObject, PURCHASE_PACKAGE_FILTERABLE_FIELDS);

    //****************pagination start************ */

    const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

    const result = await PurchasePackageService.getAllPurchasePackageFromDb(
      filters,
      paginationOptions,
    );

    sendResponse<IPurchasePackage[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull Get Purchase Package',
      meta: result.meta,
      data: result.data,
    });

    // next();
  },
);
const getAllPackagePurchasePendingPackage = catchAsync(
  async (req: Request, res: Response) => {
    //****************search and filter start******* */
    // console.log(req.query);
    const queryObject = req.query;

    const filters = pick(queryObject, PURCHASE_PACKAGE_FILTERABLE_FIELDS);

    //****************pagination start************ */

    const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

    const result =
      await PurchasePackageService.getAllPackagePurchasePendingPackageFromDb(
        filters,
        paginationOptions,
      );

    sendResponse<IPurchasePackage[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull Get Purchase Package',
      meta: result.meta,
      data: result.data,
    });

    // next();
  },
);

const getSinglePackagePurchase = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await PurchasePackageService.getPurchasePackageSingelFromDb(id);
    sendResponse<IPurchasePackage>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull get  Package',
      data: result,
    });
  },
);

const getVerifyPackagePurchase = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PurchasePackageService.getPurchasePackageVerifyFromDb(
      id,
      req.user,
    );
    sendResponse<IPurchasePackage[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull get  Package',
      data: result,
    });
  },
);

const updatePurchasePackage = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PurchasePackageService.updatePurchasePackageFromDb(
      id,
      req.body,
    );
    sendResponse<IPurchasePackage>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull get  Package',
      data: result,
    });
  },
);

const deletePackagePurchase = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PurchasePackageService.deletePurchasePackageByIdFromDb(
      id,
      req.query,
    );
    sendResponse<IPurchasePackage>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull delete  Package',
      data: result,
    });
  },
);

export const PurchasePackageController = {
  createPurchasePackage,
  deletePackagePurchase,
  getVerifyPackagePurchase,
  getSinglePackagePurchase,
  getAllPackagePurchase,
  updatePurchasePackage,
  getAllPackagePurchasePendingPackage,
};
