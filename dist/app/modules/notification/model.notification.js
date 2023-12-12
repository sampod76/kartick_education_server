"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const NotificationSchema = new mongoose_1.Schema({
    title: {
        type: String,
        trim: true,
    },
    subTitle: {
        type: String,
        trim: true,
    },
    imageUrl: {
        type: String,
        trim: true,
    },
    thumbnail: {
        type: mongoose_1.Types.ObjectId,
        ref: 'FileUploade',
    },
    body: {
        type: String,
        trim: true,
    },
    icon: {
        type: String,
        trim: true,
    },
    users: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'General_user',
        },
    ],
    status: {
        type: String,
        default: 'active',
    },
}, {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
        virtuals: true,
    },
});
exports.Notification = (0, mongoose_1.model)('Notification', NotificationSchema);
