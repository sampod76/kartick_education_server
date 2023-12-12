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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const mongoose_1 = require("mongoose");
const paginationHelper_1 = require("../../../helper/paginationHelper");
const consent_category_1 = require("./consent.category");
const model_category_1 = require("./model.category");
const createCategoryByDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (yield model_category_1.Category.create(payload)).populate('thumbnail');
    return result;
});
//getAllCategoryFromDb
const getAllCategoryFromDb = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    //****************search and filters start************/
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: consent_category_1.CATEGORY_SEARCHABLE_FIELDS.map(field => ({
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
    //****************search and filters end**********/
    //****************pagination start **************/
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }
    //****************pagination end ***************/
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    // const result = await Category.find(whereConditions)
    //   .populate('thumbnail')
    //   .sort(sortConditions)
    //   .skip(Number(skip))
    //   .limit(Number(limit));
    const pipeline = [
        { $match: whereConditions },
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
        { $sort: sortConditions },
        { $skip: Number(skip) || 0 },
        { $limit: Number(limit) || 15 },
    ];
    // console.log(pipeline);
    const result = yield model_category_1.Category.aggregate(pipeline);
    // console.log(result, 127);
    const total = yield model_category_1.Category.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
// get single Categorye form db
const getSingleCategoryFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const pipeline = [
        { $match: { _id: new mongoose_1.Types.ObjectId(id) } },
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
        ///
    ];
    const result = yield model_category_1.Category.aggregate(pipeline);
    return result[0];
});
// update Categorye form db
const updateCategoryFromDb = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_category_1.Category.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
});
// delete Categorye form db
const deleteCategoryByIdFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_category_1.Category.findByIdAndDelete(id).populate('thumbnail');
    return result;
});
exports.CategoryService = {
    createCategoryByDb,
    getAllCategoryFromDb,
    getSingleCategoryFromDb,
    updateCategoryFromDb,
    deleteCategoryByIdFromDb,
};
