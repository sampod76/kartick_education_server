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
exports.generateLessionId = exports.findLastLessionId = void 0;
const lession_model_1 = require("./lession.model");
const findLastLessionId = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const lastLessionId = yield lession_model_1.Lession.findOne({ courseId }, { lessionId: 1, _id: 0 })
        .sort({ createdAt: -1 })
        .lean();
    return (lastLessionId === null || lastLessionId === void 0 ? void 0 : lastLessionId.lessionId)
        ? lastLessionId.lessionId.substring(5)
        : undefined;
});
exports.findLastLessionId = findLastLessionId;
const generateLessionId = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const currentId = (yield (0, exports.findLastLessionId)(courseId)) || (0).toString().padStart(3, '0');
    // increment by 1
    const incrementId = (Number(currentId) + 1).toString().padStart(3, '0');
    const modifiId = `C-${Number(courseId)}-${incrementId}`;
    return modifiId;
});
exports.generateLessionId = generateLessionId;
