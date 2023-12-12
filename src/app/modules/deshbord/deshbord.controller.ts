import { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../share/catchAsync';
import sendResponse from '../../share/sendResponse';
import { deshbordService } from './deshbord.service';

// import { IUser } from './users.interface';
const getDeshbordData = catchAsync(async (req: Request, res: Response) => {
  const result = await deshbordService.deshbordFromDb();
  sendResponse<any>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull create user',
    data: result,
  });
});

export const deshbord = {
  getDeshbordData,
};
