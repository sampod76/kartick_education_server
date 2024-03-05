import { Request, Response } from 'express';

import { SurpriseBagService } from './surprise.service';

import httpStatus from 'http-status';
import catchAsync from '../../share/catchAsync';
import sendResponse from '../../share/sendResponse';

const createSurprise = catchAsync(async (req: Request, res: Response) => {
  const surprise = req.body;
  const result = await SurpriseBagService.createSurpriseBagToDB(surprise);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Surprise Bag created successfully',
    data: result,
  });
});

const getAllSurprise = catchAsync(async (req: Request, res: Response) => {
  const result = await SurpriseBagService.getAllSurpriseBagsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Surprise Bags fetched successfully',
    data: result,
  });
});

const updateSurpriseBag = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const surprise = req.body;
  const result = await SurpriseBagService.updateSurpriseBagFromDB(id, surprise);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Surprise Bag updated successfully',
    data: result,
  });
});

const getSingleSurprise = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await SurpriseBagService.getSingleSurpriseBagFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Surprise Bag fetched successfully',
    data: result,
  });
});

const deleteSurpriseBag = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await SurpriseBagService.deleteSurpriseBagFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Surprise Bag deleted successfully',
    data: result,
  });
});

export const SurpriseBagController = {
  createSurprise,
  getAllSurprise,
  updateSurpriseBag,
  getSingleSurprise,
  deleteSurpriseBag,
};
