"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Purchased_coursesRoute = void 0;
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const validateRequestZod_1 = __importDefault(require("../../middlewares/validateRequestZod"));
const purchased_courses_controller_1 = require("./purchased_courses.controller");
const purchased_courses_validation_1 = require("./purchased_courses.validation");
const router = express_1.default.Router();
router
    .route('/')
    .get((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), purchased_courses_controller_1.Purchased_coursesController.getAllPurchased_courses)
    .post((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.GENERAL_USER), (0, validateRequestZod_1.default)(purchased_courses_validation_1.PurchasedCoursesValidation.cteateZodPurchasedCoursesSchema), purchased_courses_controller_1.Purchased_coursesController.createPurchased_courses);
router
    .route('/:id')
    .get((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.GENERAL_USER), purchased_courses_controller_1.Purchased_coursesController.getSinglePurchased_courses)
    .put((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), (0, validateRequestZod_1.default)(purchased_courses_validation_1.PurchasedCoursesValidation.updateZodPurchasedCoursesSchema), purchased_courses_controller_1.Purchased_coursesController.updatePurchased_courses)
    .delete((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), purchased_courses_controller_1.Purchased_coursesController.deletePurchased_courses);
exports.Purchased_coursesRoute = router;
