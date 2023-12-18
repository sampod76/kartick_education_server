"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { errorLogger } from '../share/logger'
// import { logger } from '../share/logger'
const zod_1 = require("zod");
const config_1 = __importDefault(require("../../config"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const handleValidationError_1 = require("../errors/handleValidationError");
const handleZodError_1 = __importDefault(require("../errors/handleZodError"));
// import { errorLogger } from '../share/logger';
const http_status_1 = __importDefault(require("http-status"));
const handleCastError_1 = __importDefault(require("../errors/handleCastError"));
// import path from 'path';
//
const globalErrorHandler = (error, req, res, next) => {
    // config.env === 'development'
    //   ? console.log(`globalErrorHandler:`, error)
    //   : errorLogger.error(`globalErrorHandler:`, error);
    console.log(`globalErrorHandler:`, error);
    let statusCode = 500;
    let message = 'Something went wrong';
    // let errorMessage:Array<IGenericErrorMessage>= []
    let errorMessage = [];
    if ((error === null || error === void 0 ? void 0 : error.name) === 'ValidationError') {
        const simplifiedError = (0, handleValidationError_1.handleValidationError)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessage = simplifiedError.errorMessages;
    }
    else if (error instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessage = simplifiedError.errorMessages;
    }
    else if ((error === null || error === void 0 ? void 0 : error.name) === 'CastError') {
        const simplifiedError = (0, handleCastError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessage = simplifiedError.errorMessages;
    }
    else if ((error === null || error === void 0 ? void 0 : error.name) === 'JsonWebTokenError') {
        statusCode = http_status_1.default.UNAUTHORIZED;
        message = 'Unauthorized access';
        // errorMessage = "unauthorized access";
    }
    else if (error instanceof ApiError_1.default) {
        statusCode = error.statusCode;
        message = error.message;
        errorMessage = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    path: '',
                    message: error === null || error === void 0 ? void 0 : error.message,
                },
            ]
            : [];
    }
    //  else if (error instanceof Roleback) {
    //   statusCode = error.statusCode;
    //   message = error.message;
    //   errorMessage = error?.message
    //     ? [
    //         {
    //           path: '',
    //           message: error?.message,
    //         },
    //       ]
    //     : [];
    // }
    else if (error instanceof Error) {
        message = error.message;
        errorMessage = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    path: '',
                    message: error === null || error === void 0 ? void 0 : error.message,
                },
            ]
            : [];
    }
    res.status(statusCode).send({
        success: false,
        message,
        errorMessage,
        stack: config_1.default.env !== 'production' ? error === null || error === void 0 ? void 0 : error.stack : undefined,
    });
};
exports.default = globalErrorHandler;
