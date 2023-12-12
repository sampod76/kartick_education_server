"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadeRoute = void 0;
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const uploader_multer_1 = require("../../middlewares/uploader.multer");
const validateRequestZod_1 = __importDefault(require("../../middlewares/validateRequestZod"));
const constroller_fileUploade_1 = require("./constroller.fileUploade");
const validation_fileUploade_1 = require("./validation.fileUploade");
const router = express_1.default.Router();
router
    .route('/uploade-single-image')
    .post((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.GENERAL_USER), uploader_multer_1.uploadSingleImage, constroller_fileUploade_1.FileUploadeController.uploadeSingleFileByServer);
router
    .route('/uploade-profile-image')
    .post((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.GENERAL_USER), uploader_multer_1.uploadSingleImageByProfile, constroller_fileUploade_1.FileUploadeController.uploadeProfileFileByServer);
router
    .route('/uploade-multipal-images')
    .post((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.GENERAL_USER), uploader_multer_1.uploadMultipleImage, constroller_fileUploade_1.FileUploadeController.uploadeMultipalFileByServer);
router
    .route('/uploade-vedio')
    .post((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.GENERAL_USER), uploader_multer_1.uploadVideoFile, constroller_fileUploade_1.FileUploadeController.uploadeSingleFileByServer);
// router.route('/uploade-multipal-vedios').post(
//   uploadMultipleImage, FileUploadeController.uploadeSingleFileByServer);
router
    .route('/')
    .get((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.GENERAL_USER), constroller_fileUploade_1.FileUploadeController.getAllFileUploade)
    .post((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.GENERAL_USER), (0, validateRequestZod_1.default)(validation_fileUploade_1.FileUploadeValidation.createFileUploadezodSchema), constroller_fileUploade_1.FileUploadeController.createFileUploade);
router
    .route('/:id')
    .get((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.GENERAL_USER), constroller_fileUploade_1.FileUploadeController.getSingleFileUploade)
    .put((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.GENERAL_USER), (0, validateRequestZod_1.default)(validation_fileUploade_1.FileUploadeValidation.updateFileUploadezodSchema), constroller_fileUploade_1.FileUploadeController.updateFileUploade)
    .delete(constroller_fileUploade_1.FileUploadeController.deleteFileUploade);
exports.FileUploadeRoute = router;
