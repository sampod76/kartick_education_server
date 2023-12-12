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
Object.defineProperty(exports, "__esModule", { value: true });
//
const validateRequestZod = (schema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
            cookies: req.cookies,
        });
        return next();
    }
    catch (error) {
        next(error);
    }
});
exports.default = validateRequestZod;
/*
 ফাংশনের ভিতর থেকে অন্য আরেকটি ফাংশন রিটার্ন করার অনেকগুলো কারণ আছে | এখানে যেটি ব্যবহার করা হয়েছে আমাদের রাউর থেকে যখন কোন ফাংশন ডিক্লেয়ার করা হয় তখন ওই ফাংশনে কোন প্যারামিটার নেই না বাই ডিফল্ট  |
 2.শুধুমাত্র তিনটা জিনিস নাই তাও কন্ট্রোলারে , req,res,next
 3.a ক্ষেত্রে আমরা আমাদের একটা ফাংশন নিয়েছি, যারও ভিতর থেকে আরেকটা ফাংশন রিটার্ন করেছি , সেই ফাংশনটা আবার এই তিনটা জিনিসের (req,res,next) রিটার্ন করতেছে

 */
