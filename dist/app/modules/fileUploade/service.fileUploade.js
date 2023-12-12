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
exports.FileUploadeService = void 0;
const paginationHelper_1 = require("../../../helper/paginationHelper");
const consent_fileUploade_1 = require("./consent.fileUploade");
const model_fileUploade_1 = require("./model.fileUploade");
const createFileUploadeByDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.url =
        payload.path === 'uploadFile/images'
            ? `${process.env.REAL_HOST_SERVER_SIDE}/images/${payload.filename}`
            : `${process.env.REAL_HOST_SERVER_SIDE}/vedios/${payload.filename}`;
    const result = yield model_fileUploade_1.FileUploade.create(payload);
    return result;
});
//getAllFileUploadeFromDb
const getAllFileUploadeFromDb = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    //****************search and filters start************/
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: consent_fileUploade_1.FILEUPLOADE_SEARCHABLE_FIELDS.map(field => ({
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
    const { page, limit = 30, skip, sortBy, sortOrder, } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    //****************pagination end ***************/
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield model_fileUploade_1.FileUploade.find(whereConditions)
        .sort(sortConditions)
        .skip(Number(skip))
        .limit(Number(limit));
    const total = yield model_fileUploade_1.FileUploade.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
// get single FileUploadee form db
const getSingleFileUploadeFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_fileUploade_1.FileUploade.findById(id);
    return result;
});
// update FileUploadee form db
const updateFileUploadeFromDb = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_fileUploade_1.FileUploade.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
});
// delete FileUploadee form db
const deleteFileUploadeByIdFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_fileUploade_1.FileUploade.findByIdAndDelete(id);
    return result;
});
exports.FileUploadeService = {
    createFileUploadeByDb,
    getAllFileUploadeFromDb,
    getSingleFileUploadeFromDb,
    updateFileUploadeFromDb,
    deleteFileUploadeByIdFromDb,
};
