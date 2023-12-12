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
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../../helper/paginationHelper");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const moderator_constant_1 = require("./moderator.constant");
const moderator_model_1 = require("./moderator.model");
const users_1 = require("../../../enums/users");
const getAllModeratorsFromDb = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: moderator_constant_1.moderatorSearchableFields.map(field => ({
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
        .populate('profileImage')
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
const getSingleModeratorFromDb = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== users_1.ENUM_USER_ROLE.ADMIN && ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id) !== id) {
        throw new ApiError_1.default(500, 'unauthorise access!!');
    }
    const result = yield moderator_model_1.Moderator.findOne({ _id: id });
    return result;
});
const updateModeratorFromDb = (id, payload, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    if (((_c = req.user) === null || _c === void 0 ? void 0 : _c.role) !== users_1.ENUM_USER_ROLE.ADMIN && ((_d = req.user) === null || _d === void 0 ? void 0 : _d._id) !== id) {
        throw new ApiError_1.default(500, 'unauthorise access!!');
    }
    const isExist = yield moderator_model_1.Moderator.findOne({ _id: id });
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
    const result = yield moderator_model_1.Moderator.findOneAndUpdate({ _id: id }, updatedModeratorData, {
        new: true,
    });
    return result;
});
const createModeratorFromDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const removeFalseValue = (obj) => {
        const falseValues = [undefined, '', 'undefined', null, 'null'];
        for (const key in obj) {
            if (falseValues.includes(obj[key])) {
                delete obj[key];
            }
        }
    };
    removeFalseValue(payload);
    const result = yield moderator_model_1.Moderator.create(payload);
    return result;
});
const deleteModeratorFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield moderator_model_1.Moderator.findOneAndDelete({ _id: id });
    return result;
});
exports.ModeratorService = {
    createModeratorFromDb,
    getAllModeratorsFromDb,
    getSingleModeratorFromDb,
    updateModeratorFromDb,
    deleteModeratorFromDb,
};
