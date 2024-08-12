/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import { v2 as cloudinary } from 'cloudinary';
import multer, { FileFilterCallback } from 'multer';
import { ICloudinaryResponse, IUploadFile } from '../interface/fileUpload';

import express from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import path from 'path';
import ApiError from '../errors/ApiError';

cloudinary.config({
  cloud_name: 'duyfxtcdd',
  api_key: '837558163211878',
  api_secret: '_gh7hRUUG5KcDz6GvsoVwDXE4U4',
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, 'uploadFile/images/');
    cb(null, path.join(__dirname, '../../../../uploadFile/images/'));
  },
  filename: (
    req,
    file: { originalname: string },
    cb: (arg0: null, arg1: string) => any,
  ) => {
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, '')
        .toLowerCase()
        .split(' ')
        .join('-') +
      '-' +
      Date.now();
    cb(null, fileName + fileExt);
  },
});
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, 'uploadFile/images/');
    cb(null, path.join(__dirname, '../../../../uploadFile/profile/'));
  },
  filename: (
    req,
    file: { originalname: string },
    cb: (arg0: null, arg1: string) => any,
  ) => {
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, '')
        .toLowerCase()
        .split(' ')
        .join('-') +
      '-' +
      Date.now();
    cb(null, fileName + fileExt);
  },
});

const fileFilter = (
  req: express.Request<ParamsDictionary, any, any, any, Record<string, any>>,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only jpg, jpeg, png formats are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 30 MB
  },
  fileFilter: fileFilter,
});
const profileUpload = multer({
  storage: profileStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 30 MB
  },
  fileFilter: fileFilter,
});

const uploadToCloudinary = async (
  file: IUploadFile,
): Promise<ICloudinaryResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      function (error: Error, result: ICloudinaryResponse) {
        // fs.unlinkSync(file.path);  // for after upload then remove it
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );
  });
};

const uploadToCloudinaryMultiple = async (
  files: IUploadFile[],
): Promise<ICloudinaryResponse[] | undefined> => {
  const uploadPromises = files.map(file => {
    return new Promise<ICloudinaryResponse>((resolve, reject) => {
      cloudinary.uploader.upload(
        file.path,
        function (error: Error, result: ICloudinaryResponse) {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
    });
  });

  try {
    return await Promise.all(uploadPromises);
  } catch (error) {
    //console.error('Error uploading to Cloudinary:', error);
    throw new ApiError(400, 'Error uploading to Cloudinary');
  }
};

const multipleFileUpload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB for each file
  },
  fileFilter: fileFilter,
});

export const FileUploadHelper = {
  uploadToCloudinary,
  uploadToCloudinaryMultiple,
  upload,
  profileUpload,
  multipleFileUpload,
};
