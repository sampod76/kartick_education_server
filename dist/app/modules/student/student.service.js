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
exports.StudentService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const globalEnums_1 = require("../../../enums/globalEnums");
const paginationHelper_1 = require("../../../helper/paginationHelper");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const user_model_1 = require("../user/user.model");
const student_constant_1 = require("./student.constant");
const student_model_1 = require("./student.model");
const getAllStudents = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: student_constant_1.studentSearchableFields.map(field => ({
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
    const result = yield student_model_1.Student.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield student_model_1.Student.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleStudent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield student_model_1.Student.findById({ _id: id });
    return result;
});
const updateStudent = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield student_model_1.Student.findById({ _id: id });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Student not found !');
    }
    const { name } = payload, studentData = __rest(payload, ["name"]);
    const updatedStudentData = Object.assign({}, studentData);
    if (name && Object.keys(name).length > 0) {
        Object.keys(name).forEach(key => {
            const nameKey = `name.${key}`; // `name.fisrtName`
            updatedStudentData[nameKey] = name[key];
        });
    }
    const result = yield student_model_1.Student.findOneAndUpdate({ id }, updatedStudentData, {
        new: true,
    });
    return result;
});
const deleteStudent = (id, filter) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the faculty is exist
    const isExist = yield student_model_1.Student.findById({ _id: id });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Student not found !');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        if (filter.delete == 'true') {
            session.startTransaction();
            //delete student first
            const student = yield student_model_1.Student.findOneAndDelete({ _id: id }, { session });
            if (!student) {
                throw new ApiError_1.default(404, 'Failed to delete student');
            }
            //delete user
            yield user_model_1.User.findOneAndDelete({ _id: id }, { session });
            session.commitTransaction();
            session.endSession();
            return student;
        }
        else {
            session.startTransaction();
            //delete student first
            const student = yield student_model_1.Student.findOneAndUpdate({ _id: id }, { status: globalEnums_1.ENUM_STATUS.DEACTIVATE }, { session });
            if (student) {
                throw new ApiError_1.default(404, 'Failed to delete student');
            }
            //delete user
            yield user_model_1.User.findOneAndUpdate({ email: isExist.email }, { status: globalEnums_1.ENUM_STATUS.DEACTIVATE }, { session });
            session.commitTransaction();
            session.endSession();
            return student;
        }
    }
    catch (error) {
        session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.StudentService = {
    getAllStudents,
    getSingleStudent,
    updateStudent,
    deleteStudent,
};
