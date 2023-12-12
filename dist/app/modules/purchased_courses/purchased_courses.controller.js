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
exports.Purchased_coursesController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../constant/pagination");
// import { globalImport } from '../../../import/global_Import';
// import ApiError from '../../errors/ApiError';
const catchAsync_1 = __importDefault(require("../../share/catchAsync"));
const pick_1 = __importDefault(require("../../share/pick"));
const sendResponse_1 = __importDefault(require("../../share/sendResponse"));
const purchased_courses_consent_1 = require("./purchased_courses.consent");
const purchased_courses_service_1 = require("./purchased_courses.service");
// import { z } from 'zod'
const createPurchased_courses = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Purchased_coursesData = __rest(req.body, []);
    const userId = Purchased_coursesData === null || Purchased_coursesData === void 0 ? void 0 : Purchased_coursesData.userId;
    const result = yield purchased_courses_service_1.Purchased_coursesService.createPurchased_coursesByDb(Purchased_coursesData, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull create  Purchased_courses',
        data: result,
    });
}));
const getAllPurchased_courses = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //****************search and filter start******* */
    let queryObject = req.query;
    queryObject = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(queryObject).filter(([_, value]) => Boolean(value)));
    const filters = (0, pick_1.default)(queryObject, purchased_courses_consent_1.PURCHASED_COURSES_FILTERABLE_FIELDS);
    //****************pagination start************ */
    const paginationOptions = (0, pick_1.default)(queryObject, pagination_1.PAGINATION_FIELDS);
    const result = yield purchased_courses_service_1.Purchased_coursesService.getAllPurchased_coursesFromDb(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull found Purchased_coursess',
        meta: result.meta,
        data: result.data,
    });
    // next();
}));
const getSinglePurchased_courses = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield purchased_courses_service_1.Purchased_coursesService.getSinglePurchased_coursesFromDb(id, req);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull get Purchased_courses',
        data: result,
    });
}));
const updatePurchased_courses = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updateData = req.body;
    const result = yield purchased_courses_service_1.Purchased_coursesService.updatePurchased_coursesFromDb(id, updateData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull update Purchased_courses',
        data: result,
    });
}));
const deletePurchased_courses = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield purchased_courses_service_1.Purchased_coursesService.deletePurchased_coursesByIdFromDb(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull delete Purchased_courses',
        data: result,
    });
}));
exports.Purchased_coursesController = {
    createPurchased_courses,
    getAllPurchased_courses,
    getSinglePurchased_courses,
    updatePurchased_courses,
    deletePurchased_courses,
};
