"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoute = void 0;
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const validateRequestZod_1 = __importDefault(require("../../middlewares/validateRequestZod"));
const constroller_category_1 = require("./constroller.category");
const validation_category_1 = require("./validation.category");
const router = express_1.default.Router();
router
    .route('/')
    // This route is open
    .get(constroller_category_1.CategoryController.getAllCategory)
    .post((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), (0, validateRequestZod_1.default)(validation_category_1.CategoryValidation.createCategoryZodSchema), constroller_category_1.CategoryController.createCategory);
router
    .route('/:id')
    // This route is open
    .get(constroller_category_1.CategoryController.getSingleCategory)
    .put((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), (0, validateRequestZod_1.default)(validation_category_1.CategoryValidation.updateCategoryZodSchema), constroller_category_1.CategoryController.updateCategory)
    .delete((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), constroller_category_1.CategoryController.deleteCategory);
exports.CategoryRoute = router;
