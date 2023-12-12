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
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../../config"));
const users_1 = require("../../../enums/users");
const jwtHelpers_1 = require("../../../helper/jwtHelpers");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const admin_model_1 = require("../admin/admin.model");
const model_GeneralUser_1 = require("../generalUser/model.GeneralUser");
const moderator_model_1 = require("../moderator/moderator.model");
const users_model_1 = require("../users/users.model");
const loginUserFromDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    if (!(email && password)) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Email and password not provide');
    }
    const isUserExist = yield users_model_1.User.isUserExist(email === null || email === void 0 ? void 0 : email.toLowerCase());
    //chack user
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    //match password
    if (!(yield users_model_1.User.isPasswordMatched(password, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is incorrect');
    }
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({
        role: isUserExist.role,
        email: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.email,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({
        role: isUserExist.role,
        email: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.email,
    }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const loginUserByUidFromDb = (uid, role) => __awaiter(void 0, void 0, void 0, function* () {
    let isUserExist = null;
    if (uid && role === users_1.ENUM_USER_ROLE.ADMIN) {
        isUserExist = yield admin_model_1.Admin.findOne({ uid });
    }
    else if (role === users_1.ENUM_USER_ROLE.MODERATOR) {
        isUserExist = yield moderator_model_1.Moderator.findOne({ uid: uid });
    }
    else if (role === users_1.ENUM_USER_ROLE.GENERAL_USER) {
        isUserExist = yield model_GeneralUser_1.GeneralUser.findOne({ uid: uid });
    }
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({
        role: isUserExist.role,
        _id: isUserExist._id,
        email: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.email,
        name: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.name,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({
        role: isUserExist.role,
        _id: isUserExist._id,
        email: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.email,
        name: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.name,
    }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        isUserExist,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Refresh Token');
    }
    // //chack this user exist database
    // const isUserExist = await User.isUserExist(verifiedToken?.userId);
    let isUserExist = null;
    if (verifiedToken._id && verifiedToken.role === users_1.ENUM_USER_ROLE.ADMIN) {
        isUserExist = yield admin_model_1.Admin.findById(verifiedToken._id);
    }
    else if (verifiedToken.role === users_1.ENUM_USER_ROLE.MODERATOR) {
        isUserExist = yield moderator_model_1.Moderator.findById(verifiedToken._id);
    }
    else if (verifiedToken.role === users_1.ENUM_USER_ROLE.GENERAL_USER) {
        isUserExist = yield model_GeneralUser_1.GeneralUser.findById(verifiedToken._id);
    }
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    // generate new token
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({
        role: isUserExist.role,
        _id: isUserExist._id,
        email: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.email,
        name: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.name,
    }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken: newAccessToken,
    };
});
const myProfileFromDb = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    // //chack this user exist database
    // const isUserExist = await User.isUserExist(verifiedToken?.userId);
    let isUserExist = null;
    if (id && role === users_1.ENUM_USER_ROLE.ADMIN) {
        isUserExist = yield admin_model_1.Admin.findById(id);
    }
    else if (role === users_1.ENUM_USER_ROLE.MODERATOR) {
        isUserExist = yield moderator_model_1.Moderator.findById(id);
    }
    else if (role === users_1.ENUM_USER_ROLE.GENERAL_USER) {
        isUserExist = yield model_GeneralUser_1.GeneralUser.findById(id);
    }
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    // generate new token
    return isUserExist;
});
const updateProfileFromDb = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    // //chack this user exist database
    // const isUserExist = await User.isUserExist(verifiedToken?.userId);
    let isUserExist = null;
    if (((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.role) === users_1.ENUM_USER_ROLE.ADMIN) {
        isUserExist = yield admin_model_1.Admin.findOneAndUpdate({ _id: new mongoose_1.Types.ObjectId((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b._id) }, req.body, {
            new: true,
            runValidators: true,
        });
    }
    else if (((_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.role) === users_1.ENUM_USER_ROLE.MODERATOR) {
        isUserExist = yield moderator_model_1.Moderator.findOneAndUpdate({ _id: new mongoose_1.Types.ObjectId((_d = req === null || req === void 0 ? void 0 : req.user) === null || _d === void 0 ? void 0 : _d._id) }, req.body, {
            new: true,
            runValidators: true,
        });
    }
    else if (((_e = req === null || req === void 0 ? void 0 : req.user) === null || _e === void 0 ? void 0 : _e.role) === users_1.ENUM_USER_ROLE.GENERAL_USER) {
        isUserExist = yield model_GeneralUser_1.GeneralUser.findOneAndUpdate({ _id: new mongoose_1.Types.ObjectId((_f = req === null || req === void 0 ? void 0 : req.user) === null || _f === void 0 ? void 0 : _f._id) }, req.body, {
            new: true,
            runValidators: true,
        });
    }
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Update faild');
    }
    // generate new token
    return isUserExist;
});
exports.AuthService = {
    loginUserFromDb,
    loginUserByUidFromDb,
    myProfileFromDb,
    updateProfileFromDb,
    refreshToken,
};
