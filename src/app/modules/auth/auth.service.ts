import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import { Types } from 'mongoose';
import config from '../../../config';
import { ENUM_USER_ROLE } from '../../../enums/users';
import { jwtHelpers } from '../../../helper/jwtHelpers';
import ApiError from '../../errors/ApiError';
import { Admin } from '../admin/admin.model';
import { GeneralUser } from '../generalUser/model.GeneralUser';
import { Moderator } from '../moderator/moderator.model';
import { User } from '../users/users.model';
import { ILoginUser, ILoginUserResponse } from './auth.interface';

const loginUserFromDb = async (
  payload: ILoginUser
): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  if (!(email && password)) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Email and password not provide'
    );
  }

  const isUserExist = await User.isUserExist(email?.toLowerCase());
  //chack user
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  //match password
  if (!(await User.isPasswordMatched(password, isUserExist.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  const accessToken = jwtHelpers.createToken(
    {
      role: isUserExist.role,
      email: isUserExist?.email,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  const refreshToken = jwtHelpers.createToken(
    {
      role: isUserExist.role,
      email: isUserExist?.email,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );
  return {
    accessToken,
    refreshToken,
  };
};

const loginUserByUidFromDb = async (
  uid: string,
  role: string
): Promise<ILoginUserResponse | any> => {
  let isUserExist = null;
  if (uid && role === ENUM_USER_ROLE.ADMIN) {
    isUserExist = await Admin.findOne({ uid });
  } else if (role === ENUM_USER_ROLE.MODERATOR) {
    isUserExist = await Moderator.findOne({ uid: uid });
  } else if (role === ENUM_USER_ROLE.GENERAL_USER) {
    isUserExist = await GeneralUser.findOne({ uid: uid });
  }

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const accessToken = jwtHelpers.createToken(
    {
      role: isUserExist.role,
      _id: isUserExist._id,
      email: isUserExist?.email,
      name: isUserExist?.name,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    {
      role: isUserExist.role,
      _id: isUserExist._id,
      email: isUserExist?.email,
      name: isUserExist?.name,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    isUserExist,
  };
};

const refreshToken = async (token: string) => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  // //chack this user exist database
  // const isUserExist = await User.isUserExist(verifiedToken?.userId);
  let isUserExist = null;
  if (verifiedToken._id && verifiedToken.role === ENUM_USER_ROLE.ADMIN) {
    isUserExist = await Admin.findById(verifiedToken._id);
  } else if (verifiedToken.role === ENUM_USER_ROLE.MODERATOR) {
    isUserExist = await Moderator.findById(verifiedToken._id);
  } else if (verifiedToken.role === ENUM_USER_ROLE.GENERAL_USER) {
    isUserExist = await GeneralUser.findById(verifiedToken._id);
  }
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // generate new token
  const newAccessToken = jwtHelpers.createToken(
    {
      role: isUserExist.role,
      _id: isUserExist._id,
      email: isUserExist?.email,
      name: isUserExist?.name,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

const myProfileFromDb = async (id: string, role: string) => {
  // //chack this user exist database
  // const isUserExist = await User.isUserExist(verifiedToken?.userId);
  let isUserExist = null;
  if (id && role === ENUM_USER_ROLE.ADMIN) {
    isUserExist = await Admin.findById(id);
  } else if (role === ENUM_USER_ROLE.MODERATOR) {
    isUserExist = await Moderator.findById(id);
  } else if (role === ENUM_USER_ROLE.GENERAL_USER) {
    isUserExist = await GeneralUser.findById(id);
  }
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // generate new token

  return isUserExist;
};

const updateProfileFromDb = async (req: any) => {
  // //chack this user exist database
  // const isUserExist = await User.isUserExist(verifiedToken?.userId);
  let isUserExist = null;
  if (req?.user?.role === ENUM_USER_ROLE.ADMIN) {
    isUserExist = await Admin.findOneAndUpdate(
      { _id: new Types.ObjectId(req?.user?._id) },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
  } else if (req?.user?.role === ENUM_USER_ROLE.MODERATOR) {
    isUserExist = await Moderator.findOneAndUpdate(
      { _id: new Types.ObjectId(req?.user?._id) },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
  } else if (req?.user?.role === ENUM_USER_ROLE.GENERAL_USER) {
    isUserExist = await GeneralUser.findOneAndUpdate(
      { _id: new Types.ObjectId(req?.user?._id) },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
  }
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Update faild');
  }

  // generate new token

  return isUserExist;
};

export const AuthService = {
  loginUserFromDb,
  loginUserByUidFromDb,
  myProfileFromDb,
  updateProfileFromDb,
  refreshToken,
};
