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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralUser = void 0;
const mongoose_1 = require("mongoose");
const users_1 = require("../../../enums/users");
const constant_GeneralUser_1 = require("./constant.GeneralUser");
const GeneralUserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    gender: {
        type: String,
        enum: constant_GeneralUser_1.GENDER,
    },
    role: {
        type: String,
        default: users_1.ENUM_USER_ROLE.GENERAL_USER,
    },
    dateOfBirth: {
        type: String,
        // required: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        // required: true,
    },
    phone: {
        type: String,
        unique: true,
        // required: true,
    },
    profileImage: {
        type: mongoose_1.Types.ObjectId,
        ref: 'FileUploade',
        // required: true,
    },
    uid: {
        type: String,
        unique: true,
        required: [true, "Uid must be provided"]
    },
    fcm_token: {
        type: String,
        unique: true,
    },
    status: {
        type: String,
        enum: ['active', 'deactive'],
        default: 'active',
    },
    learnedToday: {
        type: {
            date: {
                type: Date,
            },
            time: {
                type: Number,
            },
        },
    },
    purchase_courses: [
        {
            course: { type: mongoose_1.Types.ObjectId, ref: 'Course' },
            quiz: [],
            total_completed_lessions: [{ type: mongoose_1.Types.ObjectId, ref: 'Lession' }],
        },
    ],
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
GeneralUserSchema.statics.isUserExist = function (id, courseId) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield exports.GeneralUser.findById(id);
        const CourseIdExaite = (_a = result === null || result === void 0 ? void 0 : result.purchase_courses) === null || _a === void 0 ? void 0 : _a.find(value => value.course === courseId);
        return (CourseIdExaite === null || CourseIdExaite === void 0 ? void 0 : CourseIdExaite.course) || null;
    });
};
exports.GeneralUser = (0, mongoose_1.model)('General_user', GeneralUserSchema);
