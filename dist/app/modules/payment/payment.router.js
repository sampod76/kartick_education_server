"use strict";
// import express from 'express';
// import { ENUM_USER_ROLE } from '../../../enums/users';
// import authMiddleware from '../../middlewares/authMiddleware';
// import validateRequestZod from '../../middlewares/validateRequestZod';
// import { createPaymentController } from './payment.controller';
// import { PaymentValidation } from './payment.validation';
// const router = express.Router();
// // router
// //   .route('/create-payment-intent')
// //   .post(
// //     authMiddleware(ENUM_USER_ROLE.GENERAL_USER),
// //     validateRequestZod(PaymentValidation.createPaymentZodSchema),
// //     createPaymentController.createPaymentStripe
// //   );
// // stripe
// router
//   .route('/create-payment-intent')
//   .post(
//     authMiddleware(ENUM_USER_ROLE.GENERAL_USER),
//     validateRequestZod(PaymentValidation.createPaymentZodSchema),
//     createPaymentController.createPaymentStripeAdvanceForNative
//   );
// // ! ------------- paypal --start--------
// router
//   .route('/paypal')
//   .post(
//     authMiddleware(ENUM_USER_ROLE.GENERAL_USER,ENUM_USER_ROLE.ADMIN),
//     validateRequestZod(PaymentValidation.createPaypleZodSchema),
//     createPaymentController.createPaymentPayple
//   );
// router.route('/success').get(createPaymentController.chackPayplePayment);
// router.route('/cancle').get(createPaymentController.canclePayplePayment);
// export const PaymentRoute = router;
