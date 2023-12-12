"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModeratorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const validateRequestZod_1 = __importDefault(require("../../middlewares/validateRequestZod"));
const moderator_controller_1 = require("./moderator.controller");
const moderator_validations_1 = require("./moderator.validations");
const router = express_1.default.Router();
router
    .route('/')
    .post((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), moderator_controller_1.ModeratorController.createModerator)
    .get((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), moderator_controller_1.ModeratorController.getAllModerators);
router
    .route('/:id')
    .get((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.MODERATOR), moderator_controller_1.ModeratorController.getSingleModerator)
    .put((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.MODERATOR), (0, validateRequestZod_1.default)(moderator_validations_1.ModeratorValidation.updateModeratorZodSchema), moderator_controller_1.ModeratorController.updateModerator)
    .delete((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), moderator_controller_1.ModeratorController.deleteModerator);
exports.ModeratorRoutes = router;
