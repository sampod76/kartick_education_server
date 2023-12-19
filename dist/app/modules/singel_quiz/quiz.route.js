"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonRoute = void 0;
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const validateRequestZod_1 = __importDefault(require("../../middlewares/validateRequestZod"));
const quiz_constroller_1 = require("./quiz.constroller");
const quiz_validation_1 = require("./quiz.validation");
const router = express_1.default.Router();
router
    .route('/')
    .get(quiz_constroller_1.LessonController.getAllLesson)
    .post((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequestZod_1.default)(quiz_validation_1.LessonValidation.createLessonZodSchema), quiz_constroller_1.LessonController.createLesson);
router
    .route('/:id')
    .get(quiz_constroller_1.LessonController.getSingleLesson)

    .patch((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequestZod_1.default)(quiz_validation_1.LessonValidation.updateLessonZodSchema), quiz_constroller_1.LessonController.updateLesson)

    .delete((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.SUPER_ADMIN), quiz_constroller_1.LessonController.deleteLesson);
exports.LessonRoute = router;
