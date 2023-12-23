import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { PAGINATION_FIELDS } from '../../../constant/pagination';
import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { sellerFilterableFields } from './seller.constant';
import { ISeller } from './seller.interface';
import { SellerService } from './seller.service';

const getAllSellers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, sellerFilterableFields);
  const paginationOptions = pick(req.query, PAGINATION_FIELDS);

  const result = await SellerService.getAllSellersDB(filters, paginationOptions);

  sendResponse<ISeller[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sellers retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleSeller = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await SellerService.getSingleSellerDB(id);

  sendResponse<ISeller>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Seller retrieved successfully !',
    data: result,
  });
});

const updateSeller = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;

  const result = await SellerService.updateSellerDB(id, updatedData);

  sendResponse<ISeller>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Seller updated successfully !',
    data: result,
  });
});
const deleteSeller = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await SellerService.deleteSellerDB(id,req.query);

  sendResponse<ISeller>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Seller deleted successfully !',
    data: result,
  });
});

export const SellerController = {
  getAllSellers,
  getSingleSeller,
  updateSeller,
  deleteSeller,
};
