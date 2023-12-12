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
exports.QuizService = void 0;
const mongoose_1 = require("mongoose");
const paginationHelper_1 = require("../../../helper/paginationHelper");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const quiz_consent_1 = require("./quiz.consent");
const quiz_model_1 = require("./quiz.model");
const createQuizByDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (yield quiz_model_1.Quiz.create(payload)).populate({
        path: 'course',
        // select: { needsPasswordChange: 0, createdAt: 0, updatedAt: 0, __v: 0 },
        // populate: [
        //   {
        //     path: 'moderator',
        //     select: { createdAt: 0, updatedAt: 0, __v: 0 },
        //   }
        // ],
    });
    return result;
});
//getAllQuizFromDb
const getAllQuizFromDb = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    //****************search and filters start************/
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: quiz_consent_1.QUIZ_SEARCHABLE_FIELDS.map(field => 
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
            $and: Object.entries(filtersData).map(([field, value]) => field === 'course'
                ? { [field]: new mongoose_1.Types.ObjectId(value) }
                : {
                    [field]: value,
                }),
        });
    }
    console.log(andConditions);
    //****************search and filters end**********/
    //****************pagination start **************/
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    //****************pagination end ***************/
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield quiz_model_1.Quiz.find(whereConditions)
        .sort(sortConditions)
        .skip(Number(skip))
        .limit(Number(limit))
        .select({ quizList: 0 })
        .populate('course', 'title courseId categoryDetails');
    const total = yield quiz_model_1.Quiz.countDocuments(whereConditions);
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
const getSingleQuizFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield quiz_model_1.Quiz.findById(id);
    return result;
});
// update e form db
const updateQuizFromDb = (id, query, payload) => __awaiter(void 0, void 0, void 0, function* () {
    let result = null;
    if (query === null || query === void 0 ? void 0 : query.singleQuizId) {
        result = yield quiz_model_1.Quiz.findOneAndUpdate({
            _id: id,
            'quizList._id': query.singleQuizId,
        }, { $set: { 'quizList.$': payload } });
    }
    else if (query.createQuiz === 'yes') {
        result = yield quiz_model_1.Quiz.findOneAndUpdate({ _id: id }, {
            $push: { quizList: payload },
        }, {
            new: true,
        });
    }
    else if (query.deleteByQuizId) {
        result = yield quiz_model_1.Quiz.findOneAndUpdate({ _id: id }, {
            $pull: { quizList: { _id: new mongoose_1.Types.ObjectId(query.deleteByQuizId) } },
        }, {
            new: true,
        });
    }
    else {
        result = yield quiz_model_1.Quiz.findByIdAndUpdate(id, payload, {
            new: true,
        });
    }
    if (!result) {
        throw new ApiError_1.default(400, 'Failed to update the quiz');
    }
    return result;
});
// delete e form db
const deleteQuizByIdFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield quiz_model_1.Quiz.findByIdAndDelete(id);
    return result;
});
exports.QuizService = {
    createQuizByDb,
    getAllQuizFromDb,
    getSingleQuizFromDb,
    updateQuizFromDb,
    deleteQuizByIdFromDb,
};
