"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Moderator = void 0;
const mongoose_1 = require("mongoose");
const users_1 = require("../../../enums/users");
const ModeratorSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
    },
    role: {
        type: String,
        default: users_1.ENUM_USER_ROLE.MODERATOR,
    },
    email: {
        type: String,
        unique: true,
        // required: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        unique: true,
        // required: true,
    },
    uid: {
        type: String,
        unique: true,
    },
    emergencyphone: {
        type: String,
    },
    address: {
        type: String,
    },
    designation: {
        type: String,
    },
    profileImage: {
        type: mongoose_1.Types.ObjectId,
        ref: 'FileUploade',
        // required: true,
    },
    status: {
        type: String,
        enum: ['active', 'deactive'],
        default: 'active',
    },
    // academicModerator: {
    //   type: Types.ObjectId,
    //   ref: 'AcademicModerator',
    //   required: true,
    // },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Moderator = (0, mongoose_1.model)('Moderator', ModeratorSchema);
