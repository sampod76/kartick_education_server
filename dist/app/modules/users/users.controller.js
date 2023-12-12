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
exports.UserController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const users_1 = require("../../../enums/users");
const catchAsync_1 = __importDefault(require("../../share/catchAsync"));
const sendResponse_1 = __importDefault(require("../../share/sendResponse"));
const users_service_1 = require("./users.service");
// import { IUser } from './users.interface';
const createGeneralUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { password } = _a, generalUser = __rest(_a, ["password"]);
    const userData = {
        email: generalUser.email,
        password,
        role: users_1.ENUM_USER_ROLE.GENERAL_USER,
    };
    const result = yield users_service_1.UserServices.createGeneralUserFromdb(generalUser, userData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull create user',
        data: result,
    });
}));
const createModerator = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _b = req.body, { password } = _b, moderator = __rest(_b, ["password"]);
    const userData = {
        email: moderator.email,
        password,
        role: users_1.ENUM_USER_ROLE.MODERATOR,
    };
    const result = yield users_service_1.UserServices.createModeratorFromDb(moderator, userData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'user Moderator successfully!',
        data: result,
    });
}));
const createAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _c = req.body, { password } = _c, adminData = __rest(_c, ["password"]);
    const userData = {
        email: adminData.email,
        password,
        role: users_1.ENUM_USER_ROLE.ADMIN,
    };
    const result = yield users_service_1.UserServices.createAdminFromDb(adminData, userData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Admin created successfully!',
        data: result,
    });
}));
exports.UserController = {
    createGeneralUser,
    createModerator,
    createAdmin,
};
