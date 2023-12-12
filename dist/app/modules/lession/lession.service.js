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
exports.LessionService = void 0;
const mongoose_1 = require("mongoose");
const paginationHelper_1 = require("../../../helper/paginationHelper");
const lession_consent_1 = require("./lession.consent");
const lession_model_1 = require("./lession.model");
const lession_utils_1 = require("./lession.utils");
const createLessionByDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.lessionId = yield (0, lession_utils_1.generateLessionId)(payload.courseId);
    const result = yield lession_model_1.Lession.create(payload);
    // .populate({
    //   path: 'course',
    //   // select: { needsPasswordChange: 0, createdAt: 0, updatedAt: 0, __v: 0 },
    //   // populate: [
    //   //   {
    //   //     path: 'moderator',
    //   //     select: { createdAt: 0, updatedAt: 0, __v: 0 },
    //   //   }
    //   // ],
    // });
    return result;
});
//getAllLessionFromDb
const getAllLessionFromDb = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    //****************search and filters start************/
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: lession_consent_1.LESSION_SEARCHABLE_FIELDS.map(field => 
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
    console.log(filtersData);
    //****************search and filters end**********/
    //****************pagination start **************/
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    //****************pagination end ***************/
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield lession_model_1.Lession.find(whereConditions)
        .populate('course', 'courseId title publisherName')
        .populate('thumbnail')
        .sort(sortConditions)
        .skip(Number(skip))
        .limit(Number(limit));
    const total = yield lession_model_1.Lession.countDocuments(whereConditions);
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
const getSingleLessionFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield lession_model_1.Lession.findById(id)
        .populate('course', 'courseId title publisherName')
        .populate('thumbnail');
    return result;
});
// update e form db
const updateLessionFromDb = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payload);
    const result = yield lession_model_1.Lession.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
});
// delete e form db
const deleteLessionByIdFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield lession_model_1.Lession.findByIdAndDelete(id);
    return result;
});
exports.LessionService = {
    createLessionByDb,
    getAllLessionFromDb,
    getSingleLessionFromDb,
    updateLessionFromDb,
    deleteLessionByIdFromDb,
};
