"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadeController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../constant/pagination");
// import { globalImport } from '../../../import/global_Import';
// import ApiError from '../../errors/ApiError';
const catchAsync_1 = __importDefault(require("../../share/catchAsync"));
const pick_1 = __importDefault(require("../../share/pick"));
const sendResponse_1 = __importDefault(require("../../share/sendResponse"));
const consent_fileUploade_1 = require("./consent.fileUploade");
const service_fileUploade_1 = require("./service.fileUploade");
// import { z } from 'zod'
const uploadeSingleFileByServer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fileDetails = req.file;
    const file = {
        filename: fileDetails === null || fileDetails === void 0 ? void 0 : fileDetails.filename,
        mimetype: fileDetails === null || fileDetails === void 0 ? void 0 : fileDetails.mimetype,
        destination: fileDetails === null || fileDetails === void 0 ? void 0 : fileDetails.destination,
        path: (fileDetails === null || fileDetails === void 0 ? void 0 : fileDetails.fieldname) === 'image'
            ? `uploadFile/images`
            : `uploadFile/vedios`,
        size: fileDetails === null || fileDetails === void 0 ? void 0 : fileDetails.size,
    };
    console.log(fileDetails, '29 conste');
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull uploade single file',
        data: file,
    });
}));
const uploadeProfileFileByServer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fileDetails = req.file;
    const file = {
        filename: fileDetails === null || fileDetails === void 0 ? void 0 : fileDetails.filename,
        mimetype: fileDetails === null || fileDetails === void 0 ? void 0 : fileDetails.mimetype,
        destination: fileDetails === null || fileDetails === void 0 ? void 0 : fileDetails.destination,
        path: (fileDetails === null || fileDetails === void 0 ? void 0 : fileDetails.fieldname) === 'image'
            ? `uploadFile/profile`
            : `uploadFile/vedios`,
        size: fileDetails === null || fileDetails === void 0 ? void 0 : fileDetails.size,
    };
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull uploade single file',
        data: file,
    });
}));
const uploadeMultipalFileByServer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    const filesDetailes = files === null || files === void 0 ? void 0 : files.map(value => ({
        filename: value === null || value === void 0 ? void 0 : value.filename,
        mimetype: value === null || value === void 0 ? void 0 : value.mimetype,
        destination: value === null || value === void 0 ? void 0 : value.destination,
        path: (value === null || value === void 0 ? void 0 : value.fieldname) === 'images'
            ? `uploadFile/images`
            : `uploadFile/vedios`,
        size: value === null || value === void 0 ? void 0 : value.size,
    }));
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull uploade single file',
        data: filesDetailes,
    });
}));
const createFileUploade = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const FileUploadeData = __rest(req.body, []);
    req.body.userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
    const result = yield service_fileUploade_1.FileUploadeService.createFileUploadeByDb(FileUploadeData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull create FileUploade',
        data: result,
    });
    // next();
    /* res.status(200).send({
        success: true,
        data: result,
        message: 'successfull create FileUploade FileUploade',
      }); */
}));
const getAllFileUploade = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //****************search and filter start******* */
    let queryObject = req.query;
    queryObject = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(queryObject).filter(([_, value]) => Boolean(value)));
    const filters = (0, pick_1.default)(queryObject, consent_fileUploade_1.FILEUPLOADE_FILTERABLE_FIELDS);
    //****************pagination start************ */
    const paginationOptions = (0, pick_1.default)(queryObject, pagination_1.PAGINATION_FIELDS);
    const result = yield service_fileUploade_1.FileUploadeService.getAllFileUploadeFromDb(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull Get FileUploade FileUploade',
        meta: result.meta,
        data: result.data,
    });
    // next();
}));
const getSingleFileUploade = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    /*   if (!globalImport.ObjectId.isValid(id)) {
        throw new ApiError(400, 'invalid id sampod');
      } */
    const result = yield service_fileUploade_1.FileUploadeService.getSingleFileUploadeFromDb(id);
    /* if (!result) {
        throw new ApiError(400, 'No data found');
      } */
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull get FileUploade FileUploade',
        data: result,
    });
}));
const updateFileUploade = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updateData = req.body;
    /*   if (!globalImport.ObjectId.isValid(id)) {
        throw new ApiError(400, 'invalid id sampod');
      } */
    const result = yield service_fileUploade_1.FileUploadeService.updateFileUploadeFromDb(id, updateData);
    /* if (!result) {
        throw new ApiError(400, 'No data found');
      } */
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull update FileUploade FileUploade',
        data: result,
    });
}));
const deleteFileUploade = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield service_fileUploade_1.FileUploadeService.deleteFileUploadeByIdFromDb(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull delete FileUploade FileUploade',
        data: result,
    });
}));
exports.FileUploadeController = {
    createFileUploade,
    getAllFileUploade,
    getSingleFileUploade,
    updateFileUploade,
    deleteFileUploade,
    uploadeSingleFileByServer,
    uploadeProfileFileByServer,
    uploadeMultipalFileByServer,
};
