/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import paypal, { Payment } from 'paypal-rest-sdk';
import Stripe from 'stripe';
import config from '../../../config';
import {
  decryptCryptoData,
  encryptCryptoData,
} from '../../../utils/cryptoEncryptDecrypt';
import ApiError from '../../errors/ApiError';
import catchAsync from '../../share/catchAsync';
import sendResponse from '../../share/sendResponse';
import { Package } from '../package/package.model';
import {
  PendingPurchasePackage,
  PurchasePackage,
} from '../purchase_package/purchase_package.model';

// import { v4 as uuidv4 } from 'uuid';

// import { errorLogger, logger } from '../../share/logger';
paypal.configure({
  mode: 'sandbox',
  client_id: config.paypal.client as string,
  client_secret:
    config.paypal.secret as string,
});

// import { z } from 'zod'

const createPaymentStripe = catchAsync(async (req: Request, res: Response) => {
  const stripe = new Stripe(process.env.STRIPE_SK as string, {
    apiVersion: '2023-10-16',
    typescript: true,
  });
  const { products } = req.body;

  const lineItems = products.map((product: any) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: product.name,
        images: [product.img],
      },
      unit_amount: Math.round(Number(product.price) * 100),
    },
    quantity: product.quantity || 1,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: config.payment_url.stripe_success_url,
    cancel_url: config.payment_url.stripe_cancel_url,
  });
  if (session?.id) {
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: 'successfull get secret',
      data: { id: session?.id },
    });
  } else {
    throw new ApiError(404, 'Payment failed');
  }
});

const createPaymentStripeAdvanceForNative = catchAsync(
  async (req: Request, res: Response) => {
    const { paymentAmount: price, course_id } = req.body;
    const amount: number = parseFloat(price) * 100;
    const stripe = new Stripe(process.env.STRIPE_SK as string, {
      apiVersion: '2023-10-16',
      typescript: true,
    });

    // Use an existing Customer ID if this is a returning customer.
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2022-11-15' },
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'USD',
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    if (paymentIntent.client_secret) {
      return res.status(200).send({
        success: true,
        statusCode: 200,
        message: 'successful get secret',
        data: {
          // paymentIntent: paymentIntent.client_secret,
          clientSecret: paymentIntent.client_secret,
          ephemeralKey: ephemeralKey.secret,
          customer: customer.id,
          publishableKey: process.env.STRIPE_PK,
        },
      });
    } else {
      throw new ApiError(404, 'Payment failed');
    }
  },
);

// // payple intergrate
const createPaymentPayple = catchAsync(async (req: Request, res: Response) => {
  const { amount, item_list, description, data: categoryData } = req.body;
  //
  const item = item_list.items[0];
  const price = parseFloat(item.price);
  // Convert the price to a string with exactly 2 decimal places
  const formattedPrice = price.toFixed(2);
  // Update the item's price with the formatted value
  item.price = formattedPrice;
  //
  const findPriducts = await Package.findById(item.sku);

  const createPackge = await PurchasePackage.create({
    ...categoryData,
    paymentStatus: 'pending',
  });
  if (!createPackge._id) {
    throw new ApiError(400, 'Something is wrong with purchase');
  }
  const data: any = {
    // id: createPackge?._id,
  };

  const encryptData = encryptCryptoData(data, config.encryptCrypto as string);

  const payment: Payment = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      return_url: `${config.payment_url.stripe_success_url}?app=${encryptData}`,
      // return_url: `${process.env.LOCALHOST_SERVER_SIDE}/api/v1/payment/success?app=${encriptData}`,
      cancel_url: `${config.payment_url.stripe_cancel_url}`,
    },
    transactions: [
      {
        item_list,
        amount: {
          currency: 'USD',
          total: formattedPrice,
        },
        description: description || '',
      },
    ],
  };

  paypal.payment.create(payment, (error: any, payment: any) => {
    if (error) {
      console.log(error, 'ddd');
      // errorLogger.error(error)
      return res.status(404).send({
        success: false,
        statusCode: 404,
        message: error,
      });
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          res.status(200).send({
            success: true,
            message: `Successfully Paypal payment instant`,
            data: {
              url: payment.links[i].href,
            },
          });
        }
      }
    }
  });
});

