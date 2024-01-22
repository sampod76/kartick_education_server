/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import axios from 'axios';
import { Request, Response } from 'express';
import paypal, { Payment } from 'paypal-rest-sdk';
import Stripe from 'stripe';
import config from '../../../config';
import calculateNextBillingDate from '../../../utils/calculateNextBillingDate';
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
  mode: 'sandbox', //  mode:"live"
  client_id: config.paypal.client as string,
  client_secret: config.paypal.secret as string,
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

  const findPackage = (await Package.findById(categoryData?.package)) as any;

  const packageToCategories = findPackage?.categories?.map(
    (singleObject: any) => singleObject.category?.toString(),
  );

  if (!packageToCategories || !findPackage) {
    throw new ApiError(404, 'Do not found package category');
  }
  const allExist = categoryData.categories.every((singleObject: any) =>
    packageToCategories.includes(singleObject.category),
  );

  if (!allExist) {
    throw new ApiError(404, 'This is not approved');
  }
  const newPrice =
    (findPackage[categoryData?.purchase?.label].price +
      findPackage[categoryData?.purchase?.label].each_student_increment *
        categoryData?.total_purchase_student) *
    (findPackage?.type === 'multiple_select'
      ? categoryData?.categories?.length
      : 1);

  //! ------- price configuration ------
  const item = item_list.items[0];
  const price = parseFloat(String(newPrice));
  // Convert the price to a string with exactly 2 decimal places
  const formattedPrice = price.toFixed(2);
  // Update the item's price with the formatted value
  item.price = formattedPrice;

  //! ------- price configuration end ------
  categoryData.user = categoryData.user || req?.user?.id;
  categoryData.expiry_date = calculateNextBillingDate(
    categoryData?.purchase?.label, // example monthly,yearly
  );

  const createPackge = await PendingPurchasePackage.create({
    ...categoryData,
    paymentStatus: 'pending',
  });
  if (!createPackge._id) {
    throw new ApiError(400, 'Something is wrong with purchase');
  }
  const data: any = {
    id: createPackge?._id,
    amount: { total: newPrice, currency: 'USD' },
    platform: 'paypal',
  };

  const encryptData = encryptCryptoData(data, config.encryptCrypto as string);

  const payment: Payment = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      // http://localhost:3000/payment/paypal/success?app=U2FsdGVkX1/W0OEYqkDDooRyGcj23kavmEj7xiedIVIWPAGID8IG1ZaQiYlkUBkTWbXF0CMarK9yjqgXRB7wL0QIfFYyfdgt4FIZNPB8Dcy84ZY+NRGtWx3nkosUhbHXnxHxot79HolUb/a12AAKdQ==&paymentId=PAYID-MWUGVTY45C10167TA709600D&token=EC-0FV098435R815293J&PayerID=L3CREV92USD28
      // this url to get -->paymentId  , PayerID
      return_url: `${config.payment_url.paypal_success_url}?app=${encryptData}`,
      // return_url: `${process.env.LOCALHOST_SERVER_SIDE}/api/v1/payment/success?app=${encriptData}`,
      cancel_url: `${config.payment_url.paypal_cancel_url}`,
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

const checkPaypalPayment = catchAsync(async (req: Request, res: Response) => {
  // http://localhost:3000/payment/paypal/success?app=U2FsdGVkX1/W0OEYqkDDooRyGcj23kavmEj7xiedIVIWPAGID8IG1ZaQiYlkUBkTWbXF0CMarK9yjqgXRB7wL0QIfFYyfdgt4FIZNPB8Dcy84ZY+NRGtWx3nkosUhbHXnxHxot79HolUb/a12AAKdQ==&paymentId=PAYID-MWUGVTY45C10167TA709600D&token=EC-0FV098435R815293J&PayerID=L3CREV92USD28
  // this url to get -->paymentId  , PayerID
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  const app = req.query.app;

  if (
    typeof payerId !== 'string' ||
    typeof paymentId !== 'string' ||
    typeof app !== 'string'
  ) {
    throw new ApiError(400, 'Forbidden access !!');
  }
  const data = decryptCryptoData(
    // because some time whitespace code
    // 'U2FsdGVkX19dOA/shL0SLR2JyDtmLpQJy88CwzgKP18YXxHGl5lrNcVpYOzLeI6ITy/cWRTBrTK0V6PkGhbl1Ik fBtfhZUFBsLHrZmvFNuC4OpxwvY79/xToKurgOskLiz7aazvvxeghiVMtnRfEw=='
    app.split(' ').join('+'),
    config.encryptCrypto as string,
  );

  try {
    // Set up the request headers for authentication
    const authHeader = {
      Authorization: `Basic ${Buffer.from(`${config.paypal.client as string}:${config.paypal.secret as string}`).toString('base64')}`,
      'Content-Type': 'application/json',
    };

    // Make a request to PayPal to execute the payment

    const responseData = await axios.post(
      'https://api.sandbox.paypal.com/v1/payments/payment/' +
        paymentId +
        '/execute',
      { payer_id: payerId },
      { headers: authHeader },
    );
    if (responseData?.data?.state !== 'approved') {
      throw new ApiError(400, 'Payment not approved');
    }

    const find = await PendingPurchasePackage.findOne({
      'payment.transactionId': paymentId,
      paymentStatus: { $in: ['approved', 'rejected'] },
    });

    if (!find?._id) {
      const result = await PendingPurchasePackage.findOneAndUpdate(
        { _id: data.id },
        {
          payment: { transactionId: paymentId, platform: 'paypal' },
          paymentStatus: 'approved',
          // fullPaymentData: responseData?.data,
        },
        {
          new: true,
          runValidators: true,
        },
      );

      if (result?._id) {
        const { payment, _id, ...calldata } = result;
        payment.record = result?._id;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const accepted = await PurchasePackage.create(calldata?._doc);

        return sendResponse<any>(res, {
          success: true,
          message: 'Payment success!',
          data: accepted,
        });
      } else {
        throw new ApiError(400, 'Payment is not success 264');
      }

      // return res.status(200).json({
      //   success: true,
      //   message: 'Payment success!',
      //   payment,
      // });
    } else {
      throw new ApiError(400, 'Payment is not success');
      // return res.send({
      //   success: false,
      //   message: 'You are allrady purchess course',
      // });
    }
  } catch (error: any) {
    throw new ApiError(400, error?.message || 'Payment is not success');
    // return res.status(500).json({
    //   success: false,
    //   message: 'An error occurred during payment execution.',
    // });
  }
});

const cancelPaypalPayment = catchAsync(async (req: Request, res: Response) => {
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
  checkPaypalPayment,
  cancelPaypalPayment,
};
