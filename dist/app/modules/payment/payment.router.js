"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoute = void 0;
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const validateRequestZod_1 = __importDefault(require("../../middlewares/validateRequestZod"));
const payment_controller_1 = require("./payment.controller");
const payment_validation_1 = require("./payment.validation");
const router = express_1.default.Router();
// router
//   .route('/create-payment-intent')
//   .post(
//     authMiddleware(ENUM_USER_ROLE.GENERAL_USER),
//     validateRequestZod(PaymentValidation.createPaymentZodSchema),
//     createPaymentController.createPaymentStripe
//   );
router
    .route('/create-payment-intent')
    .post((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.GENERAL_USER), (0, validateRequestZod_1.default)(payment_validation_1.PaymentValidation.createPaymentZodSchema), payment_controller_1.createPaymentController.createPaymentStripeAdvanceForNative);
router
    .route('/paypal')
    .post((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.GENERAL_USER), (0, validateRequestZod_1.default)(payment_validation_1.PaymentValidation.createPaypleZodSchema), payment_controller_1.createPaymentController.createPaymentPayple);
router.route('/success').get(payment_controller_1.createPaymentController.chackPayplePayment);
router.route('/cancle').get(payment_controller_1.createPaymentController.canclePayplePayment);
exports.PaymentRoute = router;
