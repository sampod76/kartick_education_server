import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';

import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { IPurchase_category } from './purchase_category.interface';
import { Purchase_categoryService } from './purchase_category.service';

import { purchase_category_FILTERABLE_FIELDS } from './purchase_category.constant';

// import { z } from 'zod'
const createPurchase_category = catchAsync(
  async (req: Request, res: Response) => {
    const { ...CategoryData } = req.body;

    const result =
      await Purchase_categoryService.createPurchase_categoryByDb(CategoryData);

    sendResponse<IPurchase_category>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successful create Category',
      data: result,
    });
  },
);

const getAllCategoryPurchase = catchAsync(
  async (req: Request, res: Response) => {
    //****************search and filter start******* */
    // console.log(req.query);
    const queryObject = req.query;

    const filters = pick(queryObject, purchase_category_FILTERABLE_FIELDS);

    //****************pagination start************ */

    const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

    const result = await Purchase_categoryService.getAllPurchase_categoryFromDb(
      filters,
      paginationOptions,
    );

    sendResponse<IPurchase_category[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull Get Purchase Category',
      meta: result.meta,
      data: result.data,
    });

    // next();
  },
);
const getAllPurchaseAndPendingCategorys = catchAsync(
  async (req: Request, res: Response) => {
    //****************search and filter start******* */
    // console.log(req.query);
    const queryObject = req.query;

    const filters = pick(queryObject, purchase_category_FILTERABLE_FIELDS);

    //****************pagination start************ */

    const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

    const result =
      await Purchase_categoryService.getAllPurchaseAndPendingcategorysFromDb(
        filters,
        paginationOptions,
      );

    sendResponse<IPurchase_category[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull Get Purchase Category',
      meta: result.meta,
      data: result.data,
    });

    // next();
  },
);
const getAllCategoryPurchaseTotalAmount = catchAsync(
  async (req: Request, res: Response) => {
    const queryObject = req.query;
    const filters = pick(queryObject, purchase_category_FILTERABLE_FIELDS);
    const paginationOptions = pick(queryObject, PAGINATION_FIELDS);
    const result =
      await Purchase_categoryService.getAllPurchase_categorysTotalAmountFromDb(
        filters,
        paginationOptions,
      );
    sendResponse<IPurchase_category[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull Get Purchase Category',
      meta: result.meta,
      data: result.data,
    });

    // next();
  },
);

const getSingleCategoryPurchase = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await Purchase_categoryService.getPurchase_categorySingelFromDb(id);
    sendResponse<IPurchase_category>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull get  Category',
      data: result,
    });
  },
);
const getSinglePurchaseAndPendingCategorys = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await Purchase_categoryService.getPurchase_categorySingelFromDb(id);
    sendResponse<IPurchase_category>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull get  Category',
      data: result,
    });
  },
);

const getVerifyCategoryPurchase = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await Purchase_categoryService.getPurchase_categoryVerifyFromDb(
        id,
        req.user,
      );
    sendResponse<IPurchase_category[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull get  Category',
      data: result,
    });
  },
);

const updatePurchase_category = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await Purchase_categoryService.updatePurchase_categoryFromDb(
      id,
      req.body,
    );
    sendResponse<IPurchase_category>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull get  Category',
      data: result,
    });
  },
);

const deleteCategoryPurchase = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await Purchase_categoryService.deletePurchase_categoryByIdFromDb(
        id,
        req.query,
      );
    sendResponse<IPurchase_category>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull delete  Category',
      data: result,
    });
  },
);

export const Purchase_categoryController = {
  createPurchase_category,
  deleteCategoryPurchase,
  getVerifyCategoryPurchase,
  getSingleCategoryPurchase,
  getAllCategoryPurchase,
  updatePurchase_category,
  getAllPurchaseAndPendingCategorys,
  getSinglePurchaseAndPendingCategorys,
  getAllCategoryPurchaseTotalAmount,
};
