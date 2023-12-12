"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const mongoose_1 = require("mongoose");
const users_1 = require("../../../enums/users");
const AdminSchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
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
        default: users_1.ENUM_USER_ROLE.ADMIN,
    },
    uid: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        unique: true,
        required: true,
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
        type: String,
        // required: true,
    },
    status: {
        type: String,
        enum: ['active', 'deactive'],
        default: 'active',
    },
    // academicAdmin: {
    //   type: Types.ObjectId,
    //   ref: 'AcademicAdmin',
    //   required: true,
    // },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Admin = (0, mongoose_1.model)('Admin', AdminSchema);
