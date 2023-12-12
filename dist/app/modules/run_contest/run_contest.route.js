"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunContestRoute = void 0;
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const validateRequestZod_1 = __importDefault(require("../../middlewares/validateRequestZod"));
const run_contest_constroller_1 = require("./run_contest.constroller");
const run_contest_validation_1 = require("./run_contest.validation");
const router = express_1.default.Router();
router.route('/').get(run_contest_constroller_1.RunContestController.getAllRunContest).post((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), (0, validateRequestZod_1.default)(run_contest_validation_1.RunContestValidation.createRunContestZodSchema), run_contest_constroller_1.RunContestController.createRunContest);
router
    .route('/winners/:id')
    .put((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), (0, validateRequestZod_1.default)(run_contest_validation_1.RunContestValidation.updateRunContestZodSchema), run_contest_constroller_1.RunContestController.updateRunContestWinner);
router
    .route('/:id')
    .get((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.GENERAL_USER), run_contest_constroller_1.RunContestController.getSingleRunContest)
    .put((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), (0, validateRequestZod_1.default)(run_contest_validation_1.RunContestValidation.updateRunContestZodSchema), run_contest_constroller_1.RunContestController.updateRunContest)
    .delete((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.ADMIN), run_contest_constroller_1.RunContestController.deleteRunContest);
exports.RunContestRoute = router;
