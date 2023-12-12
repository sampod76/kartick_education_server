"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessionRoute = void 0;
const express_1 = __importDefault(require("express"));
const validateRequestZod_1 = __importDefault(require("../../middlewares/validateRequestZod"));
const lession_constroller_1 = require("./lession.constroller");
const lession_validation_1 = require("./lession.validation");
const router = express_1.default.Router();
router
    .route('/')
    .get(lession_constroller_1.LessionController.getAllLession)
    .post((0, validateRequestZod_1.default)(lession_validation_1.LessionValidation.createLessionZodSchema), lession_constroller_1.LessionController.createLession);
router
    .route('/:id')
    .get(lession_constroller_1.LessionController.getSingleLession)
    .put((0, validateRequestZod_1.default)(lession_validation_1.LessionValidation.updateLessionZodSchema), lession_constroller_1.LessionController.updateLession)
    .delete(lession_constroller_1.LessionController.deleteLession);
exports.LessionRoute = router;
