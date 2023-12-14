"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptCryptoData = exports.encryptCryptoData = void 0;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const crypto_js_1 = __importDefault(require("crypto-js"));
const encryptCryptoData = (data, key) => {
    const encrypted = crypto_js_1.default.AES.encrypt(JSON.stringify(data), key);
    return encrypted.toString();
};
exports.encryptCryptoData = encryptCryptoData;
const decryptCryptoData = (data, key) => {
    const bytes = crypto_js_1.default.AES.decrypt(data, key);
    const decryptedData = JSON.parse(bytes.toString(crypto_js_1.default.enc.Utf8));
    return decryptedData;
};
exports.decryptCryptoData = decryptCryptoData;
