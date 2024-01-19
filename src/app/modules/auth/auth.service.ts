import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import { ENUM_STATUS, ENUM_YN } from '../../../enums/globalEnums';
import { jwtHelpers } from '../../../helper/jwtHelpers';
import ApiError from '../../errors/ApiError';
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

  const isUserExist = await User.isUserExistMethod(email);

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
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
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
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  //generate new token
  if (isUserExist.status === ENUM_STATUS.DEACTIVATE) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Your account is deactivated');
  } else if (isUserExist.status === ENUM_STATUS.BLOCK) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Your account is blocked ${isUserExist?.blockingTimeout}`,
    );
  } else if (isUserExist.isDelete === ENUM_YN.YES) {
    throw new ApiError(httpStatus.NOT_FOUND, `Your account is delete`);
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
  const isUserExist = await User.findOne({ email: user?.email }).select(
    '+password',
  );

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // checking old password
  if (
    isUserExist.password &&
    !(await User.isPasswordMatchMethod(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old Password is incorrect');
  }
  if (isUserExist.status === ENUM_STATUS.DEACTIVATE) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Your account is deactivated');
  } else if (isUserExist.status === ENUM_STATUS.BLOCK) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Your account is blocked ${isUserExist?.blockingTimeout}`,
    );
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

const forgotPass = async (payload: { id: string }) => {
  const profile = await User.findById(payload.id).populate('admin', '');

  if (!profile) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist!');
  }

  // let profile = null;
  // if (user.role === ENUM_USER_ROLE.ADMIN) {
  //   profile = await Admin.findById(user.id);
  // } else if (user.role === ENUM_USER_ROLE.MODERATOR) {
  //   profile = await Moderator.findById(user.id);
  // } else if (user.role === ENUM_USER_ROLE.student) {
  //   profile = await Student.findById(user.id);
  // }

  // if (!profile) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Pofile not found!');
  // }

  if (!profile.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email not found!');
  }

  const passResetToken = await jwtHelpers.createResetToken(
    { email: profile.email },
    config.jwt.secret as string,
    '50m',
  );

  const resetLink: string = config.resetlink + `token=${passResetToken}`;

  console.log('profile: ', profile);
  await sendEmail(
    profile.email,
    `
      <div>
        <p>Hi</p>
        <p>Your password reset link: <a href=${resetLink}>Click Here</a></p>
        <p>Thank you</p>
      </div>
  `,
  );

  // return {
  //   message: "Check your email!"
  // }
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string,
) => {
  const { id, newPassword } = payload;
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

  await User.updateOne({ id }, { password });
};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPass,
  resetPassword,
};
