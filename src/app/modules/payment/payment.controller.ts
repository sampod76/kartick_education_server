// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { Request, Response } from 'express';
// import httpStatus from 'http-status';
// import { Types } from 'mongoose';
// import paypal, { Payment } from 'paypal-rest-sdk';
// import Stripe from 'stripe';
// import { decrypt, encrypt } from '../../../helper/encryptionJwt';
// import ApiError from '../../errors/ApiError';
// import { IEncodedPaymentData } from '../../interface/encrypt';
// import catchAsync from '../../share/catchAsync';
// import { GeneralUser } from '../generalUser/model.GeneralUser';
// import { Purchased_courses } from '../purchased_courses/purchased_courses.model';
// // import { v4 as uuidv4 } from 'uuid';

// // import { errorLogger, logger } from '../../share/logger';
// paypal.configure({
//   mode: 'sandbox',
//   client_id: process.env.PAYPLE_CLIENT_ID as string,
//   client_secret: process.env.PAYPLE_SECRET_KEY as string,
// });

// // import { z } from 'zod'
// import path from 'path';
// import { Purchased_coursesService } from '../purchased_courses/purchased_courses.service';
// const createPaymentStripe = catchAsync(async (req: Request, res: Response) => {
//   const stripe = new Stripe(process.env.STRIPE_SK as string, {
//     apiVersion: '2022-11-15',
//     typescript: true,
//   });
//   const { paymentAmount: price, course_id } = req.body;
//   const amount: number = parseFloat(price) * 100;

//   const result = await GeneralUser.findById(req?.user?._id);
//   const courseIdExaite = result?.purchase_courses?.find(
//     value => value?.course?.toString() === course_id
//   );

//   if (courseIdExaite) {
//     return res.status(404).send({
//       success: false,
//       statusCode: 404,
//       message: 'You are already purchased course!!😭😭',
//     });
//   }

//   const paymentIntent: Stripe.PaymentIntent =
//     await stripe.paymentIntents.create({
//       amount,
//       currency: 'USD',
//       payment_method_types: ['card'],
      
//     });

//   if (paymentIntent.client_secret) {
//     res.status(200).send({
//       success: true,
//       statusCode: 200,
//       message: 'successfull get secret',
//       data: { clientSecret: paymentIntent.client_secret },
//     });
//   } else {
//     throw new ApiError(404, 'Payment faild');
//   }
// });

// const createPaymentStripeAdvanceForNative = catchAsync(
//   async (req: Request, res: Response) => {
//     const { paymentAmount: price, course_id } = req.body;
//     const amount: number = parseFloat(price) * 100;

//     //********** */ You are already purchased course!!*******
//     const result = await GeneralUser.findById(req?.user?._id);
//     const courseIdExaite = result?.purchase_courses?.find(
//       value => value?.course?.toString() === course_id
//     );
//     if (courseIdExaite) {
//       return res.status(404).send({
//         success: false,
//         statusCode: 404,
//         message: 'You are already purchased course!!😭😭',
//       });
//     }
//     //********** */ You are already purchased course!!*******

//     const stripe = new Stripe(process.env.STRIPE_SK as string, {
//       apiVersion: '2022-11-15',
//       typescript: true,
//     });

//     // Use an existing Customer ID if this is a returning customer.
//     const customer = await stripe.customers.create();
//     const ephemeralKey = await stripe.ephemeralKeys.create(
//       { customer: customer.id },
//       { apiVersion: '2022-11-15' }
//     );
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount,
//       currency: 'USD',
//       customer: customer.id,
//       automatic_payment_methods: {
//         enabled: true,
//       },
      
//     });

//     if (paymentIntent.client_secret) {
//       return res.status(200).send({
//         success: true,
//         statusCode: 200,
//         message: 'successfull get secret',
//         data: {
//           // paymentIntent: paymentIntent.client_secret,
//           clientSecret: paymentIntent.client_secret,
//           ephemeralKey: ephemeralKey.secret,
//           customer: customer.id,
//           publishableKey: process.env.STRIPE_PK,
//         },
//       });
//     } else {
//       throw new ApiError(404, 'Payment faild');
//     }
//   }
// );

// // payple intergrate
// const createPaymentPayple = catchAsync(async (req: Request, res: Response) => {
//   const { amount, item_list, description } = req.body;

//   // const itemSkus = new Set(item_list?.items?.map((item: any) => item?.sku));
//   const item = new Types.ObjectId(item_list?.items[0]?.sku);
//   const findByCourse = await Purchased_courses.findOne({
//     userId: new Types.ObjectId(req?.user?._id),
//     course: new Types.ObjectId(item),
//   });

//   if (findByCourse) {
//     return res.status(404).send({
//       success: false,
//       statusCode: 404,
//       message: 'You are already purchased course!!😭😭',
//     });
//   }

//   const data: IEncodedPaymentData = {
//     userId: req?.user?._id,
//     course_id: item.toString(),
//     userName: req?.user?.name || '',
//     email: req?.user?.email || '',
//     phone: req?.user?.phone || '',
//     amount: {
//       currency: amount?.currency || 'USD',
//       total: amount?.total,
//     },
//   };

//   const encryptData = encrypt(data);

