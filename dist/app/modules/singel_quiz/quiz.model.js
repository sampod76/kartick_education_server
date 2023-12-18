"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lesson = void 0;
const mongoose_1 = require("mongoose");
const globalConstant_1 = require("../../../constant/globalConstant");
const lessonSchema = new mongoose_1.Schema({
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
    module: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Module',
    },
    status: {
        type: String,
        enum: globalConstant_1.STATUS_ARRAY,
        default: 'active',
    },
    lesson_number: {
        type: Number,
    },
    demo_video: {
        type: Object,
        default: {},
    },
    video: {
        type: String,
    },
    tags: [String],
}, {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
        virtuals: true,
    },
});
exports.Lesson = (0, mongoose_1.model)('Lesson', lessonSchema);
