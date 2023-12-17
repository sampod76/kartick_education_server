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
exports.ModuleService = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const paginationHelper_1 = require("../../../helper/paginationHelper");
const globalEnums_1 = require("../../../enums/globalEnums");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const module_constant_1 = require("./module.constant");
const module_model_1 = require("./module.model");
const { ObjectId } = mongoose_1.default.Types;
const createModuleByDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (yield module_model_1.Module.create(payload)).populate([
        {
            path: 'author',
            select: {
                needsPasswordChange: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
            },
        },
    ]);
    return result;
});
//getAllModuleFromDb
const getAllModuleFromDb = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
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
            $or: module_constant_1.MODULE_SEARCHABLE_FIELDS.map(field => 
            //search array value
            field === 'tags'
                ? { [field]: { $in: [new RegExp(searchTerm, 'i')] } }
                : {
                    [field]: new RegExp(searchTerm, 'i'),
                }),
        });
    }
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => field === 'milestone'
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
                from: 'milestones',
                let: { id: '$milestone' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$_id', '$$id'] },
                            // Additional filter conditions for collection2
                        },
                    },
                    // Additional stages for collection2
                    // প্রথম লুকাপ চালানোর পরে যে ডাটা আসছে তার উপরে যদি আমি যেই কোন কিছু করতে চাই তাহলে এখানে করতে হবে |যেমন আমি এখানে project করেছি
                    // {
                    //   $project: {
                    //     __v: 0,
                    //   },
                    // },
                ],
                as: 'milestoneDetails',
            },
        },
        {
            $project: { milestone: 0 },
        },
        {
            $addFields: {
                milestone: {
                    $cond: {
                        if: { $eq: [{ $size: '$milestoneDetails' }, 0] },
                        then: [{}],
                        else: '$milestoneDetails',
                    },
                },
            },
        },
        {
            $project: { milestoneDetails: 0 },
        },
        {
            $unwind: '$milestone',
        },
    ];
    let result = null;
    if (select) {
        result = yield module_model_1.Module.find({})
            .sort({ title: 1 })
            .select(Object.assign({}, projection));
    }
    else {
        result = yield module_model_1.Module.aggregate(pipeline);
    }
    const total = yield module_model_1.Module.countDocuments(whereConditions);
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
const getSingleModuleFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield module_model_1.Module.aggregate([
        { $match: { _id: new ObjectId(id) } },
    ]);
    return result[0];
});
// update e form db
const updateModuleFromDb = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { demo_video } = payload, otherData = __rest(payload, ["demo_video"]);
    const updateData = Object.assign({}, otherData);
    if (demo_video && Object.keys(demo_video).length > 0) {
        Object.keys(demo_video).forEach(key => {
            const demo_videoKey = `demo_video.${key}`; // `demo_video.status`
            updateData[demo_videoKey] =
                demo_video[key];
        });
    }
    const result = yield module_model_1.Module.findOneAndUpdate({ _id: id }, updateData, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new ApiError_1.default(500, 'Module update fail!!😪😭😰');
    }
    return result;
});
// delete e form db
const deleteModuleByIdFromDb = (id, query) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    if (query === 'permanent') {
        result = yield module_model_1.Module.findByIdAndDelete(id);
    }
    else {
        result = yield module_model_1.Module.findOneAndUpdate({ status: globalEnums_1.ENUM_STATUS.DEACTIVATE });
    }
    return result;
});
// set user reviews e form db
const ModuleReviewsByUserFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    return null;
});
exports.ModuleService = {
    createModuleByDb,
    getAllModuleFromDb,
    getSingleModuleFromDb,
    updateModuleFromDb,
    deleteModuleByIdFromDb,
    ModuleReviewsByUserFromDb,
};
