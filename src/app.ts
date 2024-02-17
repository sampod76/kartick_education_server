/* eslint-disable @typescript-eslint/no-unused-vars */
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, {
  Application,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import paypal from 'paypal-rest-sdk';
// create xss-clean.d.ts file after work this xss
import path from 'path';
// import xss from 'xss-clean';
import helmetOriginal from 'helmet';
import httpStatus from 'http-status';
import requestIp from 'request-ip';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
// import { uploadSingleImage } from './app/middlewares/uploader.multer';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
ffmpeg.setFfmpegPath(ffmpegPath.path);

import fs from 'fs';
import routers from './app/routes/index_route';
import config from './config';
const app: Application = express();
// app.use(cors());

app.use(helmetOriginal());
app.use(requestIp.mw());

app.use(
  cors({
    origin:
      config.env === 'development'
        ? [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://192.168.0.101:3000',
          ]
        : ['https://iblossomlearn.org'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  }),
);
// app.use(cors());

// app.use(
//   cors(),
// );

// app.use(cors(corsOptions));

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
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
paypal.configure({
  mode: 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID as string,
  client_secret: process.env.PAYPAL_SECRET_KEY as string,
});

const run: RequestHandler = (req, res, next) => {
  try {
    // jwtHelpers.verifyToken(`${req.headers.authorization}`, config.jwt.secret as string);
    // console.log('first');
    next();
  } catch (error) {
    next(error);
  }
};

const downloadFunction: RequestHandler = (req, res, next) => {
  try {
    const filePath = path.resolve(
      __dirname,
      `../../uploadFile/pdfs/${req.params?.filename}`,
    );
    const fileContents = fs.readFileSync(filePath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${req.params?.filename}`,
    );
    res.status(200).end(fileContents, 'binary');
    // jwtHelpers.verifyToken(`${req.headers.authorization}`, config.jwt.secret as string);
    // console.log('first');
    // next();
  } catch (error) {
    res.status(500).end({ message: 'File not found' });
  }
};

app.use(
  '/images',
  run,
  express.static(path.join(__dirname, '../../uploadFile/images/')),
);

app.use(
  '/profile',
  run,
  express.static(path.join(__dirname, '../../uploadFile/profile/')),
);

app.use(
  '/videos',
  run,
  express.static(path.join(__dirname, '../../uploadFile/videos/')),
);

app.use(
  '/pdfs/:filename',
  run,
  // (req, res, next) => {
  //   req.customData &&  req.customData.downloadType = 'pdf';
  // },
  downloadFunction,
  // express.static(path.join(__dirname, `../../uploadFile/pdfs/`)),
);

app.use(
  '/audios-download/:filename',
  run,
  downloadFunction,
  // express.static(path.join(__dirname, `../../uploadFile/pdfs/`)),
);
app.use(
  '/audios',
  run,
  // downloadFunction,
  express.static(path.join(__dirname, `../../uploadFile/audios/`)),
);

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views/success.ejs'));

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.send({ message: 'server is running....' });
  } catch (error) {
    next(error);
  }
  // res.send('server is running');
});
app.get(
  '/api/v1/paly-audio/:filename',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    
      const filePath = path.resolve(
        __dirname,
        `../../uploadFile/audios/${req.params?.filename}`,
      );
      return res.sendFile(filePath);
    } catch (error: any) {
      // next(error);
      return res.status(500).send({
        success: false,
        message: error?.message || 'Internal Server Error',
        errorMessages: [
          {
            path: '',
            message: error?.message || 'Internal Server Error',
          },
        ],
      });
    }
    // res.send('server is running');
  },
);

const test = async () => {
  // const restul = await User.updateMany({}, { isDelete: ENUM_YN.NO });
  // console.log(restul);
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
  // const result = encryptCryptoData({id:"sdfjksdjfkl"},config.encryptCrypto as string)
  // const getData = "U2FsdGVkX19dOA/shL0SLR2JyDtmLpQJy88CwzgKP18YXxHGl5lrNcVpYOzLeI6ITy/cWRTBrTK0V6PkGhbl1Ik fBtfhZUFBsLHrZmvFNuC4OpxwvY79/xToKurgOskLiz7aazvvxeghiVMtnRfEw==".split(" ").join("+")
  // const verify = decryptCryptoData(getData,config.encryptCrypto as string)
  // console.log(verify);
  // const result = await Category.updateMany({serial_number:{$exists:false}},{$set:{serial_number:999}})
  // console.log("🚀 ~ test ~ result:", result)
};
test();

//Application route
app.use('/api/v1', routers);

// Set the views directory and the view engine

// global error handlar
app.use(globalErrorHandler);

//handle not found route
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).send({
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

export default app;
