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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const paypal_rest_sdk_1 = __importDefault(require("paypal-rest-sdk"));
const stripe_1 = __importDefault(require("stripe"));
const encryption_1 = require("../../../helper/encryption");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const catchAsync_1 = __importDefault(require("../../share/catchAsync"));
const model_GeneralUser_1 = require("../generalUser/model.GeneralUser");
const purchased_courses_model_1 = require("../purchased_courses/purchased_courses.model");
// import { v4 as uuidv4 } from 'uuid';
// import { errorLogger, logger } from '../../share/logger';
paypal_rest_sdk_1.default.configure({
    mode: 'sandbox',
    client_id: process.env.PAYPLE_CLIENT_ID,
    client_secret: process.env.PAYPLE_SECRET_KEY,
});
// import { z } from 'zod'
const path_1 = __importDefault(require("path"));
const purchased_courses_service_1 = require("../purchased_courses/purchased_courses.service");
const createPaymentStripe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const stripe = new stripe_1.default(process.env.STRIPE_SK, {
        apiVersion: '2022-11-15',
        typescript: true,
    });
    const { paymentAmount: price, course_id } = req.body;
    const amount = parseFloat(price) * 100;
    const result = yield model_GeneralUser_1.GeneralUser.findById((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id);
    const courseIdExaite = (_b = result === null || result === void 0 ? void 0 : result.purchase_courses) === null || _b === void 0 ? void 0 : _b.find(value => { var _a; return ((_a = value === null || value === void 0 ? void 0 : value.course) === null || _a === void 0 ? void 0 : _a.toString()) === course_id; });
    if (courseIdExaite) {
        return res.status(404).send({
            success: false,
            statusCode: 404,
            message: 'You are already purchased course!!😭😭',
        });
    }
    const paymentIntent = yield stripe.paymentIntents.create({
        amount,
        currency: 'USD',
        payment_method_types: ['card'],
    });
    if (paymentIntent.client_secret) {
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'successfull get secret',
            data: { clientSecret: paymentIntent.client_secret },
        });
    }
    else {
        throw new ApiError_1.default(404, 'Payment faild');
    }
}));
const createPaymentStripeAdvanceForNative = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const { paymentAmount: price, course_id } = req.body;
    const amount = parseFloat(price) * 100;
    //********** */ You are already purchased course!!*******
    const result = yield model_GeneralUser_1.GeneralUser.findById((_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c._id);
    const courseIdExaite = (_d = result === null || result === void 0 ? void 0 : result.purchase_courses) === null || _d === void 0 ? void 0 : _d.find(value => { var _a; return ((_a = value === null || value === void 0 ? void 0 : value.course) === null || _a === void 0 ? void 0 : _a.toString()) === course_id; });
    if (courseIdExaite) {
        return res.status(404).send({
            success: false,
            statusCode: 404,
            message: 'You are already purchased course!!😭😭',
        });
    }
    //********** */ You are already purchased course!!*******
    const stripe = new stripe_1.default(process.env.STRIPE_SK, {
        apiVersion: '2022-11-15',
        typescript: true,
    });
    // Use an existing Customer ID if this is a returning customer.
    const customer = yield stripe.customers.create();
    const ephemeralKey = yield stripe.ephemeralKeys.create({ customer: customer.id }, { apiVersion: '2022-11-15' });
    const paymentIntent = yield stripe.paymentIntents.create({
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
            message: 'successfull get secret',
            data: {
                // paymentIntent: paymentIntent.client_secret,
                clientSecret: paymentIntent.client_secret,
                ephemeralKey: ephemeralKey.secret,
                customer: customer.id,
                publishableKey: process.env.STRIPE_PK,
            },
        });
    }
    else {
        throw new ApiError_1.default(404, 'Payment faild');
    }
}));
// payple intergrate
const createPaymentPayple = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g, _h, _j, _k;
    const { amount, item_list, description } = req.body;
    // const itemSkus = new Set(item_list?.items?.map((item: any) => item?.sku));
    const item = new mongoose_1.Types.ObjectId((_e = item_list === null || item_list === void 0 ? void 0 : item_list.items[0]) === null || _e === void 0 ? void 0 : _e.sku);
    const findByCourse = yield purchased_courses_model_1.Purchased_courses.findOne({
        userId: new mongoose_1.Types.ObjectId((_f = req === null || req === void 0 ? void 0 : req.user) === null || _f === void 0 ? void 0 : _f._id),
        course: new mongoose_1.Types.ObjectId(item),
    });
    if (findByCourse) {
        return res.status(404).send({
            success: false,
            statusCode: 404,
            message: 'You are already purchased course!!😭😭',
        });
    }
    const data = {
        userId: (_g = req === null || req === void 0 ? void 0 : req.user) === null || _g === void 0 ? void 0 : _g._id,
        course_id: item.toString(),
        userName: ((_h = req === null || req === void 0 ? void 0 : req.user) === null || _h === void 0 ? void 0 : _h.name) || '',
        email: ((_j = req === null || req === void 0 ? void 0 : req.user) === null || _j === void 0 ? void 0 : _j.email) || '',
        phone: ((_k = req === null || req === void 0 ? void 0 : req.user) === null || _k === void 0 ? void 0 : _k.phone) || '',
        amount: {
            currency: (amount === null || amount === void 0 ? void 0 : amount.currency) || 'USD',
            total: amount === null || amount === void 0 ? void 0 : amount.total,
        },
    };
    const encriptData = (0, encryption_1.encrypt)(data);
    const payment = {
        intent: 'sale',
        payer: {
            payment_method: 'paypal',
        },
        redirect_urls: {
            return_url: `${process.env.REAL_HOST_SERVER_SIDE}/api/v1/payment/success?app=${encriptData}`,
            // return_url: `${process.env.LOCALHOST_SERVER_SIDE}/api/v1/payment/success?app=${encriptData}`,
            cancel_url: `${process.env.REAL_HOST_SERVER_SIDE}/api/v1/payment/cancel`,
        },
        transactions: [
            {
                item_list,
                amount: {
                    currency: 'USD',
                    total: String(amount === null || amount === void 0 ? void 0 : amount.total),
                },
                description: description,
            },
        ],
    };
    paypal_rest_sdk_1.default.payment.create(payment, (error, payment) => {
        if (error) {
            console.log(error);
            // errorLogger.error(error)
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Payple pryment faild !!!',
            });
        }
        else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.status(200).send({
                        success: true,
                        message: `Successfully Payple payment instant`,
                        data: {
                            url: payment.links[i].href,
                        },
                    });
                }
            }
        }
    });
}));
const chackPayplePayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const app = req.query.app;
    if (typeof payerId !== 'string' ||
        typeof paymentId !== 'string' ||
        typeof app !== 'string') {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'unauthorized access !!');
    }
    const data = (0, encryption_1.decrypt)(app);
    console.log(data, '215');
    const execute_payment_json = {
        payer_id: payerId,
        transactions: [
            {
                amount: data === null || data === void 0 ? void 0 : data.amount,
            },
        ],
    };
    try {
        const payment = yield new Promise((resolve, reject) => {
            paypal_rest_sdk_1.default.payment.execute(paymentId, execute_payment_json, function (error, payment) {
                if (error) {
                    reject(new ApiError_1.default(500, 'Payment is denied'));
                }
                else {
                    resolve(payment);
                }
            });
        });
        console.log(payment);
        // {
        //   id: 'PAYID-MS2BCPA4BT713665C9605913',
        //   intent: 'sale',
        //   state: 'approved',
        //   cart: '0N1193480W3023509',
        //   payer: {
        //     payment_method: 'paypal',
        //     status: 'VERIFIED',
        //     payer_info: {
        //       email: 'sb-4jbgp26719602@personal.example.com',
        //       first_name: 'John',
        //       last_name: 'Doe',
        //       payer_id: 'L3CREV92USD28',
        //       shipping_address: [Object],
        //       country_code: 'US'
        //     }
        //   },
        //   transactions: [
        //     {
        //       amount: [Object],
        //       payee: [Object],
        //       description: 'Payment for order #12345',
        //       item_list: [Object],
        //       related_resources: [Array]
        //     }
        //   ],
        //   failed_transactions: [],
        //   create_time: '2023-07-16T15:48:12Z',
        //   update_time: '2023-07-16T15:54:15Z',
        //   links: [
        //     {
        //       href: 'https://api.sandbox.paypal.com/v1/payments/payment/PAYID-MS2BCPA4BT713665C9605913',
        //       rel: 'self',
        //       method: 'GET'
        //     }
        //   ],
        //   httpStatusCode: 200
        // }
        if (!((payment === null || payment === void 0 ? void 0 : payment.state) === 'approved')) {
            return res.sendFile(path_1.default.join(path_1.default.join(__dirname, '../../../views/sumthingWrong.html')));
        }
        const find = yield purchased_courses_model_1.Purchased_courses.findOne({
            transactionID: paymentId,
        });
        if (!(find === null || find === void 0 ? void 0 : find._id)) {
            const result = yield purchased_courses_service_1.Purchased_coursesService.createPurchased_coursesByDb({
                userId: data.userId,
                course: data.course_id,
                userName: data === null || data === void 0 ? void 0 : data.userName,
                email: data === null || data === void 0 ? void 0 : data.email,
                phone: data === null || data === void 0 ? void 0 : data.phone,
                transactionID: paymentId,
            }, data.userId);
            if (!(result === null || result === void 0 ? void 0 : result.userId)) {
                console.log(result, '312');
                return res.sendFile(path_1.default.join(path_1.default.join(__dirname, '../../../views/sumthingWrong.html')));
                return res.status(400).json({
                    success: false,
                    message: 'Payment failed!',
                });
            }
            else {
                return res.sendFile(path_1.default.join(__dirname, '../../../views/success.html'));
            }
            // return res.status(200).json({
            //   success: true,
            //   message: 'Payment success!',
            //   payment,
            // });
        }
        else {
            console.log(323);
            return res.sendFile(path_1.default.join(path_1.default.join(__dirname, '../../../views/allredybuye.html')));
            // return res.send({
            //   success: false,
            //   message: 'You are allrady purchess course',
            // });
        }
    }
    catch (error) {
        console.log(333);
        return res.sendFile(path_1.default.join(path_1.default.join(__dirname, '../../../views/sumthingWrong.html')));
        // return res.status(500).json({
        //   success: false,
        //   message: 'An error occurred during payment execution.',
        // });
    }
}));
const canclePayplePayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // return res.status(400).json({
    //   success: false,
    //   message: 'cancle your payment request',
    // });
    return res.sendFile(path_1.default.join(__dirname, '../../../views/cancle.html'));
}));
exports.createPaymentController = {
    createPaymentStripe,
    createPaymentStripeAdvanceForNative,
    createPaymentPayple,
    chackPayplePayment,
    canclePayplePayment,
};
