"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunContest = void 0;
const mongoose_1 = require("mongoose");
const RunContestSchema = new mongoose_1.Schema({
    contestId: { type: Number, min: 0 },
    title: String,
    header_1: String,
    description: String,
    // thumbnail: String or IFileUploadeMongooseSchema (depending on the type),
    thumbnail: {
        type: mongoose_1.Types.ObjectId,
        ref: 'FileUploade',
        // required: true,
    },
    status: {
        type: String,
        enum: ['active', 'deactive', 'save'],
        default: 'active',
    },
    winnerPrize: {
        type: [
            {
                type: {
                    title: String,
                    thumbnail: {
                        type: mongoose_1.Types.ObjectId,
                        ref: 'FileUploade',
                        // required: true,
                    },
                    prize_serial: { type: Number },
                    prize_value: { type: Number },
                },
            },
        ],
    },
    duration_time: {
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
    },
    total_winer: {
        number: { type: Number, min: 0 },
        condition: {
            type: Object,
        },
    },
    //after contest end then update
    winnerList: [
        {
            type: {
                photo_contest_id: {
                    type: mongoose_1.Types.ObjectId,
                    ref: 'Photo_contest_user',
                    // require: [true, 'photo_contest_id is required'],
                },
                userId: { type: mongoose_1.Types.ObjectId, ref: 'General_user' },
                email: String,
                name: String,
                phone: String,
            },
        },
    ],
}, {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
        virtuals: true,
    },
});
exports.RunContest = (0, mongoose_1.model)('RunContest', RunContestSchema);
