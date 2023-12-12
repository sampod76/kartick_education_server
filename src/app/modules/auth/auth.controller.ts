import { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import { ENUM_USER_ROLE } from '../../../enums/users';
import ApiError from '../../errors/ApiError';
import catchAsync from '../../share/catchAsync';
import sendResponse from '../../share/sendResponse';
import { IAdmin } from '../admin/admin.interface';
import { IGeneralUser } from '../generalUser/interface.GeneralUser';
import { IModerator } from '../moderator/moderator.interface';
import { IRefreshTokenResponse } from './auth.interface';
import { AuthService } from './auth.service';

const loginUser = catchAsync(async (req: Request, res: Response) => {
const {uid,role=ENUM_USER_ROLE.GENERAL_USER}=req.body
console.log(uid);
  // const uid =req.user?.uid
  // const role =req.user?.role

  let result = null;
  if (uid) {
    result = await AuthService.loginUserByUidFromDb(uid, role);
  } else {
    // result = await AuthService.loginUserFromDb(payload);
  }
  const { refreshToken, ...othersData } = result;
  // console.log(req.cookies, 13);
  // set refresh token into cookie
  const cookieOptions: {
    secure: boolean;
    httpOnly: boolean;
    sameSite: 'none' | undefined;
  } = {
    // secure: config.env === 'production' ? true : false,
    //same
    // secure: config.env === 'production',
    secure: true,
    httpOnly: true,
    // signed: true,
    sameSite: 'none',
  };

  //এটার মাধ্যমে ক্লাইন সাইডে আমার পাঠানো রেসপন্স এর বাইরেও অটোমেটিকলি সে এই cookie সেট করে দেবে
  res.cookie('refreshToken', refreshToken, cookieOptions);
  // res.cookie('accessToken', othersData.accessToken, cookieOptions);

  //set refre
  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'successfull login',
    data: {
      _id: othersData?.isUserExist?._id,
      name: othersData?.isUserExist?.name,
      status: othersData?.isUserExist?.status,
      email: othersData?.isUserExist?.email,
      phone: othersData?.isUserExist?.phone,
      role: othersData?.isUserExist?.role,
      // ...result,
      accessToken: othersData.accessToken,
    },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Token does not found');
  }
  const resultByAccessToken = await AuthService.refreshToken(refreshToken);

  const cookieOptions = {
    // secure: config.env === 'production' ? true :false,
    //same
    secure: config.env === 'production',
    httpOnly: true,
  };
  //এটার মাধ্যমে ক্লাইন সাইডে আমার পাঠানো রেসপন্স এর বাইরেও অটোমেটিকলি সে এই cookie সেট করে দেবে
  res.cookie('refreshToken', refreshToken, cookieOptions);

  //set refre
  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'successfull login',
    data: resultByAccessToken,
  });
});

const myProfile = catchAsync(async (req: Request, res: Response) => {
  //set refre
  const result = await AuthService.myProfileFromDb(
    req?.user?._id,
    req?.user?.role
  );
  sendResponse<IGeneralUser | IAdmin | IModerator>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'successfull get profile',
    data: result,
  });
});

const myProfileUpdate = catchAsync(async (req: Request, res: Response) => {
  //set refre

  const result = await AuthService.updateProfileFromDb(req);
  sendResponse<IGeneralUser | IAdmin | IModerator>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'successfull update profile',
    data: result,
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
  myProfile,
  myProfileUpdate,
};
