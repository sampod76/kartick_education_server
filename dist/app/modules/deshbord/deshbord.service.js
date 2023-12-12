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
exports.deshbordService = void 0;
const admin_model_1 = require("../admin/admin.model");
const model_GeneralUser_1 = require("../generalUser/model.GeneralUser");
const moderator_model_1 = require("../moderator/moderator.model");
const course_model_1 = require("../course/course.model");
const lession_model_1 = require("../lession/lession.model");
const purchased_courses_model_1 = require("../purchased_courses/purchased_courses.model");
const deshbordFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUser = yield model_GeneralUser_1.GeneralUser.countDocuments();
    const totalAdmin = yield admin_model_1.Admin.countDocuments();
    const totalModarator = yield moderator_model_1.Moderator.countDocuments();
    const totalCourse = yield course_model_1.Course.countDocuments();
    const recentPublishCourse = yield course_model_1.Course.find()
        .sort({ createdAt: -1 })
        .limit(15);
    const recentPublishLession = yield lession_model_1.Lession.find()
        .sort({ createdAt: -1 })
        .limit(15);
    // const res;
    // const totalPurchase = await Purchased_courses.countDocuments();
    // const totalAmount = await Purchased_courses.aggregate([
    //   { $group: { _id: null, totalPrice: { $sum: '$payment.total' } } },
    // ]);
    const totalPurchasedHistery = yield purchased_courses_model_1.Purchased_courses.aggregate([
        {
            $facet: {
                totalPurchaseCount: [{ $match: {} }, { $count: 'totalPurchase' }],
                totalPurchaseAmount: [
                    { $group: { _id: null, totalPrice: { $sum: '$payment.total' } } },
                ],
                recentPurchase: [
                    { $match: {} },
                    { $sort: { createdAt: -1 } },
                    { $limit: 15 },
                ],
            },
        },
    ]);
    return {
        totalUser,
        totalAdmin,
        totalModarator,
        totalCourse,
        // totalPurchase,
        totalPurchasedHistery,
        recentPublishCourse,
        recentPublishLession,
    };
});
exports.deshbordService = {
    deshbordFromDb,
};
