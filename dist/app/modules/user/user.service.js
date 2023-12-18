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
exports.UserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = __importDefault(require("../../../config/index"));
const users_1 = require("../../../enums/users");
const paginationHelper_1 = require("../../../helper/paginationHelper");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const admin_model_1 = require("../admin/admin.model");
const student_model_1 = require("../student/student.model");
const user_constant_1 = require("./user.constant");
const user_model_1 = require("./user.model");
const moderator_model_1 = require("../moderator/moderator.model");
const getAllUsers = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: user_constant_1.userSearchableFields.map(field => ({
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
        sortConditions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }
    //****************pagination end ***************/
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    /*
    const result = await Milestone.find(whereConditions)
      .sort(sortConditions)
      .skip(Number(skip))
      .limit(Number(limit));
    */
    const pipeline = [
        { $match: whereConditions },
        { $sort: sortConditions },
        { $skip: Number(skip) || 0 },
        { $limit: Number(limit) || 15 },
        {
            $lookup: {
                from: 'admins',
                let: { id: '$admin' },
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
                            __v: 0,
                        },
                    },
                ],
                as: 'adminDetails',
            },
        },
        {
            $project: { admin: 0 },
        },
        //মনে রাখতে হবে যদি এটি দেওয়া না হয় তাহলে সে যখন কোন একটি ক্যাটাগরির থাম্বেল না পাবে সে তাকে দেবে না
        {
            $addFields: {
                admin: {
                    $cond: {
                        if: { $eq: [{ $size: '$adminDetails' }, 0] },
                        then: [{}],
                        else: '$adminDetails',
                    },
                },
            },
        },
        {
            $project: { adminDetails: 0 },
        },
        {
            $unwind: '$admin',
        },
        {
            $lookup: {
                from: 'students',
                let: { id: '$student' },
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
                            __v: 0,
                        },
                    },
                ],
                as: 'studentDetails',
            },
        },
        {
            $project: { student: 0 },
        },
        {
            $addFields: {
                student: {
                    $cond: {
                        if: { $eq: [{ $size: '$studentDetails' }, 0] },
                        then: [{}],
                        else: '$studentDetails',
                    },
                },
            },
        },
        {
            $project: { studentDetails: 0 },
        },
        {
            $unwind: '$student',
        },
    ];
    const result = yield user_model_1.User.aggregate(pipeline);
    const total = yield user_model_1.User.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const createStudent = (student, user) => __awaiter(void 0, void 0, void 0, function* () {
    // default password
    if (!user.password) {
        user.password = index_1.default.default_student_pass;
    }
    const exist = yield user_model_1.User.isUserExistMethod(user.email);
    if (exist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User already exist');
    }
    // set role
    user.role = 'student';
    let newUserAllData = null;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //array
        const newStudent = yield student_model_1.Student.create([student], { session });
        if (!newStudent.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create student');
        }
        //set student -->  _id into user.student
        user.student = newStudent[0]._id;
        const newUser = yield user_model_1.User.create([user], { session });
        if (!newUser.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create user');
        }
        newUserAllData = newUser[0];
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    if (newUserAllData) {
        newUserAllData = yield user_model_1.User.findOne({ id: newUserAllData.id }).populate({
            path: 'student',
            // populate: [
            //   {
            //     path: 'academicSemester',
            //   },
            //   {
            //     path: 'academicDepartment',
            //   },
            //   {
            //     path: 'academicFaculty',
            //   },
            // ],
        });
    }
    return newUserAllData;
});
const createModerator = (moderator, user) => __awaiter(void 0, void 0, void 0, function* () {
    // default password
    if (!user.password) {
        user.password = index_1.default.default_moderator_pass;
    }
    const exist = yield user_model_1.User.isUserExistMethod(user.email);
    if (exist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User already exist');
    }
    // set role
    user.role = users_1.ENUM_USER_ROLE.MODERATOR;
    let newUserAllData = null;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const newModerator = yield moderator_model_1.Moderator.create([moderator], { session });
        if (!newModerator.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create moderator ');
        }
        user.moderator = newModerator[0]._id;
        const newUser = yield user_model_1.User.create([user], { session });
        if (!newUser.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create moderator');
        }
        newUserAllData = newUser[0];
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    if (newUserAllData) {
        newUserAllData = yield user_model_1.User.findOne({ id: newUserAllData.id }).populate({
            path: 'moderator',
            // populate: [
            //   {
            //     path: 'academicDepartment',
            //   },
            //   {
            //     path: 'academicFaculty',
            //   },
            // ],
        });
    }
    return newUserAllData;
});
const createAdmin = (admin, user) => __awaiter(void 0, void 0, void 0, function* () {
    // default password
    if (!user.password) {
        user.password = index_1.default.default_admin_pass;
    }
    const exist = yield user_model_1.User.isUserExistMethod(user.email);
    if (exist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User already exist');
    }
    // set role
    user.role = 'admin';
    let newUserAllData = null;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // const id = await generateAdminId();
        // user.id = id;
        // admin.id = id;
        const newAdmin = yield admin_model_1.Admin.create([admin], { session });
        if (!newAdmin.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create admin ');
        }
        user.admin = newAdmin[0]._id;
        const newUser = yield user_model_1.User.create([user], { session });
        if (!newUser.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create admin');
        }
        newUserAllData = newUser[0];
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    if (newUserAllData) {
        newUserAllData = yield user_model_1.User.findOne({ id: newUserAllData.id }).populate({
            path: 'admin',
        });
    }
    return newUserAllData;
});
exports.UserService = {
    createStudent,
    createModerator,
    createAdmin,
    getAllUsers,
};
