"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const encrypt = (obj) => {
    const encrypted = jsonwebtoken_1.default.sign(obj, process.env.ENCRYPTION_SECRET);
    return encrypted;
};
exports.encrypt = encrypt;
const decrypt = (encryptedText) => {
    const obj = jsonwebtoken_1.default.verify(encryptedText, process.env.ENCRYPTION_SECRET);
    return obj;
};
exports.decrypt = decrypt;
