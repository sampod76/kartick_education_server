/* eslint-disable @typescript-eslint/ban-ts-comment */
import bcrypt from 'bcrypt';
import { Request } from 'express';
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import { Types } from 'mongoose';
import config from '../../../config';
import { ENUM_STATUS, ENUM_YN } from '../../../enums/globalEnums';
import { jwtHelpers } from '../../../helper/jwtHelpers';
import ApiError from '../../errors/ApiError';
import { IUserLoginHistory } from '../loginHistory/loginHistory.interface';
import { UserLoginHistory } from '../loginHistory/loginHistory.model';
import { User } from '../user/user.model';
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';
import { sendEmail } from './sendResetMail';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({
    email,
    isDelete: ENUM_YN.NO,
  }).select('+password');

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // switch (isUserExist.status) {
  //   case ENUM_STATUS.DEACTIVATE:
  //     throw new ApiError(httpStatus.NOT_FOUND, 'Your account is deactivated');
  //   case ENUM_STATUS.BLOCK:
  //     throw new ApiError(
  //       httpStatus.NOT_FOUND,
  //       `Your account is blocked ${isUserExist?.blockingTimeout}`
  //     );
  //   default:
  //     null
  // }

  if (isUserExist.status === ENUM_STATUS.DEACTIVATE) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Your account is deactivated');
  } else if (isUserExist.status === ENUM_STATUS.BLOCK) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Your account is blocked ${isUserExist?.blockingTimeout}`,
    );
  }

  if (
    isUserExist.password &&
    !(await User.isPasswordMatchMethod(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  //create access token & refresh token
  const { email: existEmail, role, _id } = isUserExist as any;

  const accessToken = jwtHelpers.createToken(
    { email: existEmail, role, id: _id },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.createToken(
    { email: existEmail, role, id: _id },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    userData: isUserExist,
  };
};
const loginOutFromDb = async (
  req: Request,
): Promise<IUserLoginHistory | null> => {
  const { id } = req.params;

  const checkLoginHistory = await UserLoginHistory.findOne({
    //@ts-ignore
    user: req?.user?.id,
    user_agent: req.headers['user-agent'],
    token: req?.cookies?.refreshToken,
  });
  let result = null;
  if (checkLoginHistory) {
    // result = await UserLoginHistory.findOneAndUpdate(
    //   { _id: id },
    //   { isDelete: ENUM_YN.YES },
    // );
    result = await UserLoginHistory.findByIdAndDelete(id);
  } else {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not allowed to');
  }

  // const result = await UserLoginHistory.findByIdAndDelete(id);

  return result;
};

const refreshToken = async (
  token: string,
  req: Request,
): Promise<IRefreshTokenResponse> => {
  //verify token
  // invalid token - synchronous
  let verifiedToken = null;

  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret,
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { id } = verifiedToken;

  // console.log(verifiedToken,"email..........");

  const isUserExist = await User.findById(id);
  if (!isUserExist) {
    throw new ApiError(403, 'User does not exist');
  }
  //generate new token
  if (isUserExist.status === ENUM_STATUS.DEACTIVATE) {
    throw new ApiError(403, 'Your account is deactivated');
  } else if (isUserExist.status === ENUM_STATUS.BLOCK) {
    throw new ApiError(
      403,
      `Your account is blocked ${isUserExist?.blockingTimeout}`,
    );
  } else if (isUserExist.isDelete === ENUM_YN.YES) {
    throw new ApiError(403, `Your account is delete`);
  }
  const user_agent = req.headers['user-agent'];
  const checkLoginHistory = await UserLoginHistory.findOne({
    user: new Types.ObjectId(id),
    user_agent: user_agent,
    token: token,
    isDelete: ENUM_YN.NO,
  });

  if (!checkLoginHistory) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Unauthorized. Please login again',
    );
  }

  const newAccessToken = jwtHelpers.createToken(
    {
      email: isUserExist.email,
      role: isUserExist.role,
      id: isUserExist._id,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword,
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  // // checking is user exist
  // const isUserExist = await User.isUserExist(user?.userId);

  //alternative way
  const isUserExist: any = await User.findOne({
    email: user?.email,
    isDelete: ENUM_YN.NO,
  }).select('+password');

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // checking old password
  if (isUserExist.status === ENUM_STATUS.DEACTIVATE) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Your account is deactivated');
  } else if (isUserExist.status === ENUM_STATUS.BLOCK) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Your account is blocked ${isUserExist?.blockingTimeout}`,
    );
  }
  if (
    isUserExist.password &&
    !(await User.isPasswordMatchMethod(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old Password is incorrect');
  }

  // // hash password before saving
  // const newHashedPassword = await bcrypt.hash(
  //   newPassword,
  //   Number(config.bycrypt_salt_rounds)
  // );

  // const query = { id: user?.userId };
  // const updatedData = {
  //   password: newHashedPassword,  //
  //   needsPasswordChange: false,
  //   passwordChangedAt: new Date(), //
  // };

  // await User.findOneAndUpdate(query, updatedData);
  // data update
  isUserExist.password = newPassword;
  // isUserExist.needsPasswordChange = false;

  // updating using save()
  isUserExist.save();
};

const forgotPass = async (payload: { email: string }) => {
  console.log(payload.email);

  const profile = await User.findOne({
    email: payload.email,
  });

  console.log(profile);

  if (!profile) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist!');
  }

  if (!profile.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email not found!');
  }

  // Generate a password reset token
  const passResetToken = jwtHelpers.createToken(
    { email: profile.email, role: profile.role, id: profile._id },
    config.jwt.secret as Secret,
    '50m',
  );

  // Construct the reset link
  const resetLink = `${config.resetlink}${profile._id}?token=${passResetToken}`;

  // Send the password reset email
  const html = `
    <p>You requested a password reset</p>
    <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
    <p>If you did not request this, please ignore this email.</p>
  `;

  await sendEmail(profile.email, html);

  return {
    message: 'Check your email for the password reset link!',
  };
};

const resetPassword = async (payload: {
  id: string;
  newPassword: string;
  token: string;
}) => {
  const { id, newPassword, token } = payload;

  console.log(payload);
  const user = await User.findById({ _id: id }, { _id: 1 });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found!');
  }

  const isVarified = await jwtHelpers.verifyToken(
    token,
    config.jwt.secret as string,
  );
  console.log(isVarified);

  const password = await bcrypt.hash(
    newPassword,
    Number(config.bycrypt_salt_rounds),
  );

  const updateUser = await User.updateOne({ _id: id }, { password });

  console.log(updateUser);

  return {
    message: 'Password Updated',
  };
};

export const AuthService = {
  loginUser,
  loginOutFromDb,
  refreshToken,
  changePassword,
  forgotPass,
  resetPassword,
};
