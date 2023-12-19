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
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const globalEnums_1 = require("../../../enums/globalEnums");
const jwtHelpers_1 = require("../../../helper/jwtHelpers");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const user_model_1 = require("../user/user.model");
const sendResetMail_1 = require("./sendResetMail");
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isUserExist = yield user_model_1.User.isUserExistMethod(email);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    // switch (isUserExist.status) {
    //   case ENUM_STATUS.DEACTIVATE:
    //     throw new ApiError(httpStatus.NOT_FOUND, 'Your account is deactivated');
    //   case ENUM_STATUS.BLOCK:
    //     throw new ApiError(
    //       httpStatus.NOT_FOUND,
    //       `Your account is blocked ${isUserExist?.blockingTimeout}`
    //     );
    //   default:
    //     null
    // }
    if (isUserExist.status === globalEnums_1.ENUM_STATUS.DEACTIVATE) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Your account is deactivated');
    }
    else if (isUserExist.status === globalEnums_1.ENUM_STATUS.BLOCK) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, `Your account is blocked ${isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.blockingTimeout}`);
    }
    if (isUserExist.password &&
        !(yield user_model_1.User.isPasswordMatchMethod(password, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is incorrect');
    }
    //create access token & refresh token
    const { email: existEmail, role } = isUserExist;
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ email: existEmail, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ email: existEmail, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    //verify token
    // invalid token - synchronous
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Refresh Token');
    }
    const { email } = verifiedToken;
    // console.log(verifiedToken,"email..........");
    // tumi delete hye gso  kintu tumar refresh token ase
    // checking deleted user's refresh token
    const isUserExist = yield user_model_1.User.isUserExistMethod(email);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    //generate new token
    if (isUserExist.status === globalEnums_1.ENUM_STATUS.DEACTIVATE) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Your account is deactivated');
    }
    else if (isUserExist.status === globalEnums_1.ENUM_STATUS.BLOCK) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, `Your account is blocked ${isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.blockingTimeout}`);
    }
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({
        email: isUserExist.email,
        role: isUserExist.role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        accessToken: newAccessToken,
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = payload;
    // // checking is user exist
    // const isUserExist = await User.isUserExist(user?.userId);
    //alternative way
    const isUserExist = yield user_model_1.User.findOne({ email: user === null || user === void 0 ? void 0 : user.email }).select('+password');
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    // checking old password
    if (isUserExist.password &&
        !(yield user_model_1.User.isPasswordMatchMethod(oldPassword, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Old Password is incorrect');
    }
    if (isUserExist.status === globalEnums_1.ENUM_STATUS.DEACTIVATE) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Your account is deactivated');
    }
    else if (isUserExist.status === globalEnums_1.ENUM_STATUS.BLOCK) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, `Your account is blocked ${isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.blockingTimeout}`);
    }
    // // hash password before saving
    // const newHashedPassword = await bcrypt.hash(
    //   newPassword,
    //   Number(config.bycrypt_salt_rounds)
    // );
    // const query = { id: user?.userId };
    // const updatedData = {
    //   password: newHashedPassword,  //
    //   needsPasswordChange: false,
    //   passwordChangedAt: new Date(), //
    // };
    // await User.findOneAndUpdate(query, updatedData);
    // data update
    isUserExist.password = newPassword;
    // isUserExist.needsPasswordChange = false;
    // updating using save()
    isUserExist.save();
});
const forgotPass = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield user_model_1.User.findById(payload.id).populate('admin', "");
    if (!profile) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User does not exist!');
    }
    // let profile = null;
    // if (user.role === ENUM_USER_ROLE.ADMIN) {
    //   profile = await Admin.findById(user.id);
    // } else if (user.role === ENUM_USER_ROLE.MODERATOR) {
    //   profile = await Moderator.findById(user.id);
    // } else if (user.role === ENUM_USER_ROLE.student) {
    //   profile = await Student.findById(user.id);
    // }
    // if (!profile) {
    //   throw new ApiError(httpStatus.BAD_REQUEST, 'Pofile not found!');
    // }
    if (!profile.email) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email not found!');
    }
    const passResetToken = yield jwtHelpers_1.jwtHelpers.createResetToken({ email: profile.email }, config_1.default.jwt.secret, '50m');
    const resetLink = config_1.default.resetlink + `token=${passResetToken}`;
    console.log('profile: ', profile);
    yield (0, sendResetMail_1.sendEmail)(profile.email, `
      <div>
        <p>Hi</p>
        <p>Your password reset link: <a href=${resetLink}>Click Here</a></p>
        <p>Thank you</p>
      </div>
  `);
    // return {
    //   message: "Check your email!"
    // }
});
const resetPassword = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, newPassword } = payload;
    const user = yield user_model_1.User.findById({ _id: id }, { _id: 1 });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User not found!');
    }
    const isVarified = yield jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    console.log(isVarified);
    const password = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bycrypt_salt_rounds));
    yield user_model_1.User.updateOne({ id }, { password });
});
exports.AuthService = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPass,
    resetPassword,
};
