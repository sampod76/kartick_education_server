"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Milestone = void 0;
const mongoose_1 = require("mongoose");
const globalConstant_1 = require("../../../constant/globalConstant");
const milestoneSchema = new mongoose_1.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        index: true,
    },
    img: {
        type: String,
    },
    details: {
        type: String,
        trim: true,
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
    },
    status: {
        type: String,
        enum: globalConstant_1.STATUS_ARRAY,
        default: 'active',
    },
    showing_number: {
        type: Number,
        default: 9999,
    },
    demo_video: {
        type: Object,
        default: {},
    },
    favorite: {
        type: String,
        enum: globalConstant_1.YN_ARRAY,
        default: 'no',
    },
    tags: [String],
}, {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
        virtuals: true,
    },
});
exports.Milestone = (0, mongoose_1.model)('Milestone', milestoneSchema);
