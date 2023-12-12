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
exports.AuthController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const users_1 = require("../../../enums/users");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const catchAsync_1 = __importDefault(require("../../share/catchAsync"));
const sendResponse_1 = __importDefault(require("../../share/sendResponse"));
const auth_service_1 = require("./auth.service");
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const _g = req.body, { uid, role = users_1.ENUM_USER_ROLE.GENERAL_USER } = _g, payload = __rest(_g, ["uid", "role"]);
    let result = null;
    if (uid) {
        result = yield auth_service_1.AuthService.loginUserByUidFromDb(uid, role);
    }
    else {
        result = yield auth_service_1.AuthService.loginUserFromDb(payload);
    }
    const { refreshToken } = result, othersData = __rest(result, ["refreshToken"]);
    // console.log(req.cookies, 13);
    // set refresh token into cookie
    const cookieOptions = {
        // secure: config.env === 'production' ? true : false,
        //same
        // secure: config.env === 'production',
        secure: true,
        httpOnly: true,
        // signed: true,
        sameSite: 'none',
    };
    //এটার মাধ্যমে ক্লাইন সাইডে আমার পাঠানো রেসপন্স এর বাইরেও অটোমেটিকলি সে এই cookie সেট করে দেবে
    res.cookie('refreshToken', refreshToken, cookieOptions);
    // res.cookie('accessToken', othersData.accessToken, cookieOptions);
    //set refre
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'successfull login',
        data: {
            _id: (_a = othersData === null || othersData === void 0 ? void 0 : othersData.isUserExist) === null || _a === void 0 ? void 0 : _a._id,
            name: (_b = othersData === null || othersData === void 0 ? void 0 : othersData.isUserExist) === null || _b === void 0 ? void 0 : _b.name,
            status: (_c = othersData === null || othersData === void 0 ? void 0 : othersData.isUserExist) === null || _c === void 0 ? void 0 : _c.status,
            email: (_d = othersData === null || othersData === void 0 ? void 0 : othersData.isUserExist) === null || _d === void 0 ? void 0 : _d.email,
            phone: (_e = othersData === null || othersData === void 0 ? void 0 : othersData.isUserExist) === null || _e === void 0 ? void 0 : _e.phone,
            role: (_f = othersData === null || othersData === void 0 ? void 0 : othersData.isUserExist) === null || _f === void 0 ? void 0 : _f.role,
            // ...result,
            accessToken: othersData.accessToken,
        },
    });
}));
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Token does not found');
    }
    const resultByAccessToken = yield auth_service_1.AuthService.refreshToken(refreshToken);
    const cookieOptions = {
        // secure: config.env === 'production' ? true :false,
        //same
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    //এটার মাধ্যমে ক্লাইন সাইডে আমার পাঠানো রেসপন্স এর বাইরেও অটোমেটিকলি সে এই cookie সেট করে দেবে
    res.cookie('refreshToken', refreshToken, cookieOptions);
    //set refre
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'successfull login',
        data: resultByAccessToken,
    });
}));
const myProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j;
    //set refre
    const result = yield auth_service_1.AuthService.myProfileFromDb((_h = req === null || req === void 0 ? void 0 : req.user) === null || _h === void 0 ? void 0 : _h._id, (_j = req === null || req === void 0 ? void 0 : req.user) === null || _j === void 0 ? void 0 : _j.role);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'successfull get profile',
        data: result,
    });
}));
const myProfileUpdate = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //set refre
    const result = yield auth_service_1.AuthService.updateProfileFromDb(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'successfull update profile',
        data: result,
    });
}));
exports.AuthController = {
    loginUser,
    refreshToken,
    myProfile,
    myProfileUpdate,
};
