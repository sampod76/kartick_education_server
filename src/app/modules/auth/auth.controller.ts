import { Request, Response } from 'express';
import config from '../../../config';

import catchAsync from '../../share/catchAsync';
import sendResponse from '../../share/sendResponse';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';
import { AuthService } from './auth.service';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const { refreshToken, ...result } = await AuthService.loginUser(loginData);
 
  // const cookieOptions = {
  //   secure: config.env === 'production',
  //   httpOnly: true,
  //   sameSite: false,
  //   maxAge: parseInt(
  //     (config.jwt.refresh_expires_in as string) || '31536000000'
  //   ),
  // };
  const cookieOptions = {
    secure: config.env === 'production' ? true : false,
    httpOnly: true,
    // sameSite: 'Lax', // or remove this line for testing
    maxAge: parseInt((config.jwt.refresh_expires_in as string) || '31536000000'),
  };
  
  console.log(refreshToken,"refresh token");
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

  const result = await AuthService.refreshToken(refreshToken);

  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: result,
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

export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPass,
  resetPassword,
};
