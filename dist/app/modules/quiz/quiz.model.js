"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quiz = void 0;
const mongoose_1 = require("mongoose");
const QuizSchema = new mongoose_1.Schema({
    quizList: [
        {
            title: {
                type: String,
                required: true,
                trim: true,
            },
            serial_no: Number,
            answers: {
                type: [String],
                required: true,
            },
            correct_answer: {
                type: String,
                require: true,
            },
            tag: {
                type: [String],
            },
            hint: {
                type: String,
                trim: true,
            },
            // optional
            header_1: {
                type: String,
                trim: true,
            },
            header_2: {
                type: String,
                trim: true,
            },
            description: {
                type: String,
                trim: true,
            },
            thumbnail: {
                type: mongoose_1.Types.ObjectId,
                ref: 'FileUploade',
            },
        },
    ],
    status: {
        type: String,
        enum: ['active', 'deactive', 'save'],
        default: 'active',
    },
    course: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        ref: 'Course',
    },
    courseId: {
        type: String,
    },
}, {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
        virtuals: true,
    },
});
exports.Quiz = (0, mongoose_1.model)('Quiz', QuizSchema);
