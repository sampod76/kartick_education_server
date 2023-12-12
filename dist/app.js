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
const xss_clean_1 = __importDefault(require("xss-clean"));
const app = (0, express_1.default)();
// app.use(cors());
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
app.use((0, xss_clean_1.default)());
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
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
// import { uploadSingleImage } from './app/middlewares/uploader.multer';
const index_route_1 = __importDefault(require("./app/routes/index_route"));
app.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.send({ message: 'server is running....' });
    }
    catch (error) {
        next(error);
    }
    // res.send('server is running');
}));
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
const test = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(result, result2);
        // const result = await Lession.updateMany(
        //   {},
        //   {
        //     $set: {
        //       vedio:
        //         'https://player.vimeo.com/video/829783962?h=47a19669a0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479',
        //     },
        //   }
        // );
        // console.log(result);
        // const result = await PhotoContestUser.deleteMany();
        // console.log(result);
        // const result3 = await GeneralUser.updateMany(
        //   {},
        //   {
        //     purchase_courses: [],
        //   }
        // );
        // const result = await FileUploade.deleteMany({});
        // const result = await RunContest.find({});
        // const result5 = await Purchased_courses.deleteMany();
        // const result2 = await PhotoContestUser.deleteMany({});
        // const result2 = await RunContest.deleteMany({});
        // console.log(result2);
    }
    catch (error) {
        console.log(error);
    }
});
test();
exports.default = app;
