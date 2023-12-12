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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoContestUserController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../constant/pagination");
// import { globalImport } from '../../../import/global_Import';
// import ApiError from '../../errors/ApiError';
const catchAsync_1 = __importDefault(require("../../share/catchAsync"));
const pick_1 = __importDefault(require("../../share/pick"));
const sendResponse_1 = __importDefault(require("../../share/sendResponse"));
const photoContest_consent_1 = require("./photoContest.consent");
const photoContest_service_1 = require("./photoContest.service");
// import { z } from 'zod'
const createPhotoContestUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body, 'photo contest join 16 conteroller');
    const result = yield photoContest_service_1.PhotoContestUserService.createPhotoContestUserByDb(Object.assign({}, req.body));
    console.log(result, 'photo contest join 21 conteroller');
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull create  PhotoContestUser',
        data: result,
    });
    // next();
    /* res.status(200).send({
      success: true,
      data: result,
      message: 'successfull create  PhotoContestUser',
    }); */
}));
const getAllPhotoContestUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //****************search and filter start******* */
    let queryObject = req.query;
    queryObject = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(queryObject).filter(([_, value]) => Boolean(value)));
    const filters = (0, pick_1.default)(queryObject, photoContest_consent_1.PHOTOCONTEST_USER_FILTERABLE_FIELDS);
    //****************pagination start************ */
    const paginationOptions = (0, pick_1.default)(queryObject, pagination_1.PAGINATION_FIELDS);
    const result = yield photoContest_service_1.PhotoContestUserService.getAllPhotoContestUserFromDb(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull found PhotoContestUsers',
        meta: result.meta,
        data: result.data,
    });
    // next();
}));
const getSinglePhotoContestUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield photoContest_service_1.PhotoContestUserService.getSinglePhotoContestUserFromDb(id, req);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull get PhotoContestUser',
        data: result,
    });
}));
const updatePhotoContestUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updateData = req.body;
    const result = yield photoContest_service_1.PhotoContestUserService.updatePhotoContestUserFromDb(id, req, updateData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull update PhotoContestUser',
        data: result,
    });
}));
const voteMassageSharePhotoContestUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updateData = req.body;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = yield photoContest_service_1.PhotoContestUserService.voteMassageSharePhotoContestUserFromDb(id, req, updateData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull submit',
        // data: result,
    });
}));
const deletePhotoContestUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield photoContest_service_1.PhotoContestUserService.deletePhotoContestUserByIdFromDb(id, req);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull delete PhotoContestUser',
        data: result,
    });
}));
exports.PhotoContestUserController = {
    createPhotoContestUser,
    getAllPhotoContestUser,
    getSinglePhotoContestUser,
    updatePhotoContestUser,
    deletePhotoContestUser,
    voteMassageSharePhotoContestUser,
};
