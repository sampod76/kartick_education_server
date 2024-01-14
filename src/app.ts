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
import globalErrorHandler from './app/middlewares/globalErrorHandler';
// import { uploadSingleImage } from './app/middlewares/uploader.multer';

import { User } from './app/modules/user/user.model';
import routers from './app/routes/index_route';
import { ENUM_YN } from './enums/globalEnums';

const app: Application = express();
// app.use(cors());

app.use(helmetOriginal());

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  })
);

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
  client_id: process.env.PAYPLE_CLIENT_ID as string,
  client_secret: process.env.PAYPLE_SECRET_KEY as string,
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

app.use(
  '/images',
  run,
  express.static(path.join(__dirname, '../../uploadFile/images/'))
);

app.use(
  '/profile',
  run,
  express.static(path.join(__dirname, '../../uploadFile/profile/'))
);

app.use(
  '/vedios',
  run,
  express.static(path.join(__dirname, '../../uploadFile/vedios/'))
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
  const restul = await User.updateMany({}, { isDelete: ENUM_YN.NO });
  console.log(restul);
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