//   const payment: Payment = {
//     intent: 'sale',
//     payer: {
//       payment_method: 'paypal',
//     },
//     redirect_urls: {
//       return_url: `${process.env.REAL_HOST_SERVER_SIDE}/api/v1/payment/success?app=${encryptData}`,
//       // return_url: `${process.env.LOCALHOST_SERVER_SIDE}/api/v1/payment/success?app=${encriptData}`,
//       cancel_url: `${process.env.REAL_HOST_SERVER_SIDE}/api/v1/payment/cancel`,
//     },
//     transactions: [
//       {
//         item_list,
//         amount: {
//           currency: 'USD',
//           total: String(amount?.total),
//         },
//         description: description,
//       },
//     ],
//   };

//   paypal.payment.create(payment, (error: any, payment: any) => {
//     if (error) {
//       console.log(error);
//       // errorLogger.error(error)
//       return res.status(404).send({
//         success: false,
//         statusCode: 404,
//         message: 'Paypal payment fail !!!',
//       });
//     } else {
//       for (let i = 0; i < payment.links.length; i++) {
//         if (payment.links[i].rel === 'approval_url') {
//           res.status(200).send({
//             success: true,
//             message: `Successfully Paypal payment instant`,
//             data: {
//               url: payment.links[i].href,
//             },
//           });
//         }
//       }
//     }
//   });
// });

// const chackPayplePayment = catchAsync(async (req: Request, res: Response) => {
//   const payerId = req.query.PayerID;
//   const paymentId = req.query.paymentId;
//   const app = req.query.app;
//   if (
//     typeof payerId !== 'string' ||
//     typeof paymentId !== 'string' ||
//     typeof app !== 'string'
//   ) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'unauthorized access !!');
//   }
//   const data = decrypt(app);
  
//   const execute_payment_json = {
//     payer_id: payerId,
//     transactions: [
//       {
//         amount: data?.amount,
//       },
//     ],
//   };

//   try {
//     const payment: Payment = await new Promise((resolve, reject) => {
//       paypal.payment.execute(
//         paymentId,
//         execute_payment_json,
//         function (error, payment) {
//           if (error) {
//             reject(new ApiError(500, 'Payment is denied'));
//           } else {
//             resolve(payment);
//           }
//         }
//       );
//     });
//     console.log(payment);

//     /* 
//     {
//       id: 'PAYID-MS2BCPA4BT713665C9605913',
//       intent: 'sale',
//       state: 'approved',
//       cart: '0N1193480W3023509',
//       payer: {
//         payment_method: 'paypal',
//         status: 'VERIFIED',
//         payer_info: {
//           email: 'sb-4jbgp26719602@personal.example.com',
//           first_name: 'John',
//           last_name: 'Doe',
//           payer_id: 'L3CREV92USD28',
//           shipping_address: [Object],
//           country_code: 'US'
//         }
//       },
//       transactions: [
//         {
//           amount: [Object],
//           payee: [Object],
//           description: 'Payment for order #12345',
//           item_list: [Object],
//           related_resources: [Array]
//         }
//       ],
//       failed_transactions: [],
//       create_time: '2023-07-16T15:48:12Z',
//       update_time: '2023-07-16T15:54:15Z',
//       links: [
//         {
//           href: 'https://api.sandbox.paypal.com/v1/payments/payment/PAYID-MS2BCPA4BT713665C9605913',
//           rel: 'self',
//           method: 'GET'
//         }
//       ],
//       httpStatusCode: 200
//     }
//      */
    
//     // if payment status not approved then throw error
//     if (!(payment?.state === 'approved')) {
//       return res.sendFile(
//         path.join(path.join(__dirname, '../../../views/sumthingWrong.html'))
//       );
//     }

//     const find = await Purchased_courses.findOne({
//       transactionID: paymentId,
//     });

//     if (!find?._id) {
//       const result = await Purchased_coursesService.createPurchased_coursesByDb(
//         {
//           userId: data.userId,
//           course: data.course_id,
//           userName: data?.userName,
//           email: data?.email,
//           phone: data?.phone,
//           transactionID: paymentId,
//         },
//         data.userId
//       );

//       if (!result?.userId) {
//         console.log(result, '312');
//         return res.sendFile(
//           path.join(path.join(__dirname, '../../../views/sumthingWrong.html'))
//         );
//         // return res.status(400).json({
//         //   success: false,
//         //   message: 'Payment failed!',
//         // });
//       } else {
//         return res.sendFile(
//           path.join(__dirname, '../../../views/success.html')
//         );
//       }

//       // return res.status(200).json({
//       //   success: true,
//       //   message: 'Payment success!',
//       //   payment,
//       // });
//     } else {
//       console.log(323);
//       return res.sendFile(
//         path.join(path.join(__dirname, '../../../views/allredybuye.html'))
//       );
//       // return res.send({
//       //   success: false,
//       //   message: 'You are allrady purchess course',
//       // });
//     }
//   } catch (error) {
//     console.log(333);
//     return res.sendFile(
//       path.join(path.join(__dirname, '../../../views/sumthingWrong.html'))
//     );
//     // return res.status(500).json({
//     //   success: false,
//     //   message: 'An error occurred during payment execution.',
//     // });
//   }
// });

// const canclePayplePayment = catchAsync(async (req: Request, res: Response) => {
//   // return res.status(400).json({
//   //   success: false,
//   //   message: 'cancle your payment request',
//   // });
//   return res.sendFile(path.join(__dirname, '../../../views/cancle.html'));
// });

// export const createPaymentController = {
//   createPaymentStripe,
//   createPaymentStripeAdvanceForNative,
//   createPaymentPayple,
//   chackPayplePayment,
//   canclePayplePayment,
// };
