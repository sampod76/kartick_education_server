"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidation = void 0;
const zod_1 = require("zod");
const createPaymentZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        paymentAmount: zod_1.z.number({ required_error: 'amount is required' }),
        // password: z.string({ required_error: 'Password is required' }),
    }),
});
// *****************************payple *******************
const createPaypleZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        item_list: zod_1.z
            .object({
            items: zod_1.z.array(zod_1.z.object({
                name: zod_1.z.string(),
                sku: zod_1.z.string().optional(),
                price: zod_1.z.string(),
                currency: zod_1.z.string().optional(),
                quantity: zod_1.z.number().optional(),
            })),
        })
            .optional(),
        amount: zod_1.z.object({
            currency: zod_1.z.string().optional(),
            total: zod_1.z.string({ required_error: 'amount is required' }),
        }),
        description: zod_1.z.string().optional(),
    }),
});
exports.PaymentValidation = {
    createPaymentZodSchema,
    createPaypleZodSchema,
};
