"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const validateRequestZod_1 = __importDefault(require("../../middlewares/validateRequestZod"));
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const users_1 = require("../../../enums/users");
const router = express_1.default.Router();
router.post('/login', (0, validateRequestZod_1.default)(auth_validation_1.AuthValidation.loginZodSchema), auth_controller_1.AuthController.loginUser);
router.post('/refresh-token', (0, validateRequestZod_1.default)(auth_validation_1.AuthValidation.refreshTokenZodSchema), auth_controller_1.AuthController.refreshToken);
router.post('/change-password', (0, validateRequestZod_1.default)(auth_validation_1.AuthValidation.changePasswordZodSchema), (0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.MODERATOR, users_1.ENUM_USER_ROLE.STUDENT), auth_controller_1.AuthController.changePassword);
// router.post(
//   '/forgot-password',
//   AuthController.forgotPass
// );
// router.post(
//   '/reset-password',
//   AuthController.resetPassword
// );
exports.AuthRoutes = router;
