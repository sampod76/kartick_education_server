"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
exports.GeneralUserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const users_1 = require("../../../enums/users");
const paginationHelper_1 = require("../../../helper/paginationHelper");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const logger_1 = require("../../share/logger");
const constant_GeneralUser_1 = require("./constant.GeneralUser");
const model_GeneralUser_1 = require("./model.GeneralUser");
// import { IPurchased_courses } from '../purchased_courses/purchased_courses.interface';
// const {ObjectId}=mongoose.Types
const createGeneralUserByFirebaseFromDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //
    const removeFalseValue = (obj) => {
        const falseValues = [undefined, '', 'undefined', null, 'null'];
        for (const key in obj) {
            if (falseValues.includes(obj[key])) {
                delete obj[key];
            }
        }
    };
    removeFalseValue(payload);
    //
    logger_1.logger.info({ payload, line: 'apple login 29 serveice' });
    let result = null;
    // if (payload.email) {
    result = yield model_GeneralUser_1.GeneralUser.findOne({ $or: [{ uid: payload === null || payload === void 0 ? void 0 : payload.uid }, { email: payload === null || payload === void 0 ? void 0 : payload.email }] });
    // } 
    //  if(!result?.uid) {
    // result = await GeneralUser.findOne({ uid: payload?.uid });
    // }
    if (!(result === null || result === void 0 ? void 0 : result.uid)) {
        // create new user
        result = yield model_GeneralUser_1.GeneralUser.create(payload);
    }
    else {
        const data = {
            fcm_token: payload === null || payload === void 0 ? void 0 : payload.fcm_token,
        };
        if (payload === null || payload === void 0 ? void 0 : payload.uid) {
            data.uid = payload === null || payload === void 0 ? void 0 : payload.uid;
        }
        if (payload === null || payload === void 0 ? void 0 : payload.email) {
            data.email = payload === null || payload === void 0 ? void 0 : payload.email;
        }
        result = yield model_GeneralUser_1.GeneralUser.findOneAndUpdate({ $or: [{ uid: payload === null || payload === void 0 ? void 0 : payload.uid }, { email: payload === null || payload === void 0 ? void 0 : payload.email }] }, data, { new: true, runValidators: true });
    }
    logger_1.logger.info({ result, line: "result, 'apple login 37 serveice" });
    return result;
});
const getAllGeneralUsersFromDb = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: constant_GeneralUser_1.GeneralUserSearchableFields.map(field => ({
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
    const result = yield model_GeneralUser_1.GeneralUser.find(whereConditions)
        .populate('profileImage')
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield model_GeneralUser_1.GeneralUser.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleGeneralUserFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_GeneralUser_1.GeneralUser.findById(id)
        .populate('purchase_courses.course', 'courseId title thumbnail createdAt')
        .populate('profileImage');
    return result;
});
// user to course
const getUserToCourseFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_GeneralUser_1.GeneralUser.aggregate([
        { $match: { _id: new mongoose_1.Types.ObjectId(id) } },
        {
            $unwind: '$purchase_courses', // এটার মাধ্যমে আমরা কোন একটা array multipal ভ্যালুগুলাকে তার parent সাথে  আলাদা আলাদা করে প্রত্যেকটা ডকুমেন্ট তৈরি করা
        },
        {
            $lookup: {
                from: 'courses',
                let: { id: '$purchase_courses.course' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$_id', '$$id'] },
                            // Additional filter conditions for collection2
                        },
                    },
                    // Additional stages for collection2
                    // প্রথম লুকাপ চালানোর পরে যে ডাটা আসছে তার উপরে যদি আমি যেই কোন কিছু করতে চাই তাহলে এখানে করতে হবে |যেমন আমি এখানে project করেছি
                    {
                        $project: {
                            password: 0,
                            document: 0,
                        },
                    },
                ],
                as: 'course',
            },
        },
        {
            $unwind: '$course', // এটার মাধ্যমে আমরা কোন একটা array multipal ভ্যালুগুলাকে তার parent সাথে  আলাদা আলাদা করে প্রত্যেকটা ডকুমেন্ট তৈরি করা
        },
        {
            $lookup: {
                from: 'lessions',
                let: { id: '$course._id' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$course', '$$id'] },
                            // Additional filter conditions for collection2
                        },
                    },
                ],
                as: 'lessions',
            },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                purchase_courses: 1,
                course: { _id: 1, title: 1, thumbnail: 1, price: 1 },
                lessions: { _id: 1, title: 1, vedio: 1, course: 1 },
            },
        },
    ]);
    return result;
});
// update user course vedio or quiz
const updateCourseVedioOrQuizFromDb = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { course_id, lessionId, quiz, learnedToday } = payload;
    let result = null;
    if (course_id && lessionId) {
        result = yield model_GeneralUser_1.GeneralUser.findOneAndUpdate({
            _id: id,
            'purchase_courses.course': course_id,
            'purchase_courses.total_completed_lessions': { $ne: lessionId },
        }, {
            $push: {
                'purchase_courses.$.total_completed_lessions': lessionId,
            },
            learnedToday,
        }, {
            new: true,
        });
    }
    if (quiz) {
        result = yield model_GeneralUser_1.GeneralUser.findOneAndUpdate({
            _id: new mongoose_1.Types.ObjectId(id),
            'purchase_courses.course': new mongoose_1.Types.ObjectId(course_id),
            // quiz: { $size: 0 },
        }, {
            $set: {
                'purchase_courses.$.quiz': quiz,
            },
        }, {
            new: true,
        });
        // .projection({name:1, active:1, purchase_courses:1});
    }
    if (!result) {
        throw new ApiError_1.default(400, 'Something is going wrong!!');
    }
    return result;
});
// module 15 --> 14,15 vedio
const updateGeneralUserFromDb = (id, payload, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const resultFind = (yield model_GeneralUser_1.GeneralUser.findById(id));
    if (!(resultFind === null || resultFind === void 0 ? void 0 : resultFind._id)) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'GeneralUser not found !');
    }
    if ((resultFind === null || resultFind === void 0 ? void 0 : resultFind._id) !== ((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id) ||
        req.user.role !== users_1.ENUM_USER_ROLE.ADMIN) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Unauthorise person!');
    }
    const GeneralUserData = __rest(payload, []);
    const updatedGeneralUserData = Object.assign({}, GeneralUserData);
    const result = yield model_GeneralUser_1.GeneralUser.findOneAndUpdate({ _id: id }, updatedGeneralUserData, {
        new: true,
    });
    return result;
});
const deleteGeneralUserFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_GeneralUser_1.GeneralUser.findByIdAndDelete(id);
    return result;
});
exports.GeneralUserService = {
    createGeneralUserByFirebaseFromDb,
    getAllGeneralUsersFromDb,
    getSingleGeneralUserFromDb,
    getUserToCourseFromDb,
    updateGeneralUserFromDb,
    updateCourseVedioOrQuizFromDb,
    deleteGeneralUserFromDb,
};
