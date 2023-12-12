"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.CourseService = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const paginationHelper_1 = require("../../../helper/paginationHelper");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const course_consent_1 = require("./course.consent");
const course_model_1 = require("./course.model");
const course_utils_1 = require("./course.utils");
const { ObjectId } = mongoose_1.default.Types;
const createCourseByDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.courseId = yield (0, course_utils_1.generateCourseId)();
    const result = (yield course_model_1.Course.create(payload)).populate([
        {
            path: 'publisher',
            select: {
                needsPasswordChange: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
            },
            // populate: [
            //   {
            //     path: 'moderator',
            //     select: { createdAt: 0, updatedAt: 0, __v: 0 },
            //   },
            //   {
            //     path: 'admin',
            //     select: { createdAt: 0, updatedAt: 0, __v: 0 },
            //   },
            // ],
        },
    ]);
    return result;
});
//getAllCourseFromDb
const getAllCourseFromDb = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    //****************search and filters start************/
    const { searchTerm, select } = filters, filtersData = __rest(filters, ["searchTerm", "select"]);
    // Split the string and extract field names
    const projection = {};
    if (select) {
        const fieldNames = select === null || select === void 0 ? void 0 : select.split(',').map(field => field.trim());
        // Create the projection object
        fieldNames.forEach(field => {
            projection[field] = 1;
        });
    }
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: course_consent_1.COURSE_SEARCHABLE_FIELDS.map(field => 
            //search array value
            field === 'tag'
                ? { [field]: { $in: [new RegExp(searchTerm, 'i')] } }
                : {
                    [field]: new RegExp(searchTerm, 'i'),
                }),
        });
    }
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => field === 'price'
                ? { [field]: { $gte: parseInt(value) } }
                : field === 'publisher'
                    ? { [field]: new mongoose_1.Types.ObjectId(value) }
                    : field === 'categoryDetails.category'
                        ? { [field]: new mongoose_1.Types.ObjectId(value) }
                        : { [field]: value }),
        });
    }
    //****************search and filters end**********/
    //****************pagination start **************/
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }
    //****************pagination end ***************/
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    /*
    const result = await Course.find(whereConditions)
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
                from: 'moderators',
                let: { id: '$publisher' },
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
                            _id: 1,
                            name: 1,
                            profileImage: 1,
                        },
                    },
                ],
                as: 'publisherDetails',
            },
        },
        ///***************** */ images field ******start
        {
            $lookup: {
                from: 'fileuploades',
                let: { conditionField: '$thumbnail' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$_id', '$$conditionField'], // The condition to match the fields
                            },
                        },
                    },
                    // Additional pipeline stages for the second collection (optional)
                    {
                        $project: {
                            createdAt: 0,
                            updatedAt: 0,
                            userId: 0,
                        },
                    },
                    {
                        $addFields: {
                            link: {
                                $concat: [
                                    process.env.REAL_HOST_SERVER_SIDE,
                                    '/',
                                    'images',
                                    '/',
                                    '$filename',
                                ],
                            },
                        },
                    },
                ],
                as: 'thumbnailInfo', // The field to store the matched results from the second collection
            },
        },
        {
            $project: { thumbnail: 0 },
        },
        //মনে রাখতে হবে যদি এটি দেওয়া না হয় তাহলে সে যখন কোন একটি ক্যাটাগরির থাম্বেল না পাবে সে তাকে দেবে না
        {
            $addFields: {
                thumbnail: {
                    $cond: {
                        if: { $eq: [{ $size: '$thumbnailInfo' }, 0] },
                        then: [{}],
                        else: '$thumbnailInfo',
                    },
                },
            },
        },
        {
            $project: {
                thumbnailInfo: 0,
            },
        },
        {
            $unwind: '$thumbnail',
        },
        ///***************** */ images field ******end*********
    ];
    let result = null;
    if (select) {
        result = yield course_model_1.Course.find({})
            .sort({ title: 1 })
            .select(Object.assign({}, projection));
    }
    else {
        result = yield course_model_1.Course.aggregate(pipeline);
    }
    const total = yield course_model_1.Course.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
// get single e form db
const getSingleCourseFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.Course.aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
            $lookup: {
                from: 'lessions',
                let: { id: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$course', '$$id'], // The condition to match the fields
                            },
                        },
                    },
                    { $sort: { serial_no: 1 } },
                    // Additional pipeline stages for the second collection (optional)
                    {
                        $project: {
                            vedio: 0,
                            createdAt: 0,
                            updatedAt: 0,
                            tag: 0,
                            description: 0,
                        },
                    },
                ],
                as: 'All_lessions', // The field to store the matched results from the second collection
            },
        },
        {
            $lookup: {
                from: 'quizzes',
                localField: 'courseId',
                foreignField: 'courseId',
                as: 'quizzes',
            },
        },
        ///***************** */ images field ******start
        {
            $lookup: {
                from: 'fileuploades',
                let: { conditionField: '$thumbnail' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$_id', '$$conditionField'], // The condition to match the fields
                            },
                        },
                    },
                    // Additional pipeline stages for the second collection (optional)
                    {
                        $project: {
                            createdAt: 0,
                            updatedAt: 0,
                            userId: 0,
                        },
                    },
                    {
                        $addFields: {
                            link: {
                                $concat: [
                                    process.env.REAL_HOST_SERVER_SIDE,
                                    '/',
                                    'images',
                                    '/',
                                    '$filename',
                                ],
                            },
                        },
                    },
                ],
                as: 'thumbnailInfo', // The field to store the matched results from the second collection
            },
        },
        {
            $project: { thumbnail: 0 },
        },
        //মনে রাখতে হবে যদি এটি দেওয়া না হয় তাহলে সে যখন কোন একটি ক্যাটাগরির থাম্বেল না পাবে সে তাকে দেবে না
        {
            $addFields: {
                thumbnail: {
                    $cond: {
                        if: { $eq: [{ $size: '$thumbnailInfo' }, 0] },
                        then: [{}],
                        else: '$thumbnailInfo',
                    },
                },
            },
        },
        {
            $project: {
                thumbnailInfo: 0,
            },
        },
        {
            $unwind: '$thumbnail',
        },
        ///***************** */ images field ******end*********
    ]);
    return result[0];
});
// update e form db
const updateCourseFromDb = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { publish } = payload, otherData = __rest(payload, ["publish"]);
    const updateData = Object.assign({}, otherData);
    console.log(updateData);
    if (publish && Object.keys(publish).length > 0) {
        Object.keys(publish).forEach(key => {
            const publishKey = `publish.${key}`; // `publish.status`
            updateData[publishKey] = publish[key];
        });
    }
    const result = yield course_model_1.Course.findOneAndUpdate({ _id: id }, updateData, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new ApiError_1.default(500, 'course update fail!!😪😭😰');
    }
    return result;
});
// delete e form db
const deleteCourseByIdFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.Course.findByIdAndDelete(id);
    return result;
});
// set user reviews e form db
const courseReviewsByUserFromDb = (id, payload, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { reviews } = payload;
    const result = yield course_model_1.Course.findOneAndUpdate({ _id: id, 'reviews.userId': { $ne: new mongoose_1.Types.ObjectId((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id) } }, {
        $push: {
            reviews: Object.assign(Object.assign({}, reviews), { userId: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b._id }),
        },
    }, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new ApiError_1.default(404, 'You cannot send review');
    }
    return result;
});
exports.CourseService = {
    createCourseByDb,
    getAllCourseFromDb,
    getSingleCourseFromDb,
    updateCourseFromDb,
    deleteCourseByIdFromDb,
    courseReviewsByUserFromDb,
};