const chackPayplePayment = catchAsync(async (req: Request, res: Response) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  const app = req.query.app;
  if (
    typeof payerId !== 'string' ||
    typeof paymentId !== 'string' ||
    typeof app !== 'string'
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'unauthorized access !!');
  }
  const data = decryptCryptoData(app, config.encryptCrypto as string);

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: data?.amount,
      },
    ],
  };

  try {
    const payment: Payment = await new Promise((resolve, reject) => {
      paypal.payment.execute(
        paymentId,
        execute_payment_json,
        function (error, payment) {
          if (error) {
            reject(new ApiError(500, 'Payment is denied'));
          } else {
            resolve(payment);
          }
        },
      );
    });
    console.log(payment);

    /*
    {
      id: 'PAYID-MS2BCPA4BT713665C9605913',
      intent: 'sale',
      state: 'approved',
      cart: '0N1193480W3023509',
      payer: {
        payment_method: 'paypal',
        status: 'VERIFIED',
        payer_info: {
          email: 'sb-4jbgp26719602@personal.example.com',
          first_name: 'John',
          last_name: 'Doe',
          payer_id: 'L3CREV92USD28',
          shipping_address: [Object],
          country_code: 'US'
        }
      },
      transactions: [
        {
          amount: [Object],
          payee: [Object],
          description: 'Payment for order #12345',
          item_list: [Object],
          related_resources: [Array]
        }
      ],
      failed_transactions: [],
      create_time: '2023-07-16T15:48:12Z',
      update_time: '2023-07-16T15:54:15Z',
      links: [
        {
          href: 'https://api.sandbox.paypal.com/v1/payments/payment/PAYID-MS2BCPA4BT713665C9605913',
          rel: 'self',
          method: 'GET'
        }
      ],
      httpStatusCode: 200
    }
     */

    // if payment status not approved then throw error
    // if (!(payment?.state === 'approved')) {
    //   return res.sendFile(
    //     path.join(path.join(__dirname, '../../../views/sumthingWrong.html'))
    //   );
    // }
    if (!(payment?.state === 'approved')) {
      throw new ApiError(404, 'Payment not approved');
    }

    const find = await PendingPurchasePackage.findOne({
      'payment.transactionId': paymentId,
      paymentStatus: { $or: ['approved', 'rejected'] },
    });

    if (!find?._id) {
      const result = await PendingPurchasePackage.findOneAndUpdate(
        { _id: data.id },
        {
          payment: { transactionId: paymentId, platform: 'paypal' },
          paymentStatus: 'approved',
        },
        {
          new: true,
          runValidators: true,
        },
      );
      if (result?._id) {
        const { payment, ...allData } = result;
        payment.record = result._id;
        const accepted = await PurchasePackage.create({ ...result, payment });
        return sendResponse<any>(res, {
          success: true,
          message: 'Payment success!',
          data: accepted,
        });
      }

      // return res.status(200).json({
      //   success: true,
      //   message: 'Payment success!',
      //   payment,
      // });
    } else {
      throw new ApiError(404, 'Payment is not success');
      // return res.send({
      //   success: false,
      //   message: 'You are allrady purchess course',
      // });
    }
  } catch (error: any) {
    console.log(333);
    throw new ApiError(404, error?.message || 'Payment is not success');
    // return res.status(500).json({
    //   success: false,
    //   message: 'An error occurred during payment execution.',
    // });
  }
});

const canclePayplePayment = catchAsync(async (req: Request, res: Response) => {
  // return res.status(400).json({
  //   success: false,
  //   message: 'cancle your payment request',
  // });
  // return res.sendFile(path.join(__dirname, '../../../views/cancle.html'));
});

export const createPaymentController = {
  createPaymentStripe,
  createPaymentStripeAdvanceForNative,
  createPaymentPayple,
  chackPayplePayment,
  canclePayplePayment,
};
