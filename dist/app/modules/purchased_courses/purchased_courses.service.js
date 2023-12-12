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
exports.Purchased_coursesService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paginationHelper_1 = require("../../../helper/paginationHelper");
const purchased_courses_consent_1 = require("./purchased_courses.consent");
const purchased_courses_model_1 = require("./purchased_courses.model");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const model_GeneralUser_1 = require("../generalUser/model.GeneralUser");
const users_1 = require("../../../enums/users");
const { ObjectId } = mongoose_1.default.Types;
//
const createPurchased_coursesByDb = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // let newCoursePurchase = null;
    // const session = await mongoose.startSession();
    // try {
    //   session.startTransaction();
    const addCourseByUser = yield model_GeneralUser_1.GeneralUser.updateOne({
        _id: new ObjectId(userId),
        'purchase_courses.course': { $ne: payload.course },
    }, {
        $push: {
            purchase_courses: { course: payload.course } /* course --> _id */,
        },
    }, { /* session, */ new: true, runValidators: true });
    if (!addCourseByUser.modifiedCount) {
        throw new ApiError_1.default(404, 'Failed to by course');
    }
    // payload.transactionID = payload.transactionID
    //   ? payload.courseId + '-' + payload.transactionID
    //   : payload.courseId + '-' + Math.random().toString(16).slice(2);
    // const createPurchase = await Purchased_courses.create([payload], {
    //   session,
    // });
    const createPurchase = yield purchased_courses_model_1.Purchased_courses.create(payload);
    if (!createPurchase) {
        throw new ApiError_1.default(404, 'Failed to by course');
    }
    //   newCoursePurchase = createPurchase[0]._id ? createPurchase[0] : null;
    //   session.commitTransaction();
    //   session.endSession();
    // } catch (error) {
    //   await session.abortTransaction();
    //   await session.endSession();
    //   throw error;
    // }
    // if (newCoursePurchase?._id) {
    //   newCoursePurchase = await Purchased_courses.findById(
    //     newCoursePurchase?._id
    //   ).populate('course');
    // }
    return createPurchase;
});
//getAllPurchased_coursesFromDb
const getAllPurchased_coursesFromDb = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    //****************search and filters start************/
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: purchased_courses_consent_1.PURCHASED_COURSES_SEARCHABLE_FIELDS.map(field => ({
                [field]: new RegExp(searchTerm, 'i'),
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
        sortConditions[sortBy] = sortOrder;
    }
    //****************pagination end ***************/
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield purchased_courses_model_1.Purchased_courses.find(whereConditions)
        .sort(sortConditions)
        .skip(Number(skip))
        .limit(Number(limit));
    const total = yield purchased_courses_model_1.Purchased_courses.countDocuments(whereConditions);
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
const getSinglePurchased_coursesFromDb = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const result = yield purchased_courses_model_1.Purchased_courses.findById(id);
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== users_1.ENUM_USER_ROLE.ADMIN &&
        ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id) !== (result === null || result === void 0 ? void 0 : result.userId)) {
        throw new ApiError_1.default(500, 'unauthorise access!!');
    }
    return result;
});
// update e form db
const updatePurchased_coursesFromDb = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield purchased_courses_model_1.Purchased_courses.findOneAndUpdate({ _id: id }, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
// delete e form db
const deletePurchased_coursesByIdFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield purchased_courses_model_1.Purchased_courses.findByIdAndDelete(id);
    return result;
});
exports.Purchased_coursesService = {
    createPurchased_coursesByDb,
    getAllPurchased_coursesFromDb,
    getSinglePurchased_coursesFromDb,
    updatePurchased_coursesFromDb,
    deletePurchased_coursesByIdFromDb,
};
//suport session to solve
// const createPurchased_coursesByDb = async (
//   payload: IPurchased_courses,
//   userId: string
// ): Promise<IPurchased_courses | null> => {
//   let newCoursePurchase = null;
//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();
//     const addCourseByUser = await GeneralUser.updateOne(
//       {
//         _id: new ObjectId(userId),
//         'purchase_courses.course': { $ne: payload.course },
//       },
//       {
//         $push: {
//           purchase_courses: { course: payload.course } /* course --> _id */,
//         },
//       },
//       { session, new: true, runValidators: true }
//     );
//     if (!addCourseByUser.modifiedCount) {
//       throw new ApiError(404, 'Failed to by course');
//     }
//     // payload.transactionID = payload.transactionID
//     //   ? payload.courseId + '-' + payload.transactionID
//     //   : payload.courseId + '-' + Math.random().toString(16).slice(2);
//     const createPurchase = await Purchased_courses.create([payload], {
//       session,
//     });
//     if (createPurchase.length === 0) {
//       throw new ApiError(404, 'Failed to by course');
//     }
//     newCoursePurchase = createPurchase[0]._id ? createPurchase[0] : null;
//     session.commitTransaction();
//     session.endSession();
//   } catch (error) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw error;
//   }
//   if (newCoursePurchase?._id) {
//     newCoursePurchase = await Purchased_courses.findById(
//       newCoursePurchase?._id
//     ).populate('course');
//   }
//   return newCoursePurchase;
// };
