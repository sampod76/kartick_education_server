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

import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
ffmpeg.setFfmpegPath(ffmpegPath.path);

import fs from 'fs';
import routers from './app/routes/index_route';
const app: Application = express();
// app.use(cors());

app.use(helmetOriginal());
app.use(requestIp.mw());

// app.use(
//   cors({
//     origin:
//       config.env === 'development'
//         ? [
//             'http://localhost:3000',
//             'http://127.0.0.1:3000',
//             'http://192.168.0.101:3000',
//             'http://192.168.10.60:3000∏',
//           ]
//         : ['https://edtesdredasvc.org'],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//   }),
// );
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  }),
);

// app.use(xss());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const run: RequestHandler = (req, res, next) => {
  try {
    // jwtHelpers.verifyToken(`${req.headers.authorization}`, config.jwt.secret as string);
    // console.log('first');
    next();
  } catch (error) {
    next(error);
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

const test = async () => {
  // const restul = await User.updateMany({}, { isDelete: ENUM_YN.NO });
  // console.log(restul);
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
