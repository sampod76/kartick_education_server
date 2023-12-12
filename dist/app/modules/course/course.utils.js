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
exports.generateCourseId = exports.findLastCourseId = void 0;
const course_model_1 = require("./course.model");
const findLastCourseId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastCourseId = yield course_model_1.Course.findOne({}, { courseId: 1, _id: 0 })
        .sort({ createdAt: -1 })
        .lean();
    return (lastCourseId === null || lastCourseId === void 0 ? void 0 : lastCourseId.courseId) ? lastCourseId.courseId : undefined;
});
exports.findLastCourseId = findLastCourseId;
const generateCourseId = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentId = (yield (0, exports.findLastCourseId)()) || (0).toString().padStart(3, '0');
    // increment by 1
    const incrementId = (Number(currentId) + 1).toString().padStart(3, '0');
    return incrementId;
});
exports.generateCourseId = generateCourseId;
