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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModeratorService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-dgetAllFacultiesisable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../../helper/paginationHelper");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const user_model_1 = require("../user/user.model");
const moderator_constant_1 = require("./moderator.constant");
const moderator_model_1 = require("./moderator.model");
const getAllModeratorsDB = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: moderator_constant_1.ModeratorSearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield moderator_model_1.Moderator.find(whereConditions)
        .populate('course')
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield moderator_model_1.Moderator.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleModeratorDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield moderator_model_1.Moderator.findOne({ id })
        .populate('academicDepartment')
        .populate('academicModerator');
    return result;
});
const updateModeratorDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield moderator_model_1.Moderator.findOne({ id });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Moderator not found !');
    }
    const { name } = payload, ModeratorData = __rest(payload, ["name"]);
    const updatedModeratorData = Object.assign({}, ModeratorData);
    if (name && Object.keys(name).length > 0) {
        Object.keys(name).forEach(key => {
            const nameKey = `name.${key}`;
            updatedModeratorData[nameKey] = name[key];
        });
    }
    const result = yield moderator_model_1.Moderator.findOneAndUpdate({ id }, updatedModeratorData, {
        new: true,
    });
    return result;
});
const deleteModeratorDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the Moderator is exist
    const isExist = yield moderator_model_1.Moderator.findOne({ id });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Faculty not found !');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //delete faculty first
        const moderator = yield moderator_model_1.Moderator.findOneAndDelete({ id }, { session });
        if (!moderator) {
            throw new ApiError_1.default(404, 'Failed to delete student');
        }
        //delete user
        yield user_model_1.User.deleteOne({ id });
        session.commitTransaction();
        session.endSession();
        return moderator;
    }
    catch (error) {
        session.abortTransaction();
        throw error;
    }
});
exports.ModeratorService = {
    getAllModeratorsDB,
    getSingleModeratorDB,
    updateModeratorDB,
    deleteModeratorDB,
};
