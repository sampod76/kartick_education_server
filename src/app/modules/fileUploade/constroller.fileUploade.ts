/* eslint-disable no-undef */
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';

import axios from 'axios';
import FormData from 'form-data';

import config from '../../../config';
import ApiError from '../../errors/ApiError';
import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { FILEUPLOADE_FILTERABLE_FIELDS } from './consent.fileUploade';
import { IFileUploade } from './interface.fileUploade';
import { FileUploadeService } from './service.fileUploade';

// import { z } from 'zod'
const uploadeImgbbSingleFile = catchAsync(
  async (req: Request, res: Response) => {
    // Check if req.file is defined
    if (!req.file) {
      throw new ApiError(404,"No file uploaded")
    }
    // Upload to ImgBB
    const formData = new FormData();
    formData.append('image', req.file.buffer.toString('base64'));

    const imgbbResponse = await axios.post(
      `https://api.imgbb.com/1/upload?key=${config.imgbb_key}&folder=${"sampod"}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    // Extract relevant information from the Axios response
    const { data } = imgbbResponse;
    sendResponse<any>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull uploade single file imgbb',
      data: data?.data,
    });
  }
);
const uploadeSingleFileByServer = catchAsync(
  async (req: Request, res: Response) => {
    const fileDetails = req.file;

    const apiKey = '614779edaf6e29425b8b29401cf9288f';

    try {
      const formData = new FormData();
      formData.append('image', req.file?.buffer?.toString('base64'), {
        filename: req.file?.filename || 'djkfsdf',
      });

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // const imageUrl = response?.data?.data?.url;
      console.log(response.data);
    } catch (error) {
      console.log('🚀 ~ file: constroller.fileUploade.ts:37 ~ error:', error);
    }
    const file = {
      filename: fileDetails?.filename,
      mimetype: fileDetails?.mimetype,
      destination: fileDetails?.destination,
      path:
        fileDetails?.fieldname === 'image'
          ? `uploadFile/images`
          : `uploadFile/vedios`,
      size: fileDetails?.size,
    };

    console.log(fileDetails, '29 conste');
    sendResponse<any>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull uploade single file',
      data: file,
    });
  }
);

const uploadeProfileFileByServer = catchAsync(
  async (req: Request, res: Response) => {
    const fileDetails = req.file;
    const file = {
      filename: fileDetails?.filename,
      mimetype: fileDetails?.mimetype,
      destination: fileDetails?.destination,
      path:
        fileDetails?.fieldname === 'image'
          ? `uploadFile/profile`
          : `uploadFile/vedios`,
      size: fileDetails?.size,
    };
    sendResponse<any>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull uploade single file',
      data: file,
    });
  }
);

const uploadeMultipalFileByServer = catchAsync(
  async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    const filesDetailes = files?.map(value => ({
      filename: value?.filename,
      mimetype: value?.mimetype,
      destination: value?.destination,
      path:
        value?.fieldname === 'images'
          ? `uploadFile/images`
          : `uploadFile/vedios`,
      size: value?.size,
    }));
    sendResponse<any>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull uploade single file',
      data: filesDetailes,
    });
  }
);

const createFileUploade = catchAsync(async (req: Request, res: Response) => {
  const { ...FileUploadeData } = req.body;
  req.body.userId = req?.user?._id;
  const result = await FileUploadeService.createFileUploadeByDb(
    FileUploadeData
  );

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
    Object.entries(queryObject).filter(([_, value]) => Boolean(value))
  );
  const filters = pick(queryObject, FILEUPLOADE_FILTERABLE_FIELDS);

  //****************pagination start************ */

  const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

  const result = await FileUploadeService.getAllFileUploadeFromDb(
    filters,
    paginationOptions
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
    updateData
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
  uploadeImgbbSingleFile,
  uploadeSingleFileByServer,
  uploadeProfileFileByServer,
  uploadeMultipalFileByServer,
};
