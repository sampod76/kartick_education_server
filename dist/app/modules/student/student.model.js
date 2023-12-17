"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = exports.StudentSchema = void 0;
const mongoose_1 = require("mongoose");
const student_constant_1 = require("./student.constant");
const globalConstant_1 = require("../../../constant/globalConstant");
exports.StudentSchema = new mongoose_1.Schema({
    name: {
        type: {
            firstName: {
                type: String,
            },
            lastName: {
                type: String,
                // required: true,
            },
        },
        required: true,
    },
    gender: {
        type: String,
        enum: student_constant_1.gender,
    },
    dateOfBirth: {
        type: String,
    },
    email: {
        type: String,
        //unique: true,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: globalConstant_1.STATUS_ARRAY,
        default: 'active',
    },
    address: {
        type: String,
    },
    img: {
        type: String,
        // required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Student = (0, mongoose_1.model)('Student', exports.StudentSchema);
