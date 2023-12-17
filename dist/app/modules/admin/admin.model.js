"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const mongoose_1 = require("mongoose");
const globalConstant_1 = require("../../../constant/globalConstant");
const AdminSchema = new mongoose_1.Schema({
    name: {
        type: {
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
                required: true,
            },
        },
        required: true,
    },
    dateOfBirth: {
        type: String,
    },
    gender: {
        type: String,
        enum: globalConstant_1.GENDER_ARRAY,
    },
    email: {
        type: String,
        //unique: true,
        required: true,
    },
    phoneNumber: {
        type: String,
        //unique: true,
        required: true,
    },
    address: {
        type: String,
    },
    img: {
        type: String,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Admin = (0, mongoose_1.model)('Admin', AdminSchema);
