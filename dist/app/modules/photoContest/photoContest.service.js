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
exports.PhotoContestUserService = void 0;
const mongoose_1 = require("mongoose");
const paginationHelper_1 = require("../../../helper/paginationHelper");
const users_1 = require("../../../enums/users");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const photoContest_consent_1 = require("./photoContest.consent");
const photoContest_model_1 = require("./photoContest.model");
const createPhotoContestUserByDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (yield photoContest_model_1.PhotoContestUser.create(payload)).populate('thumbnail');
    console.log(result, 'photo contest join 20 service');
    return result;
});
//getAllPhotoContestUserFromDb
const getAllPhotoContestUserFromDb = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    //****************search and filters start************/
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: photoContest_consent_1.PHOTOCONTEST_USER_SEARCHABLE_FIELDS.map(field => 
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
            $and: Object.entries(filtersData).map(([field, value]) => field === 'contest'
                ? { [field]: new mongoose_1.Types.ObjectId(value) }
                : {
                    [field]: value,
                }),
        });
    }
    //****************search and filters end**********/
    //****************pagination start **************/
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    // must be alltime add ---> loveReact_count: -1
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }
    //****************pagination end ***************/
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    // const result = await PhotoContestUser.find(whereConditions)
    //   .sort(sortConditions)
    //   .skip(Number(skip))
    //   .limit(Number(limit));
    const pipeline = [
        { $match: whereConditions },
        //*********** */ thumbnail to same thumbnail images****
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
        // *********  ******thumbnali end**************
        //
        {
            $addFields: {
                loveReacts_count: { $size: { $ifNull: ['$loveReacts', []] } },
            },
        },
        {
            $addFields: {
                messages_count: { $size: { $ifNull: ['$messages', []] } },
            },
        },
        {
            $addFields: {
                share_count: { $size: { $ifNull: ['$share', []] } },
            },
        },
        {
            $project: { share: 0, loveReacts: 0, messages: 0 },
        },
        { $sort: sortConditions },
        { $skip: Number(skip) || 0 },
        { $limit: Number(limit) || 15 },
    ];
    const result = yield photoContest_model_1.PhotoContestUser.aggregate(pipeline);
    const total = yield photoContest_model_1.PhotoContestUser.countDocuments(whereConditions);
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
const getSinglePhotoContestUserFromDb = (id, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
req) => __awaiter(void 0, void 0, void 0, function* () {
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
        ////
        ////
        ///
        {
            $addFields: {
                loveReacts_count: { $size: { $ifNull: ['$loveReacts', []] } },
            },
        },
        {
            $addFields: {
                messages_count: { $size: { $ifNull: ['$messages', []] } },
            },
        },
        {
            $addFields: {
                share_count: { $size: { $ifNull: ['$share', []] } },
            },
        },
        {
            $project: { share: 0, loveReacts: 0, messages: 0 },
        },
    ];
    const result = yield photoContest_model_1.PhotoContestUser.aggregate(pipeline);
    // .populate({
    //   path: 'thumbnail',
    //   select: 'title size filename category',
    // })
    // .populate({
    //   path: 'contest',
    //   select: { title: 1, status: 1, duration_time: 1, contestId: 1 },
    // })
    // .populate({
    //   path: 'userId',
    //   select: { name: 1, email: 1, phone: 1 },
    // });
    // console.log(result, id);
    return result[0];
});
// update e form db
const updatePhotoContestUserFromDb = (id, req, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const quary = {
        _id: id,
    };
    if (((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.role) !== users_1.ENUM_USER_ROLE.ADMIN) {
        quary.userId = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b._id;
    }
    const result = yield photoContest_model_1.PhotoContestUser.findOneAndUpdate(quary, payload, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new ApiError_1.default(505, 'The operation failed');
    }
    return result;
});
const voteMassageSharePhotoContestUserFromDb = (id, //docoment id --> photocontest id
req, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { loveReact, message, share } = payload;
    let quary = {
        _id: id,
    };
    const updateData = {};
    if (loveReact === 'yes') {
        quary = Object.assign(Object.assign({}, quary), { loveReacts: { $nin: new mongoose_1.Types.ObjectId((_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c._id) } });
        updateData['$push'] = {
            loveReacts: (_d = req === null || req === void 0 ? void 0 : req.user) === null || _d === void 0 ? void 0 : _d._id,
        };
    }
    else if (loveReact === 'no') {
        quary = Object.assign(Object.assign({}, quary), { loveReacts: { $in: new mongoose_1.Types.ObjectId((_e = req === null || req === void 0 ? void 0 : req.user) === null || _e === void 0 ? void 0 : _e._id) } });
        updateData['$pull'] = {
            loveReacts: (_f = req === null || req === void 0 ? void 0 : req.user) === null || _f === void 0 ? void 0 : _f._id,
        };
    }
    // if (loveReact) {
    //   quary = {
    //     ...quary,
    //     loveReacts: { $nin: new Types.ObjectId(req?.user?._id) },
    //   };
    //   (updateData as any)['$push'] = {
    //     loveReacts: loveReact,
    //   };
    // }
    if (message) {
        quary = Object.assign(Object.assign({}, quary), { 'messages.userId': { $ne: new mongoose_1.Types.ObjectId((_g = req === null || req === void 0 ? void 0 : req.user) === null || _g === void 0 ? void 0 : _g._id) } });
        updateData['$push'] = {
            messages: {
                userId: (_h = req === null || req === void 0 ? void 0 : req.user) === null || _h === void 0 ? void 0 : _h._id,
                message,
            },
        };
    }
    if (share === 'yes') {
        quary = Object.assign(Object.assign({}, quary), { share: { $nin: new mongoose_1.Types.ObjectId((_j = req === null || req === void 0 ? void 0 : req.user) === null || _j === void 0 ? void 0 : _j._id) } });
        updateData['$push'] = {
            share: (_k = req === null || req === void 0 ? void 0 : req.user) === null || _k === void 0 ? void 0 : _k._id,
        };
    }
    else if (share === 'no') {
        quary = Object.assign(Object.assign({}, quary), { share: { $in: new mongoose_1.Types.ObjectId((_l = req === null || req === void 0 ? void 0 : req.user) === null || _l === void 0 ? void 0 : _l._id) } });
        updateData['$pull'] = {
            share: (_m = req === null || req === void 0 ? void 0 : req.user) === null || _m === void 0 ? void 0 : _m._id,
        };
    }
    const result = yield photoContest_model_1.PhotoContestUser.findOneAndUpdate(quary, updateData, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new ApiError_1.default(505, 'Your are allrady done that !!!');
    }
    return result;
});
// delete e form db
const deletePhotoContestUserByIdFromDb = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _o, _p;
    const quary = {
        _id: id,
    };
    if (((_o = req === null || req === void 0 ? void 0 : req.user) === null || _o === void 0 ? void 0 : _o.role) !== users_1.ENUM_USER_ROLE.ADMIN) {
        quary.userId = (_p = req === null || req === void 0 ? void 0 : req.user) === null || _p === void 0 ? void 0 : _p._id;
    }
    const result = yield photoContest_model_1.PhotoContestUser.findOneAndDelete(quary);
    if (!result) {
        throw new ApiError_1.default(505, 'The operation failed');
    }
    return result;
});
exports.PhotoContestUserService = {
    createPhotoContestUserByDb,
    getAllPhotoContestUserFromDb,
    getSinglePhotoContestUserFromDb,
    updatePhotoContestUserFromDb,
    deletePhotoContestUserByIdFromDb,
    voteMassageSharePhotoContestUserFromDb,
};
