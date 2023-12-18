"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleRoute = void 0;
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const validateRequestZod_1 = __importDefault(require("../../middlewares/validateRequestZod"));
const lesson_constroller_1 = require("./lesson.constroller");
const lesson_validation_1 = require("./lesson.validation");
const router = express_1.default.Router();
router
    .route('/')
    .get(lesson_constroller_1.ModuleController.getAllModule)
    .post((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequestZod_1.default)(lesson_validation_1.moduleValidation.createModuleZodSchema), lesson_constroller_1.ModuleController.createModule);
router
    .route('/:id')
    .get(lesson_constroller_1.ModuleController.getSingleModule)
    .patch((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequestZod_1.default)(lesson_validation_1.moduleValidation.updateModuleZodSchema), lesson_constroller_1.ModuleController.updateModule)
    .delete((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.SUPER_ADMIN), lesson_constroller_1.ModuleController.deleteModule);
exports.ModuleRoute = router;
