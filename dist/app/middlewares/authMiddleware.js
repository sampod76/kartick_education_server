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
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const jwtHelpers_1 = require("../../helper/jwtHelpers");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const authMiddleware = (...requiredRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //get authorization token
        let verifiedUser = null;
        const token = req.headers.authorization;
        if (!token) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Unauthorized access');
        }
        // verify token only general user
        if (token) {
            verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
            req.user = verifiedUser;
        }
        // role diye guard korar jnno
        if (requiredRoles.length && !requiredRoles.includes(verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role)) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden access');
        }
        //chack token user
        // if (
        //   !(await User.isUserExist(verifiedUser?.email)) &&
        //   !(await GeneralUser.findOne({ uid: verifiedUser?.uid }))
        // ) {
        //   throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access');
        // }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.default = authMiddleware;
