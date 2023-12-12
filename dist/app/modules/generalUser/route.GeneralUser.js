"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralUserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const validateRequestZod_1 = __importDefault(require("../../middlewares/validateRequestZod"));
const controller_GeneralUser_1 = require("./controller.GeneralUser");
const validation_GeneralUser_1 = require("./validation.GeneralUser");
const router = express_1.default.Router();
router
    .route('/')
    .get((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), controller_GeneralUser_1.GeneralUserController.getAllGeneralUsers)
    // sign up user
    .post((0, validateRequestZod_1.default)(validation_GeneralUser_1.GeneralUserValidation.createGeneralUserByFirebaseZodSchema), controller_GeneralUser_1.GeneralUserController.createGeneralUserByFirebase);
// general user create by admin
router
    .route('/create-general-user-by-admin')
    .post((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), controller_GeneralUser_1.GeneralUserController.createGeneralUserByAdmin);
router
    .route('/get-course/:id')
    .get((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.GENERAL_USER), controller_GeneralUser_1.GeneralUserController.getSingleGeneralUserToCourse);
router
    .route('/update-course-quiz/:id')
    .put((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.GENERAL_USER), controller_GeneralUser_1.GeneralUserController.updateCourseVedioOrQuiz);
router
    .route('/:id')
    .get((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.GENERAL_USER), controller_GeneralUser_1.GeneralUserController.getSingleGeneralUser)
    .delete((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), controller_GeneralUser_1.GeneralUserController.deleteGeneralUser)
    .put((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.GENERAL_USER), (0, validateRequestZod_1.default)(validation_GeneralUser_1.GeneralUserValidation.updateGeneralUserZodSchema), controller_GeneralUser_1.GeneralUserController.updateGeneralUser);
exports.GeneralUserRoutes = router;
