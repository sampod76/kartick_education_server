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
exports.AdminService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../../helper/paginationHelper");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const admin_constant_1 = require("./admin.constant");
const admin_model_1 = require("./admin.model");
const crateAdminFromDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the Admin is exist
    const removeFalseValue = (obj) => {
        const falseValues = [undefined, '', 'undefined', null, 'null'];
        for (const key in obj) {
            if (falseValues.includes(obj[key])) {
                delete obj[key];
            }
        }
    };
    removeFalseValue(payload);
    const result = yield admin_model_1.Admin.create(payload);
    return result;
});
const getAllAdminsFromDb = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: admin_constant_1.adminSearchableFields.map(field => ({
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
    const result = yield admin_model_1.Admin.find(whereConditions)
        .populate('profileImage')
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield admin_model_1.Admin.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleAdminFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_model_1.Admin.findById(id).populate('profileImage');
    return result;
});
const updateAdminFromDb = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield admin_model_1.Admin.findById(id);
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Admin not found !');
    }
    const { name } = payload, AdminData = __rest(payload, ["name"]);
    const updatedAdminData = Object.assign({}, AdminData);
    if (name && Object.keys(name).length > 0) {
        Object.keys(name).forEach(key => {
            const nameKey = `name.${key}`;
            updatedAdminData[nameKey] = name[key];
        });
    }
    const result = yield admin_model_1.Admin.findOneAndUpdate({ id }, updatedAdminData, {
        new: true,
    });
    return result;
});
const deleteAdminFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_model_1.Admin.findOneAndDelete({ _id: id }, { runValidators: true, new: true });
    return result;
});
exports.AdminService = {
    getAllAdminsFromDb,
    crateAdminFromDb,
    getSingleAdminFromDb,
    updateAdminFromDb,
    deleteAdminFromDb,
};
