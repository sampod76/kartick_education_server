// import crypto from 'crypto';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import { Types } from 'mongoose';
import config from '../../../config';
import { PAGINATION_FIELDS } from '../../../constant/pagination';
import { ENUM_USER_ROLE } from '../../../enums/users';
import { jwtHelpers } from '../../../helper/jwtHelpers';
import ApiError from '../../errors/ApiError';
import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { GeneralUserFilterableFields } from './constant.GeneralUser';
import { IGeneralUser } from './interface.GeneralUser';
import { GeneralUserService } from './service.GeneralUser';

const getAllGeneralUsers = catchAsync(async (req: Request, res: Response) => {
  let queryObject = req.query;
  queryObject = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(queryObject).filter(([_, value]) => Boolean(value))
  );
  const filter = pick(queryObject, GeneralUserFilterableFields);

  const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

  const result = await GeneralUserService.getAllGeneralUsersFromDb(
    filter,
    paginationOptions
  );
  sendResponse<IGeneralUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'users found successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const createGeneralUserByFirebase = catchAsync(
  async (req: Request, res: Response) => {
    console.log(req.query);
    // if (!req.body?.uid && req.query?.setUid === 'yes') {
    //   req.body.uid = crypto.randomBytes(28).toString('hex');
    //   console.log(req.body.uid)
    // }
    const result = (await GeneralUserService.createGeneralUserByFirebaseFromDb(
      req.body,req
    )) as IGeneralUser & { _id: Types.ObjectId };
 
    if (!result) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'forbidden access!');
    }
    const refreshToken = jwtHelpers.createToken(
      { _id: result?._id, role: result?.role },
      config.jwt.refresh_secret as Secret,
      config.jwt.refresh_expires_in as string
    );
    const accessToken = jwtHelpers.createToken(
      {
        _id: result?._id,
        role: result?.role,
      },
      config.jwt.secret as Secret,
      config.jwt.expires_in as string
    );
    const cookieOptions = {
      // secure: config.env === 'production' ? true :false,
      //same
      secure: config.env === 'production',
      httpOnly: true,
    };
    //এটার মাধ্যমে ক্লাইন সাইডে আমার পাঠানো রেসপন্স এর বাইরেও অটোমেটিকলি সে এই cookie সেট করে দেবে
    res.cookie('refreshToken', refreshToken, cookieOptions);
    // res.cookie('accessToken', accessToken, cookieOptions);

    // const result2 = { ...result.toObject() };

    res.status(200).send({
      statusCode: httpStatus.OK,
      success: true,
      message: 'user found successfully !',
      // data:result,
      data: {
        _id: result?._id,
        name: result?.name,
        status: result?.status,
        email: result?.email,
        phone: result?.phone,
        fcm_token: result?.fcm_token,
        // ...result,
        accessToken,
      },
    });
  }
);
//!------- only admin add course then create user---------
const createGeneralUserByAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const result = (await GeneralUserService.createGeneralUserByFirebaseFromDb(
      req.body,req
    ))
    console.log(result, 'login apple 45 controller');
    if (!result) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'forbidden access!');
    }
    res.status(200).send({
      statusCode: httpStatus.OK,
      success: true,
      message: 'user found successfully !',
      // data:result,
      data: result,
    });
  }
);
//

const getSingleGeneralUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  if (req.user?.role !== ENUM_USER_ROLE.ADMIN && req.user?._id !== id) {
    throw new ApiError(500, 'unauthorise access!!');
  }
  const result = await GeneralUserService.getSingleGeneralUserFromDb(id);
  sendResponse<IGeneralUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user found successfully !',
    data: result,
  });
});

//single user _id to get all course and lession
const getSingleGeneralUserToCourse = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await GeneralUserService.getUserToCourseFromDb(id);

    sendResponse<any>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Course found successfully !',
      data: result,
    });
  }
);

const updateGeneralUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;
  if (req.user?.role !== ENUM_USER_ROLE.ADMIN && req.user?._id !== id) {
    throw new ApiError(500, 'unauthorise access!!');
  }
  const result = await GeneralUserService.updateGeneralUserFromDb(
    id,
    updatedData,
    req
  );

  sendResponse<IGeneralUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user updated successfully !',
    data: result,
  });
});

const updateCourseVedioOrQuiz = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedData = req.body;
    const result = await GeneralUserService.updateCourseVedioOrQuizFromDb(
      id,
      updatedData
    );

    sendResponse<IGeneralUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Course or quiz updated successfully !',
      data: result,
    });
  }
);

const deleteGeneralUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await GeneralUserService.deleteGeneralUserFromDb(id);

  sendResponse<IGeneralUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user deleted successfully !',
    data: result,
  });
});

export const GeneralUserController = {
  createGeneralUserByFirebase,
  getAllGeneralUsers,
  getSingleGeneralUser,
  getSingleGeneralUserToCourse,
  updateCourseVedioOrQuiz,
  updateGeneralUser,
  deleteGeneralUser,
  createGeneralUserByAdmin
};
