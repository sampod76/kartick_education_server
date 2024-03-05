import { Request, Response } from 'express';

import { ShopService } from './shop.service';

import httpStatus from 'http-status';
import catchAsync from '../../share/catchAsync';
import sendResponse from '../../share/sendResponse';

const createShop = catchAsync(async (req: Request, res: Response) => {
  const shop = req.body;
  const result = await ShopService.createShopToDB(shop);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shop created successfully',
    data: result,
  });
});

const getShops = catchAsync(async (req: Request, res: Response) => {
  const result = await ShopService.getShopsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shops fetched successfully',
    data: result,
  });
});

const updateShop = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const shop = req.body;
  const result = await ShopService.updateShopFromDB(id, shop);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shop updated successfully',
    data: result,
  });
});

const getSingleShop = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await ShopService.getSingleShopFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shop fetched successfully',
    data: result,
  });
});

const deleteShop = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await ShopService.deleteShopFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shop deleted successfully',
    data: result,
  });
});

export const ShopController = {
  createShop,
  getShops,
  updateShop,
  getSingleShop,
  deleteShop,
};
