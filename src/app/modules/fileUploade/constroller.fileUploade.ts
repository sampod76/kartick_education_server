/* eslint-disable no-undef */
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';
// import { globalImport } from '../../../import/global_Import';
// import ApiError from '../../errors/ApiError';

import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';

import { FileUploadHelper } from '../../middlewares/uploderCloudinary';
import { FILEUPLOADE_FILTERABLE_FIELDS } from './consent.fileUploade';
import { IFileUploade } from './interface.fileUploade';
import { FileUploadeService } from './service.fileUploade';

// ! ********** file upload server **********
// import { z } from 'zod'

const uploadeSingleFileByServer = catchAsync(
  async (req: Request, res: Response) => {
    const result: any = await FileUploadHelper.uploadToCloudinary(
      req.file as any,
    );
    const data = await FileUploadeService.createFileUploadeByDb({
      user: req?.user?.id,
      category: 'admin',
      server_url: 'uploadFile/images/' + req?.file?.filename,
      fileType: req?.file?.mimetype || 'image',
      ...result,
    });
    sendResponse<any>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull uploade single file',
      data: data,
    });
  },
);

const uploadeProfileFileByServer = catchAsync(
  async (req: Request, res: Response) => {
    const result: any = await FileUploadHelper.uploadToCloudinary(
      req.file as any,
    );
    // const result = await FileUploadeService.createFileUploadeByDb(file);
    sendResponse<any>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull uploade single file',
      data: result,
    });
  },
);

const uploadeMultipalFileByServer = catchAsync(
  async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    const result: any = await FileUploadHelper.uploadToCloudinaryMultiple(
      files.map(file => ({
        ...file,
        user: req?.user?.id,
        category: 'admin',
        fileType: req?.file?.mimetype || 'image',
        server_url: 'uploadFile/images/' + file?.filename,
        path: 'uploadFile/images',
      })),
    );
    const data = await FileUploadeService.createMultipalFileUploadeByDb(result);
    sendResponse<any[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull uploade multipal file',
      data: data,
    });
  },
);
const uploadePdfFileByServer = catchAsync(
  async (req: Request, res: Response) => {
    const fileDetails = req.file;

    const file = {
      original_filename: fileDetails?.filename as string,
      fileType: fileDetails?.mimetype || 'pdf',
      user: req?.user?.id,
      category: 'dashboard',
      path: 'uploadFile/images',
      server_url: 'uploadFile/images/' + fileDetails?.filename,
      size: fileDetails?.size,
    };
    const data = await FileUploadeService.createFileUploadeByDb(file);
    sendResponse<any>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull uploade single file',
      data: data,
    });
  },
);
const uploadeAudioFileByServer = catchAsync(
  async (req: Request, res: Response) => {
    const fileDetails = req.file;

    const file = {
      original_filename: fileDetails?.filename as string,
      fileType: fileDetails?.mimetype || 'audio',
      user: req?.user?.id,
      category: 'dashboard',
      path: 'uploadFile/audios',
      server_url: 'uploadFile/audios/' + fileDetails?.filename,
      size: fileDetails?.size,
    };
    const data = await FileUploadeService.createFileUploadeByDb(file);
    sendResponse<any>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull uploade single file',
      data: data,
    });
  },
);

// ! ********** file upload server --end ***************

const createFileUploade = catchAsync(async (req: Request, res: Response) => {
  const { ...FileUploadeData } = req.body;
  req.body.userId = req?.user?._id;
  const result =
    await FileUploadeService.createFileUploadeByDb(FileUploadeData);

  sendResponse<IFileUploade>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull create FileUploade',
    data: result,
  });
  // next();
  /* res.status(200).send({
      success: true,
      data: result,
      message: 'successfull create FileUploade FileUploade',
    }); */
});

const getAllFileUploade = catchAsync(async (req: Request, res: Response) => {
  //****************search and filter start******* */
  let queryObject = req.query;
  queryObject = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(queryObject).filter(([_, value]) => Boolean(value)),
  );
  const filters = pick(queryObject, FILEUPLOADE_FILTERABLE_FIELDS);

  //****************pagination start************ */

  const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

  const result = await FileUploadeService.getAllFileUploadeFromDb(
    filters,
    paginationOptions,
  );

  sendResponse<IFileUploade[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull Get FileUploade FileUploade',
    meta: result.meta,
    data: result.data,
  });
  // next();
});

const getSingleFileUploade = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  /*   if (!globalImport.ObjectId.isValid(id)) {
      throw new ApiError(400, 'invalid id sampod');
    } */

  const result = await FileUploadeService.getSingleFileUploadeFromDb(id);

  /* if (!result) {
      throw new ApiError(400, 'No data found');
    } */
  sendResponse<IFileUploade>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull get FileUploade FileUploade',
    data: result,
  });
});
const updateFileUploade = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  /*   if (!globalImport.ObjectId.isValid(id)) {
      throw new ApiError(400, 'invalid id sampod');
    } */

  const result = await FileUploadeService.updateFileUploadeFromDb(
    id,
    updateData,
  );

  /* if (!result) {
      throw new ApiError(400, 'No data found');
    } */
  sendResponse<IFileUploade>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull update FileUploade FileUploade',
    data: result,
  });
});

const deleteFileUploade = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FileUploadeService.deleteFileUploadeByIdFromDb(id);
  sendResponse<IFileUploade>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull delete FileUploade FileUploade',
    data: result,
  });
});
export const FileUploadeController = {
  createFileUploade,
  getAllFileUploade,
  getSingleFileUploade,
  updateFileUploade,
  deleteFileUploade,
  uploadeSingleFileByServer,
  uploadeProfileFileByServer,
  uploadeMultipalFileByServer,
  uploadePdfFileByServer,
  uploadeAudioFileByServer,
};
