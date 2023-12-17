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
exports.ModeratorController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../share/catchAsync"));
const pick_1 = __importDefault(require("../../share/pick"));
const moderator_constant_1 = require("./moderator.constant");
const pagination_1 = require("../../../constant/pagination");
const moderator_service_1 = require("./moderator.service");
const sendResponse_1 = __importDefault(require("../../share/sendResponse"));
const getAllModerators = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, moderator_constant_1.ModeratorFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.PAGINATION_FIELDS);
    const result = yield moderator_service_1.ModeratorService.getAllModeratorsDB(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'faculties retrieved successfully !',
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleModerator = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield moderator_service_1.ModeratorService.getSingleModeratorDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Moderator retrieved successfully !',
        data: result,
    });
}));
const updateModerator = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updatedData = req.body;
    const result = yield moderator_service_1.ModeratorService.updateModeratorDB(id, updatedData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Moderator updated successfully !',
        data: result,
    });
}));
const deleteModerator = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield moderator_service_1.ModeratorService.deleteModeratorDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Moderator deleted successfully !',
        data: result,
    });
}));
exports.ModeratorController = {
    getAllModerators,
    getSingleModerator,
    updateModerator,
    deleteModerator,
};
