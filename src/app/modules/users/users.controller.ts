import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ENUM_USER_ROLE } from '../../../enums/users';
import catchAsync from '../../share/catchAsync';
import sendResponse from '../../share/sendResponse';
import { IUser } from './users.interface';
import { UserServices } from './users.service';
// import { IUser } from './users.interface';
const createGeneralUser = catchAsync(async (req: Request, res: Response) => {
  const { password, ...generalUser } = req.body;
  const userData: IUser = {
    email: generalUser.email,
    password,
    role: ENUM_USER_ROLE.GENERAL_USER,
  };
  const result = await UserServices.createGeneralUserFromdb(
    generalUser,
    userData
  );

  sendResponse<IUser>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull create user',
    data: result,
  });
});

const createModerator = catchAsync(async (req: Request, res: Response) => {
  const { password, ...moderator } = req.body;
  const userData: IUser = {
    email: moderator.email,
    password,
    role: ENUM_USER_ROLE.MODERATOR,
  };

  const result = await UserServices.createModeratorFromDb(moderator, userData);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user Moderator successfully!',
    data: result,
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const { password, ...adminData } = req.body;
  const userData: IUser = {
    email: adminData.email,
    password,
    role: ENUM_USER_ROLE.ADMIN,
  };
  const result = await UserServices.createAdminFromDb(adminData, userData);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin created successfully!',
    data: result,
  });
});

export const UserController = {
  createGeneralUser,
  createModerator,
  createAdmin,
};
