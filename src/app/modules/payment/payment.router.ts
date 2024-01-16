import express from 'express';

import validateRequestZod from '../../middlewares/validateRequestZod';
import { createPaymentController } from './payment.controller';
import { PaymentValidation } from './payment.validation';

const router = express.Router();

router
  .route('/stripe/create-payment-intent')
  .post(
   
    validateRequestZod(PaymentValidation.createPaymentZodSchema),
    createPaymentController.createPaymentStripe
  );
// stripe
// router
//   .route('/create-payment-intent')
//   .post(
//     authMiddleware(ENUM_USER_ROLE.SELLER,ENUM_USER_ROLE.STUDENT),
//     validateRequestZod(PaymentValidation.createPaymentZodSchema),
//     createPaymentController.createPaymentStripeAdvanceForNative
//   );

// ! ------------- paypal --start--------
// router
//   .route('/paypal')
//   .post(
//     authMiddleware(ENUM_USER_ROLE.SELLER,ENUM_USER_ROLE.STUDENT),
//     validateRequestZod(PaymentValidation.createPaypleZodSchema),
//     createPaymentController.createPaymentPayple
//   );

// router.route('/success').get(createPaymentController.chackPayplePayment);
// router.route('/cancle').get(createPaymentController.canclePayplePayment);

export const PaymentRoute = router;
