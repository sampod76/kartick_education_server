/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import { Request, RequestHandler } from 'express';

import multer, { FileFilterCallback, StorageEngine } from 'multer';
import path from 'path';
// import express from 'express';

//*******************note********* */
// create multer.d.ts

//*******************note********* */

//-------------single file upload----start------------
const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
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

const fileFilter = (
  req: Request,
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

export const uploadSingleImage: RequestHandler = multer({
  storage: storage,
  limits: {
    fileSize: 30 * 1024 * 1024, // 30 MB
  },
  fileFilter: fileFilter,
}).single('image');
//!-------------single file upload----end------------

//-------------single file upload----start------------
const storageByProfile: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
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

const fileFilterByProfile = (
  req: Request,
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

export const uploadSingleImageByProfile: RequestHandler = multer({
  storage: storageByProfile,
  limits: {
    fileSize: 30 * 1024 * 1024, // 30 MB
  },
  fileFilter: fileFilterByProfile,
}).single('image');
//!-------------single file upload----end------------

//------------upload multiple images-----------------
const storageMultiple: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../../uploadFile/images/'));
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

export const uploadMultipleImage: RequestHandler = multer({
  storage: storageMultiple,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200 MB
  },
  fileFilter: fileFilterMultiple,
}).array('images', 10);
//!------------upload multiple images--end---------------

//------------upload video file ---start-----------
const videoStorage: StorageEngine = multer.diskStorage({
  destination: (req: any, file: any, cb: (arg0: null, arg1: string) => any) => {
    cb(null, path.join(__dirname, '../../../../uploadFile/videos/'));
  },
  filename: (
    req: any,
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

const fileFilterVideo = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (file.mimetype.includes('video')) {
    cb(null, true);
  } else {
    cb(new Error('Only mp4 format is allowed!'));
  }
};

export const uploadVideoFile: RequestHandler = multer({
  storage: videoStorage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 200 MB
  },
  fileFilter: fileFilterVideo,
}).single('video');

//------------upload pdf file ---start-----------
const pdfStorage: StorageEngine = multer.diskStorage({
  destination: (req: any, file: any, cb: (arg0: null, arg1: string) => any) => {
    cb(null, path.join(__dirname, '../../../../uploadFile/pdfs/'));
  },
  filename: (
    req: any,
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

const fileFilterPdf = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (file.mimetype === 'file/pdf' || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only pdf format is allowed!'));
  }
};

export const uploadPdfFile: any = multer({
  storage: pdfStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: fileFilterPdf,
});
//------------upload video file --end---------------

//------------upload audio file ---start-----------
const audioStorage: StorageEngine = multer.diskStorage({
  destination: (req: any, file: any, cb: (arg0: null, arg1: string) => any) => {
    cb(null, path.join(__dirname, '../../../../uploadFile/audios/'));
  },
  filename: (
    req: any,
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

const fileFilterAudio = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (file.mimetype === 'file/mpeg' || file.mimetype === 'audio/mpeg') {
    cb(null, true);
  } else {
    cb(new Error('Only pdf format is allowed!'));
  }
};

export const uploadAudioFile: RequestHandler = multer({
  storage: audioStorage,
  limits: {
    fileSize: 30 * 1024 * 1024, // 10 MB
  },
  fileFilter: fileFilterAudio,
}).single('audio');
//------------upload video file --end---------------
