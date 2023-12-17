"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = void 0;
const mongoose_1 = require("mongoose");
const globalConstant_1 = require("../../../constant/globalConstant");
const moduleSchema = new mongoose_1.Schema({
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
    milestone: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Milestone',
    },
    status: {
        type: String,
        enum: globalConstant_1.STATUS_ARRAY,
        default: 'active',
    },
    module_number: {
        type: Number,
    },
    demo_video: {
        type: Object,
        default: {},
    },
    tags: [String],
}, {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
        virtuals: true,
    },
});
exports.Module = (0, mongoose_1.model)('Module', moduleSchema);
