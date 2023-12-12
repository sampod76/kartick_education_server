"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
/* eslint-disable @typescript-eslint/no-this-alias */
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../../config"));
//যখন instance method ব্যবহার করা হবে তখন Schema এভাবে ডিক্লেয়ার করতে হবে
// const UserSchema = new Schema<IUser, Record<string, unknown>, IUserMethods>(
// Statics method to user this schema
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
    },
    role: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        //select --> dont show any condition this password
        select: 0,
    },
    needsPasswordChange: {
        type: Boolean,
        default: true,
    },
    moderator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Moderator',
    },
    generalUser: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'General_user',
    },
    admin: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Admin',
    },
    status: {
        type: String,
        enum: ['active', 'deactive'],
        default: 'active',
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    // strict: 'throw',
});
UserSchema.statics.isUserExist = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne({ email }, { email: 1, password: 1, role: 1, needsPasswordChange: 1 });
    });
};
UserSchema.statics.isPasswordMatched = function (givenPassword, savedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(givenPassword, savedPassword);
    });
};
//password hash
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        user.password = yield bcrypt_1.default.hash(user.password, Number(config_1.default.bycrypt_salt_rounds));
        next();
    });
});
exports.User = (0, mongoose_1.model)('User', UserSchema);
