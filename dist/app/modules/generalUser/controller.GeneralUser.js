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
exports.GeneralUserController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const pagination_1 = require("../../../constant/pagination");
const users_1 = require("../../../enums/users");
const jwtHelpers_1 = require("../../../helper/jwtHelpers");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const catchAsync_1 = __importDefault(require("../../share/catchAsync"));
const pick_1 = __importDefault(require("../../share/pick"));
const sendResponse_1 = __importDefault(require("../../share/sendResponse"));
const constant_GeneralUser_1 = require("./constant.GeneralUser");
const service_GeneralUser_1 = require("./service.GeneralUser");
const getAllGeneralUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let queryObject = req.query;
    queryObject = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(queryObject).filter(([_, value]) => Boolean(value)));
    const filter = (0, pick_1.default)(queryObject, constant_GeneralUser_1.GeneralUserFilterableFields);
    const paginationOptions = (0, pick_1.default)(queryObject, pagination_1.PAGINATION_FIELDS);
    const result = yield service_GeneralUser_1.GeneralUserService.getAllGeneralUsersFromDb(filter, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'users found successfully !',
        meta: result.meta,
        data: result.data,
    });
}));
const createGeneralUserByFirebase = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.query);
    // if (!req.body?.uid && req.query?.setUid === 'yes') {
    //   req.body.uid = crypto.randomBytes(28).toString('hex');
    //   console.log(req.body.uid)
    // }
    const result = (yield service_GeneralUser_1.GeneralUserService.createGeneralUserByFirebaseFromDb(req.body));
    console.log(result, 'login apple 45 controller');
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'forbidden access!');
    }
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ _id: result === null || result === void 0 ? void 0 : result._id, role: result === null || result === void 0 ? void 0 : result.role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({
        _id: result === null || result === void 0 ? void 0 : result._id,
        role: result === null || result === void 0 ? void 0 : result.role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const cookieOptions = {
        // secure: config.env === 'production' ? true :false,
        //same
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    //এটার মাধ্যমে ক্লাইন সাইডে আমার পাঠানো রেসপন্স এর বাইরেও অটোমেটিকলি সে এই cookie সেট করে দেবে
    res.cookie('refreshToken', refreshToken, cookieOptions);
    // res.cookie('accessToken', accessToken, cookieOptions);
    // const result2 = { ...result.toObject() };
    res.status(200).send({
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'user found successfully !',
        // data:result,
        data: {
            _id: result === null || result === void 0 ? void 0 : result._id,
            name: result === null || result === void 0 ? void 0 : result.name,
            status: result === null || result === void 0 ? void 0 : result.status,
            email: result === null || result === void 0 ? void 0 : result.email,
            phone: result.phone,
            fcm_token: result === null || result === void 0 ? void 0 : result.fcm_token,
            // ...result,
            accessToken,
        },
    });
}));
//!------- only admin add course then create user---------
const createGeneralUserByAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (yield service_GeneralUser_1.GeneralUserService.createGeneralUserByFirebaseFromDb(req.body));
    console.log(result, 'login apple 45 controller');
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'forbidden access!');
    }
    res.status(200).send({
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'user found successfully !',
        // data:result,
        data: result,
    });
}));
//
const getSingleGeneralUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const id = req.params.id;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== users_1.ENUM_USER_ROLE.ADMIN && ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id) !== id) {
        throw new ApiError_1.default(500, 'unauthorise access!!');
    }
    const result = yield service_GeneralUser_1.GeneralUserService.getSingleGeneralUserFromDb(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'user found successfully !',
        data: result,
    });
}));
//single user _id to get all course and lession
const getSingleGeneralUserToCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield service_GeneralUser_1.GeneralUserService.getUserToCourseFromDb(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Course found successfully !',
        data: result,
    });
}));
const updateGeneralUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const id = req.params.id;
    const updatedData = req.body;
    if (((_c = req.user) === null || _c === void 0 ? void 0 : _c.role) !== users_1.ENUM_USER_ROLE.ADMIN && ((_d = req.user) === null || _d === void 0 ? void 0 : _d._id) !== id) {
        throw new ApiError_1.default(500, 'unauthorise access!!');
    }
    const result = yield service_GeneralUser_1.GeneralUserService.updateGeneralUserFromDb(id, updatedData, req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'user updated successfully !',
        data: result,
    });
}));
const updateCourseVedioOrQuiz = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updatedData = req.body;
    const result = yield service_GeneralUser_1.GeneralUserService.updateCourseVedioOrQuizFromDb(id, updatedData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Course or quiz updated successfully !',
        data: result,
    });
}));
const deleteGeneralUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield service_GeneralUser_1.GeneralUserService.deleteGeneralUserFromDb(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'user deleted successfully !',
        data: result,
    });
}));
exports.GeneralUserController = {
    createGeneralUserByFirebase,
    getAllGeneralUsers,
    getSingleGeneralUser,
    getSingleGeneralUserToCourse,
    updateCourseVedioOrQuiz,
    updateGeneralUser,
    deleteGeneralUser,
    createGeneralUserByAdmin
};
