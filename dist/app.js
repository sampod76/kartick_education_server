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
/* eslint-disable @typescript-eslint/no-unused-vars */
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const paypal_rest_sdk_1 = __importDefault(require("paypal-rest-sdk"));
// create xss-clean.d.ts file after work this xss
const path_1 = __importDefault(require("path"));
// import xss from 'xss-clean';
const helmet_1 = __importDefault(require("helmet"));
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
// import { uploadSingleImage } from './app/middlewares/uploader.multer';
const index_route_1 = __importDefault(require("./app/routes/index_route"));
const app = (0, express_1.default)();
// app.use(cors());
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: ['https://salontrainingpro.app', 'http://localhost:3000'],
    credentials: true,
}));
// app.use(
//   cors({
//     origin: '*',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//   })
// );
//  app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", 'https://salontrainingpro.app')
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept")
//   next()
// })
// const allowedHeaders = [
//   'Origin',
//   'X-Requested-With',
//   'Content-Type',
//   'Accept',
//   'Authorization',
// ];
// app.use(
//   cors({
//     origin: 'https://salontrainingpro.app',
//     allowedHeaders: allowedHeaders,
//   })
// );
// app.use(xss());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
paypal_rest_sdk_1.default.configure({
    mode: 'sandbox',
    client_id: process.env.PAYPLE_CLIENT_ID,
    client_secret: process.env.PAYPLE_SECRET_KEY,
});
const run = (req, res, next) => {
    try {
        // jwtHelpers.verifyToken(`${req.headers.authorization}`, config.jwt.secret as string);
        // console.log('first');
        next();
    }
    catch (error) {
        next(error);
    }
};
app.use('/images', run, express_1.default.static(path_1.default.join(__dirname, '../dist/uploadFile/images/')));
app.use('/profile', run, express_1.default.static(path_1.default.join(__dirname, '../dist/uploadFile/profile/')));
app.use('/vedios', run, express_1.default.static(path_1.default.join(__dirname, '../dist/uploadFile/vedios/')));
app.set('view engine', 'ejs');
app.set('views', path_1.default.resolve('./views/success.ejs'));
app.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.send({ message: 'server is running....' });
    }
    catch (error) {
        next(error);
    }
    // res.send('server is running');
}));
/*
 const revenuecat = new Revenuecat({
  secretKey: "sk_AwzheKPxGcMLbnqWdOeFWhRfcwKIA",
  iosKey: "993dd49ebcba4546aa3c4657330ac6e0",
  androidKey: process.env.androidKey as string,
})
*/
const test = () => __awaiter(void 0, void 0, void 0, function* () {
    /*
     const url = 'https://api.revenuecat.com/v1/apps/appcadee85965/subscribers/882b1b28b5664a0ea3ecc7a6efb56b9b';
    
      try {
    const data =await revenuecat
    .getSubscriptions({ userId:"$RCAnonymousID:882b1b28b5664a0ea3ecc7a6efb56b9b" })
    // .then(res => console.log(res.subscriber, 'getSubscriptions'))
    console.log(data);
      } catch (error) {
        console.error('Error fetching data:', error);
       
      }
      */
    //  const result= await firebaseAdmin.auth().setCustomUserClaims("St9VaFVV3JX8QFEGwFQd3A3psR23",{_id:"650fd9626e7c6052b7e19242",role:"general-user"});
    // console.log(result);
    // const updateArray = await Course.find({});
    // const promess: any = [];
    // updateArray.forEach((data, index) => {
    //   console.log(index);
    //   promess.push(
    //     Course.findByIdAndUpdate(data._id, {
    //       courseId: `00${index + 1}`,
    //     })
    //   );
    // });
    // Promise.all(promess).then(values => {
    //   console.log(values);
    // });
});
test();
//Application route
app.use('/api/v1', index_route_1.default);
// Set the views directory and the view engine
// global error handlar
app.use(globalErrorHandler_1.default);
//handle not found route
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).send({
        success: false,
        message: 'Not found route',
        errorMessages: [
            {
                path: req.originalUrl,
                message: 'api not found',
            },
        ],
    });
    next();
});
exports.default = app;
