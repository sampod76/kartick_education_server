/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import { Request, RequestHandler } from 'express';

import multer, { FileFilterCallback, StorageEngine } from 'multer';
import path from 'path';
// import express from 'express';

//*******************note********* */
// create multer.d.ts

//*******************note********* */

// ! ---- upload only imgbb helper ---------------------
const storageFack = multer.memoryStorage();
export const multerImgbbUploder = multer({ storage: storageFack });



//!-------------single file upload----start------------
const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req);
    cb(null, path.join(__dirname, '../../uploadFile/images/'));
  },
  filename: (
    req,
    file: { originalname: string },
    cb: (arg0: null, arg1: string) => any
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
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  console.log(file);
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

export const uploadSingleImage: RequestHandler = multer({
  storage: storage,
  limits: {
    fileSize: 30 * 1024 * 1024, // 30 MB
  },
  fileFilter: fileFilter,
}).single('image');
//-------------single file upload----end------------





//!-------------single file upload----start------------
const storageByProfile: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploadFile/images/'));
  },
  filename: (
    req,
    file: { originalname: string },
    cb: (arg0: null, arg1: string) => any
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

const fileFilterByProfile = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
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

export const uploadSingleImageByProfile: RequestHandler = multer({
  storage: storageByProfile,
  limits: {
    fileSize: 30 * 1024 * 1024, // 30 MB
  },
  fileFilter: fileFilterByProfile,
}).single('image');
//-------------single file upload----end------------





//------------upload multiple images-----------------
const storageMultiple: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploadFile/images/'));
  },
  filename: (req, file, cb) => {
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

const fileFilterMultiple = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
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

export const uploadMultipleImage: RequestHandler = multer({
  storage: storageMultiple,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200 MB
  },
  fileFilter: fileFilterMultiple,
}).array('images', 10);
//------------upload multiple images--end---------------




//!-----------upload multiple photo-contest---start---------------
const storageMultiplePhotoContest: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploadFile/photo-contest/'));
  },
  filename: (req, file, cb) => {
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

const fileFilterMultiplePhotoContest = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
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

export const uploadMultiplePhotoContestImage: RequestHandler = multer({
  storage: storageMultiplePhotoContest,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
  fileFilter: fileFilterMultiplePhotoContest,
}).array('images', 10);


//!------------upload multiple-photo-contest--end---------------



//------------upload video file ---start-----------
const videoStorage: StorageEngine = multer.diskStorage({
  destination: (req: any, file: any, cb: (arg0: null, arg1: string) => any) => {
    cb(null, path.join(__dirname, '../uploadFile/vedio/'));
  },
  filename: (
    req: any,
    file: { originalname: string },
    cb: (arg0: null, arg1: string) => any
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

const fileFilterVideo = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype === 'video/mp4') {
    cb(null, true);
  } else {
    cb(new Error('Only mp4 format is allowed!'));
  }
};

export const uploadVideoFile: RequestHandler = multer({
  storage: videoStorage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200 MB
  },
  fileFilter: fileFilterVideo,
}).single('vedio');
//------------upload video file --end---------------
