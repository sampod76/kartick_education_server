"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRoute = void 0;
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const validateRequestZod_1 = __importDefault(require("../../middlewares/validateRequestZod"));
const course_constroller_1 = require("./course.constroller");
const course_validation_1 = require("./course.validation");
const router = express_1.default.Router();
router
    .route('/')
    .get(course_constroller_1.CourseController.getAllCourse)
    .post((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), (0, validateRequestZod_1.default)(course_validation_1.CourseValidation.createCourseZodSchema), course_constroller_1.CourseController.createCourse);
router
    .route('/review/:id')
    .post((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.GENERAL_USER), (0, validateRequestZod_1.default)(course_validation_1.CourseValidation.courseReviewZodSchema), course_constroller_1.CourseController.courseReviewsByUser)
    .delete((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), course_constroller_1.CourseController.deleteCourse);
router
    .route('/:id')
    .get(course_constroller_1.CourseController.getSingleCourse)
    .put((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), (0, validateRequestZod_1.default)(course_validation_1.CourseValidation.updateCourseZodSchema), course_constroller_1.CourseController.updateCourse)
    .delete((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), course_constroller_1.CourseController.deleteCourse);
exports.CourseRoute = router;
