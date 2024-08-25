import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../share/catchAsync';
import sendResponse from '../../share/sendResponse';
import { homeVedioUploadServices } from './homeVideo.services';

const getAllVideo = catchAsync(async (req: Request, res: Response) => {
  // console.log(req)

  const result = await homeVedioUploadServices.getAllVideoFromDb();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull get academic Course',
    data: result,
  });
});

const uploadVideoDataInDB = catchAsync(async (req: Request, res: Response) => {
  // return
  console.log(req?.file);
  const result = await homeVedioUploadServices.uploadVideoDataInDB({
    ...req.body,
    videoFileName: req?.file?.filename,
  });
  console.log(result);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull get academic Course',
    data: result,
  });
});

const getSingleVideoFromDB = async (req: Request, res: Response) => {
  const { params } = req;

  console.log(params);

  const result = await homeVedioUploadServices.getSingleVideoFromDb(params?.id);

  console.log(result);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull get Singel Video data',
    data: result,
  });
};

export const HomeVideoController = {
  getAllVideo,
  uploadVideoDataInDB,
  getSingleVideoFromDB,
};
