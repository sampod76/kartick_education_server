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
exports.RunContestService = void 0;
const mongoose_1 = require("mongoose");
const paginationHelper_1 = require("../../../helper/paginationHelper");
const users_1 = require("../../../enums/users");
const run_contest_model_1 = require("./run_contest.model");
const run_contest_consent_1 = require("./run_contest.consent");
const run_contest_utils_1 = require("./run_contest.utils");
const createRunContestByDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const contestId = yield (0, run_contest_utils_1.generateContestId)();
    const result = yield run_contest_model_1.RunContest.create(Object.assign(Object.assign({}, payload), { contestId }));
    return result;
});
//getAllRunContestFromDb
const getAllRunContestFromDb = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    //****************search and filters start************/
    const { searchTerm, select } = filters, filtersData = __rest(filters, ["searchTerm", "select"]);
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
            $or: run_contest_consent_1.RUNCONTEST_SEARCHABLE_FIELDS.map(field => 
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
    let result = null;
    if (select) {
        result = yield run_contest_model_1.RunContest.find({}).select(Object.assign({}, projection));
    }
    else {
        result = yield run_contest_model_1.RunContest.find(whereConditions)
            .populate('winnerPrize.thumbnail winnerList.photo_contest_id')
            .sort(sortConditions)
            .skip(Number(skip))
            .limit(Number(limit));
    }
    const total = yield run_contest_model_1.RunContest.countDocuments(whereConditions);
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
const getSingleRunContestFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield run_contest_model_1.RunContest.findById(id).populate('winnerPrize.thumbnail winnerList.photo_contest_id');
    return result;
});
// update e form db
const updateRunContestFromDb = (id, req, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield run_contest_model_1.RunContest.findOneAndUpdate({ _id: new mongoose_1.Types.ObjectId(id) }, payload, {
        new: true,
    });
    return result;
});
// update e form db
const updateRunContestWinnerFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    // const resultPhotoContest =await PhotoContestUser.find().limit()
    // const lastId = await RunContest.findById(id).lean();
    // const winerPerson = await PhotoContestUser.aggregate([
    //   {
    //     $addFields: {
    //       loveReacts_count: { $size: { $ifNull: ['$loveReacts', []] } },
    //     },
    //   },
    //   { $sort: { loveReacts: -1 } },
    //   {
    //     $limit:
    //       Number(lastId?.total_winer?.number || lastId?.winnerPrize?.length) || 3,
    //   },
    // ]);
    // const result = await RunContest.findOneAndUpdate(
    //   { _id: new Types.ObjectId(id) },
    //   payload,
    //   {
    //     new: true,
    //   }
    // );
    // return result;
    return null;
});
// delete e form db
const deleteRunContestByIdFromDb = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const quary = {
        _id: id,
    };
    if (((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.role) !== users_1.ENUM_USER_ROLE.ADMIN) {
        quary.userId = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b._id;
    }
    const result = yield run_contest_model_1.RunContest.findOneAndDelete(quary);
    return result;
});
exports.RunContestService = {
    createRunContestByDb,
    getAllRunContestFromDb,
    getSingleRunContestFromDb,
    updateRunContestFromDb,
    deleteRunContestByIdFromDb,
    updateRunContestWinnerFromDb,
};
