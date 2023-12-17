"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const mongoose_1 = require("mongoose");
const globalConstant_1 = require("../../../constant/globalConstant");
const course_constant_1 = require("./course.constant");
const courseSchema = new mongoose_1.Schema({
    title: {
        type: String,
        trim: true,
        index: true,
    },
    snid: {
        type: String,
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
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
    },
    // sub1_course_category_id: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Category',
    // },
    price: {
        type: Number,
        min: 0,
    },
    duration: {
        type: String,
    },
    level: {
        type: String,
    },
    price_type: {
        type: String,
        enum: course_constant_1.COURSE_TYPES,
        default: 'paid',
    },
    status: {
        type: String,
        enum: globalConstant_1.STATUS_ARRAY,
        default: 'active',
    },
    demo_video: {
        type: Object,
        default: {},
    },
    showing_number: {
        type: Number,
        default: 9999,
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
exports.Course = (0, mongoose_1.model)('Course', courseSchema);
