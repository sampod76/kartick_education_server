"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadVideoFile = exports.uploadMultipleImage = exports.uploadSingleImageByProfile = exports.uploadSingleImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// import express from 'express';
//*******************note********* */
// create multer.d.ts
//*******************note********* */
//-------------single file upload----start------------
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        console.log(req);
        cb(null, path_1.default.join(__dirname, '../../uploadFile/images/'));
    },
    filename: (req, file, cb) => {
        const fileExt = path_1.default.extname(file.originalname);
        const fileName = file.originalname
            .replace(fileExt, '')
            .toLowerCase()
            .split(' ')
            .join('-') +
            '-' +
            Date.now();
        cb(null, fileName + fileExt);
    },
});
const fileFilter = (req, file, cb) => {
    console.log(file);
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(new Error('Only jpg, jpeg, png formats are allowed!'));
    }
};
exports.uploadSingleImage = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 30 * 1024 * 1024, // 30 MB
    },
    fileFilter: fileFilter,
}).single('image');
//-------------single file upload----end------------
//-------------single file upload----start------------
const storageByProfile = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '../../uploadFile/images/'));
    },
    filename: (req, file, cb) => {
        const fileExt = path_1.default.extname(file.originalname);
        const fileName = file.originalname
            .replace(fileExt, '')
            .toLowerCase()
            .split(' ')
            .join('-') +
            '-' +
            Date.now();
        cb(null, fileName + fileExt);
    },
});
const fileFilterByProfile = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(new Error('Only jpg, jpeg, png formats are allowed!'));
    }
};
exports.uploadSingleImageByProfile = (0, multer_1.default)({
    storage: storageByProfile,
    limits: {
        fileSize: 30 * 1024 * 1024, // 30 MB
    },
    fileFilter: fileFilterByProfile,
}).single('image');
//-------------single file upload----end------------
//------------upload multiple images-----------------
const storageMultiple = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '../../uploadFile/images/'));
    },
    filename: (req, file, cb) => {
        const fileExt = path_1.default.extname(file.originalname);
        const fileName = file.originalname
            .replace(fileExt, '')
            .toLowerCase()
            .split(' ')
            .join('-') +
            '-' +
            Date.now();
        cb(null, fileName + fileExt);
    },
});
const fileFilterMultiple = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(new Error('Only jpg, jpeg, png formats are allowed!'));
    }
};
exports.uploadMultipleImage = (0, multer_1.default)({
    storage: storageMultiple,
    limits: {
        fileSize: 200 * 1024 * 1024, // 200 MB
    },
    fileFilter: fileFilterMultiple,
}).array('images', 10);
//------------upload multiple images--end---------------
//------------upload video file ---start-----------
const videoStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '../uploadFile/vedio/'));
    },
    filename: (req, file, cb) => {
        const fileExt = path_1.default.extname(file.originalname);
        const fileName = file.originalname
            .replace(fileExt, '')
            .toLowerCase()
            .split(' ')
            .join('-') +
            '-' +
            Date.now();
        cb(null, fileName + fileExt);
    },
});
const fileFilterVideo = (req, file, cb) => {
    if (file.mimetype === 'video/mp4') {
        cb(null, true);
    }
    else {
        cb(new Error('Only mp4 format is allowed!'));
    }
};
exports.uploadVideoFile = (0, multer_1.default)({
    storage: videoStorage,
    limits: {
        fileSize: 200 * 1024 * 1024, // 200 MB
    },
    fileFilter: fileFilterVideo,
}).single('vedio');
//------------upload video file --end---------------
