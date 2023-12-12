"use strict";
// import { Contest } from './photoContest.model';
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
exports.generateContestId = exports.findLastContestId = void 0;
const run_contest_model_1 = require("./run_contest.model");
const findLastContestId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastContestId = yield run_contest_model_1.RunContest.findOne({}, { contestId: 1, _id: 0 })
        .sort({ createdAt: -1 })
        .lean();
    return (lastContestId === null || lastContestId === void 0 ? void 0 : lastContestId.contestId) ? lastContestId.contestId : undefined;
});
exports.findLastContestId = findLastContestId;
const generateContestId = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentId = (yield (0, exports.findLastContestId)()) || 0;
    // increment by 1
    const incrementId = Number(currentId) + 1;
    return incrementId;
});
exports.generateContestId = generateContestId;
