"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoContestUserRoute = void 0;
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const validateRequestZod_1 = __importDefault(require("../../middlewares/validateRequestZod"));
const photoContest_constroller_1 = require("./photoContest.constroller");
const photoContest_validation_1 = require("./photoContest.validation");
const router = express_1.default.Router();
router
    .route('/')
    .get(photoContest_constroller_1.PhotoContestUserController.getAllPhotoContestUser)
    .post((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.GENERAL_USER), (0, validateRequestZod_1.default)(photoContest_validation_1.PhotoContestUserValidation.createPhotoContestUserZodSchema), photoContest_constroller_1.PhotoContestUserController.createPhotoContestUser);
router
    .route('/winner/:id')
    //after winner list
    // .get(PhotoContestUserController)
    .put((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), (0, validateRequestZod_1.default)(photoContest_validation_1.PhotoContestUserValidation.updatePhotoContestUserWinner), photoContest_constroller_1.PhotoContestUserController.updatePhotoContestUser);
router
    .route('/voie-message-share/:id')
    //after winner list
    // .get(PhotoContestUserController)
    .put((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.GENERAL_USER), (0, validateRequestZod_1.default)(photoContest_validation_1.PhotoContestUserValidation.createPhotoContestVoteZodSchema), photoContest_constroller_1.PhotoContestUserController.voteMassageSharePhotoContestUser);
router
    .route('/:id')
    .get(photoContest_constroller_1.PhotoContestUserController.getSinglePhotoContestUser)
    .put((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.GENERAL_USER), (0, validateRequestZod_1.default)(photoContest_validation_1.PhotoContestUserValidation.updatePhotoContestUserZodSchema), photoContest_constroller_1.PhotoContestUserController.updatePhotoContestUser)
    .delete((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.GENERAL_USER), photoContest_constroller_1.PhotoContestUserController.deletePhotoContestUser);
exports.PhotoContestUserRoute = router;
