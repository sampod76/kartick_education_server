"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRoute = void 0;
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const validateRequestZod_1 = __importDefault(require("../../middlewares/validateRequestZod"));
const constroller_notification_1 = require("./constroller.notification");
const validation_notification_1 = require("./validation.notification");
const router = express_1.default.Router();
router
    .route('/')
    // This route is open
    .get(constroller_notification_1.NotificationController.getAllNotification)
    .post((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), (0, validateRequestZod_1.default)(validation_notification_1.NotificationValidation.createNotificationZodSchema), constroller_notification_1.NotificationController.createNotification);
router
    .route('/:id')
    // This route is open
    .get(constroller_notification_1.NotificationController.getSingleNotification)
    .put((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), (0, validateRequestZod_1.default)(validation_notification_1.NotificationValidation.updateNotificationZodSchema), constroller_notification_1.NotificationController.updateNotification)
    .delete((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), constroller_notification_1.NotificationController.deleteNotification);
exports.NotificationRoute = router;
