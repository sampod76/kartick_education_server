"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunContestController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../constant/pagination");
// import { globalImport } from '../../../import/global_Import';
// import ApiError from '../../errors/ApiError';
const catchAsync_1 = __importDefault(require("../../share/catchAsync"));
const pick_1 = __importDefault(require("../../share/pick"));
const sendResponse_1 = __importDefault(require("../../share/sendResponse"));
const run_contest_service_1 = require("./run_contest.service");
const run_contest_consent_1 = require("./run_contest.consent");
// import { z } from 'zod'
const createRunContest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield run_contest_service_1.RunContestService.createRunContestByDb(Object.assign({}, req.body));
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull create  RunContest',
        data: result,
    });
    // next();
    /* res.status(200).send({
        success: true,
        data: result,
        message: 'successfull create  RunContest',
      }); */
}));
const getAllRunContest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //****************search and filter start******* */
    let queryObject = req.query;
    queryObject = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(queryObject).filter(([_, value]) => Boolean(value)));
    const filters = (0, pick_1.default)(queryObject, run_contest_consent_1.RUNCONTEST_FILTERABLE_FIELDS);
    //****************pagination start************ */
    const paginationOptions = (0, pick_1.default)(queryObject, pagination_1.PAGINATION_FIELDS);
    const result = yield run_contest_service_1.RunContestService.getAllRunContestFromDb(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull found RunContests',
        meta: result.meta,
        data: result.data,
    });
    // next();
}));
const getSingleRunContest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield run_contest_service_1.RunContestService.getSingleRunContestFromDb(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull get RunContest',
        data: result,
    });
}));
const updateRunContest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updateData = req.body;
    const result = yield run_contest_service_1.RunContestService.updateRunContestFromDb(id, req, updateData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull update RunContest',
        data: result,
    });
}));
const updateRunContestWinner = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id } = req.params;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updateData = req.body;
    const result = yield run_contest_service_1.RunContestService
        .updateRunContestWinnerFromDb();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull update RunContest',
        data: result,
    });
}));
const deleteRunContest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield run_contest_service_1.RunContestService.deleteRunContestByIdFromDb(id, req);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'successfull delete RunContest',
        data: result,
    });
}));
exports.RunContestController = {
    createRunContest,
    getAllRunContest,
    getSingleRunContest,
    updateRunContest,
    updateRunContestWinner,
    deleteRunContest,
};
