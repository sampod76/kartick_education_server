/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from 'express';

import { ENUM_YN } from '../../../enums/globalEnums';
import { getDeviceInfo } from '../../../helper/getDeviceInfo';
import catchAsync from '../../share/catchAsync';
import sendResponse from '../../share/sendResponse';
import { UserLoginHistory } from '../loginHistory/loginHistory.model';
import { User } from '../user/user.model';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';
import { AuthService } from './auth.service';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken, userData, ...result } = await AuthService.loginUser(
    req.body,
  );

  if (req?.cookies?.refreshToken) {
    const checkLoginHistory = await UserLoginHistory.findOne({
      //@ts-ignore
      user: userData._id,
      user_agent: req.headers['user-agent'],
      token: req?.cookies?.refreshToken,
    });
    if (checkLoginHistory) {
      const ip = req.clientIp;
      await UserLoginHistory.findOneAndUpdate(
        {
          //@ts-ignore
          user: userData._id,
          user_agent: req.headers['user-agent'],
          token: req?.cookies?.refreshToken,
        },
        {
          ip,
          token: refreshToken,
        },
      );
    } else {
      // ! -------------- set login history function --------------
      const ip = req.clientIp;
      const deviceInfo = getDeviceInfo(req.headers['user-agent'] as string);
      await UserLoginHistory.create({
        ip,
        //@ts-ignore
        user: userData._id,
        user_agent: req.headers['user-agent'],
        token: refreshToken,
        device_info: deviceInfo,
      });

      // ! -------------- set login history function end --------------
    }
  } else {
    // ! -------------- set login history function --------------
    const ip = req.clientIp;
    const deviceInfo = getDeviceInfo(req.headers['user-agent'] as string);
    await UserLoginHistory.create({
      ip,
      //@ts-ignore
      user: userData._id,
      user_agent: req.headers['user-agent'],
      token: refreshToken,
      device_info: deviceInfo,
    });

    // ! -------------- set login history function end --------------
  }
  const cookieOptions = {
    //for development false
    secure: false,
    httpOnly: true,
    // maxAge: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    // maxAge: parseInt(config.jwt.refresh_expires_in || '31536000000'),
  };

  /* 
      
      secure: true,
      httpOnly: true,
      // when my site is same url example: frontend ->sampodnath.com , backend ->sampodnath-api.com. then sameSite lagba na, when frontend ->sampodnath.com , but backend api.sampodnath.com then  sameSite: 'none',
      sameSite: 'none', // or remove this line for testing
      maxAge: 31536000000,
      maxAge: parseInt(config.jwt.refresh_expires_in || '31536000000'), 
      
      */

//@ts-ignore
  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: result,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken, req);

  const cookieOptions = {
    //for development false
    //   secure: config.env === 'production' ? true : false,
    //   httpOnly: true,
    //   // when my site is same url example: frontend ->sampodnath.com , backend ->sampodnath-api.com. then sameSite lagba na, when frontend ->sampodnath.com , but backend api.sampodnath.com then  sameSite: 'none',
    //   sameSite: 'none', // or remove this line for testing
    //   maxAge: 31536000000,
    //   // maxAge: parseInt(config.jwt.refresh_expires_in || '31536000000'),
    // };

    secure: true,
    httpOnly: true,
    // when my site is same url example: frontend ->sampodnath.com , backend ->sampodnath-api.com. then sameSite lagba na, when frontend ->sampodnath.com , but backend api.sampodnath.com then  sameSite: 'none',
    sameSite: 'none', // or remove this line for testing
    maxAge: 31536000000,
    // maxAge: parseInt(config.jwt.refresh_expires_in || '31536000000'),
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: result,
  });
});

const logOut = catchAsync(async (req: Request, res: Response) => {
  await AuthService.loginOutFromDb(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Logout successfully !',
  });
});
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { ...passwordData } = req.body;

  await AuthService.changePassword(user, passwordData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password changed successfully !',
  });
});

const forgotPass = catchAsync(async (req: Request, res: Response) => {
  await AuthService.forgotPass(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Check your email!',
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || '';
  await AuthService.resetPassword(req.body, token);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Account recovered!',
  });
});

const profile = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findOne({
    _id: req?.user?.id,
    isDelete: ENUM_YN.NO,
  })
    .select({ password: 0 })
    .populate('admin student seller teacher');

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Successful!',
    data: user,
  });
});

export const AuthController = {
  loginUser,
  logOut,
  refreshToken,
  changePassword,
  forgotPass,
  resetPassword,
  profile,
};
