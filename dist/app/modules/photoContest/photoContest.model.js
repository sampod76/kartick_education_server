"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoContestUser = void 0;
const mongoose_1 = require("mongoose");
const PhotoContestSchemaUser = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        ref: 'General_user',
    },
    contest: { type: mongoose_1.Types.ObjectId, ref: 'RunContest' },
    name: String,
    email: String,
    phone: String,
    header_1: String,
    description: String,
    thumbnail: {
        type: mongoose_1.Types.ObjectId,
        ref: 'FileUploade',
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'deactive'],
        default: 'active',
    },
    // after contest then other person this field
    loveReacts: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: 'General_user',
        },
    ],
    messages: [
        {
            userId: {
                type: mongoose_1.Types.ObjectId,
                ref: 'General_user',
            },
            message: {
                type: String,
            },
        },
    ],
    share: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: 'General_user',
        },
    ],
    // after winer then this field auto file up
    winnerData: {
        type: {
            contest: { type: mongoose_1.Types.ObjectId },
            contest_number: { type: String },
            date: {
                type: String,
            },
            winner: {
                type: Number,
            },
        },
    },
}, {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
        virtuals: true,
    },
});
exports.PhotoContestUser = (0, mongoose_1.model)('Photo_contest_user', PhotoContestSchemaUser);
