"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchasedCoursesValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const IPaymentSchema = zod_1.default
    .object({
    method: zod_1.default.string().trim().optional(),
    method_TransactionID: zod_1.default.string().trim().optional(),
    paymentType: zod_1.default.string().optional(),
})
    .optional();
const cteateZodPurchasedCoursesSchema = zod_1.default.object({
    body: zod_1.default.object({
        userId: zod_1.default.string().nonempty({ message: 'User ID is required' }),
        userName: zod_1.default.string().trim().nonempty({ message: 'User name is required' }),
        email: zod_1.default.string().trim().email().optional(),
        phone: zod_1.default.string().trim().optional(),
        payment: IPaymentSchema,
        transactionID: zod_1.default.string().optional(),
        course: zod_1.default.string().nonempty({ message: 'Course _id is required' }),
        courseId: zod_1.default.string().trim().optional(),
    }),
});
// *************** update ********************
const IPaymentSchemaUpdate = zod_1.default
    .object({
    price: zod_1.default
        .number()
        .nonnegative({ message: 'price must be a non-negative number' })
        .optional(),
    vat: zod_1.default.number().optional(),
    discount: zod_1.default.number().optional(),
    total: zod_1.default
        .number()
        .nonnegative({ message: 'Total must be a non-negative number' })
        .optional(),
    method: zod_1.default.string().trim().optional(),
    method_TransactionID: zod_1.default.string().trim().optional(),
})
    .optional();
const updateZodPurchasedCoursesSchema = zod_1.default.object({
    body: zod_1.default.object({
        userId: zod_1.default.string().optional(),
        userName: zod_1.default.string().trim().optional(),
        email: zod_1.default.string().trim().email().optional(),
        phone: zod_1.default.string().trim().optional(),
        payment: IPaymentSchemaUpdate.optional(),
        transactionID: zod_1.default.string().optional(),
        course: zod_1.default.string().optional(),
        courseId: zod_1.default.string().optional(),
    }),
});
exports.PurchasedCoursesValidation = {
    cteateZodPurchasedCoursesSchema,
    updateZodPurchasedCoursesSchema,
};
