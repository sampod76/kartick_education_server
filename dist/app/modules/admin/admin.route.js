"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const validateRequestZod_1 = __importDefault(require("../../middlewares/validateRequestZod"));
const admin_controller_1 = require("./admin.controller");
const admin_validations_1 = require("./admin.validations");
const router = express_1.default.Router();
router
    .route('/')
    .get((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), admin_controller_1.AdminController.getAllAdmins)
    .post((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), (0, validateRequestZod_1.default)(admin_validations_1.AdminValidation.createAdminZodSchema), admin_controller_1.AdminController.createAdmin);
router
    .route('/:id')
    .get((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), admin_controller_1.AdminController.getSingleAdmin)
    .put((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), (0, validateRequestZod_1.default)(admin_validations_1.AdminValidation.updateAdminZodSchema), admin_controller_1.AdminController.updateAdmin)
    .delete((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), admin_controller_1.AdminController.deleteAdmin);
exports.AdminRoutes = router;
