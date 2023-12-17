"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Moderator = void 0;
const mongoose_1 = require("mongoose");
const ModeratorSchema = new mongoose_1.Schema({
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
            middleName: {
                type: String,
            },
        },
        required: true,
    },
    dateOfBirth: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
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
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
    },
}, {
    timestamps: true,
});
exports.Moderator = (0, mongoose_1.model)('Moderator', ModeratorSchema);
