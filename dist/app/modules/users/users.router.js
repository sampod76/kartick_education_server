"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const express_1 = __importDefault(require("express"));
const validateRequestZod_1 = __importDefault(require("../../middlewares/validateRequestZod"));
const users_controller_1 = require("./users.controller");
const users_validation_1 = require("./users.validation");
const validation_GeneralUser_1 = require("../generalUser/validation.GeneralUser");
const controller_GeneralUser_1 = require("../generalUser/controller.GeneralUser");
const router = express_1.default.Router();
router
    .route('/create-general-user')
    .post((0, validateRequestZod_1.default)(users_validation_1.UserValidation.createGeneralUserZodSchema), users_controller_1.UserController.createGeneralUser);
router
    .route('/sign-up')
    .post((0, validateRequestZod_1.default)(validation_GeneralUser_1.GeneralUserValidation.createGeneralUserByFirebaseZodSchema), controller_GeneralUser_1.GeneralUserController.createGeneralUserByFirebase);
router
    .route('/create-admin')
    .post((0, validateRequestZod_1.default)(users_validation_1.UserValidation.createAdminZodSchema), users_controller_1.UserController.createAdmin);
router
    .route('/create-moderator')
    .post((0, validateRequestZod_1.default)(users_validation_1.UserValidation.createModeratorZodSchema), users_controller_1.UserController.createModerator);
exports.UserRoute = router;
