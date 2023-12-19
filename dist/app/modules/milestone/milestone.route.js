"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MilestoneRoute = void 0;
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const validateRequestZod_1 = __importDefault(require("../../middlewares/validateRequestZod"));
const milestone_constroller_1 = require("./milestone.constroller");
const milestone_validation_1 = require("./milestone.validation");
const router = express_1.default.Router();
router
    .route('/')
    .get(milestone_constroller_1.MilestoneController.getAllMilestone)
    .post((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequestZod_1.default)(milestone_validation_1.MilestoneValidation.createMilestoneZodSchema), milestone_constroller_1.MilestoneController.createMilestone);
router
    .route('/:id')
    .get(milestone_constroller_1.MilestoneController.getSingleMilestone)
    .patch((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequestZod_1.default)(milestone_validation_1.MilestoneValidation.updateMilestoneZodSchema), milestone_constroller_1.MilestoneController.updateMilestone)
    .delete((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.SUPER_ADMIN), milestone_constroller_1.MilestoneController.deleteMilestone);
exports.MilestoneRoute = router;
