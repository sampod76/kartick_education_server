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
exports.Purchased_courses = void 0;
const mongoose_1 = require("mongoose");
const course_model_1 = require("../course/course.model");
const purchasedCoursesSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Types.ObjectId,
        ref: 'General_user',
        required: true,
    },
    userName: {
        type: String,
        trim: true,
        // required: true,
    },
    email: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    payment: {
        type: {
            price: {
                // not provide
                type: Number,
                trim: true,
            },
            vat: {
                // not provide
                type: Number,
            },
            discount: {
                // not provide
                type: Number,
            },
            total: {
                // not provide
                type: Number,
            },
            method: {
                type: String,
                enum: ['stripe', 'paypal', 'manual', 'free', 'other'],
            },
            paymentType: {
                type: String,
                // enum: ['card'],
                default: 'card',
            },
            method_TransactionID: {
                //
                type: String,
            },
        },
        default: {},
    },
    course: {
        // couser-> _id
        type: mongoose_1.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    transactionID: String, // not provide
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
// All calculations will be done here while buying any product
purchasedCoursesSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { price = 0, discount = { value: 0 }, vat = 0, } = (yield course_model_1.Course.findById(this.course));
        if ((discount.expiryDate && new Date(discount.expiryDate) < new Date()) ||
            (discount.startDate && new Date(discount.startDate) > new Date())) {
            discount.value = 0;
        }
        const afterDiscount = price - (price / 100) * discount.value;
        this.payment.total = afterDiscount + (afterDiscount / 100) * vat;
        this.payment.discount = discount.value;
        this.payment.vat = vat;
        this.payment.price = price;
        next();
        // Math.random().toString(16).slice(2);
    });
});
exports.Purchased_courses = (0, mongoose_1.model)('PurchasedCourses', purchasedCoursesSchema);
