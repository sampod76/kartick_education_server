"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizRoute = void 0;
const express_1 = __importDefault(require("express"));
const validateRequestZod_1 = __importDefault(require("../../middlewares/validateRequestZod"));
const quiz_constroller_1 = require("./quiz.constroller");
const quiz_validation_1 = require("./quiz.validation");
const router = express_1.default.Router();
router
    .route('/')
    .get(quiz_constroller_1.QuizController.getAllQuiz)
    .post((0, validateRequestZod_1.default)(quiz_validation_1.QuizValidation.createQuizZodSchema), quiz_constroller_1.QuizController.createQuiz);
router
    .route('/:id')
    .get(quiz_constroller_1.QuizController.getSingleQuiz)
    .put((0, validateRequestZod_1.default)(quiz_validation_1.QuizValidation.updateQuizZodSchema), quiz_constroller_1.QuizController.updateQuiz)
    .delete(quiz_constroller_1.QuizController.deleteQuiz);
exports.QuizRoute = router;
