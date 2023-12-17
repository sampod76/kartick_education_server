"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const globalConstant_1 = require("../../../constant/globalConstant");
const CategorySchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        //unique: true,
        trim: true,
        index: true,
    },
    img: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: globalConstant_1.STATUS_ARRAY,
        default: 'active',
    },
}, {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
        virtuals: true,
    },
});
exports.Category = (0, mongoose_1.model)('Category', CategorySchema);
