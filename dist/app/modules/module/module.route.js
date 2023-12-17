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
const module_constroller_1 = require("./module.constroller");
const module_validation_1 = require("./module.validation");
const router = express_1.default.Router();
router
    .route('/')
    .get(module_constroller_1.ModuleController.getAllModule)
    .post((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequestZod_1.default)(module_validation_1.moduleValidation.createModuleZodSchema), module_constroller_1.ModuleController.createModule);
router
    .route('/:id')
    .get(module_constroller_1.ModuleController.getSingleModule)
    .put((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequestZod_1.default)(module_validation_1.moduleValidation.updateModuleZodSchema), module_constroller_1.ModuleController.updateModule)
    .delete((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.SUPER_ADMIN), module_constroller_1.ModuleController.deleteModule);
exports.ModuleRoute = router;
