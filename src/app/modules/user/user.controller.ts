import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';

import catchAsync from '../../share/catchAsync';
import sendResponse from '../../share/sendResponse';
import { IUser } from './user.interface';
import { UserService } from './user.service';

const createStudent: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { student, ...userData } = req.body;
    userData.email=student?.email
    const result = await UserService.createStudent(student, userData);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user created successfully!',
      data: result,
    });
  }
);

const createModerator: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { moderator, ...userData } = req.body;
    userData.email=moderator?.email
    const result = await UserService.createModerator(moderator, userData);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Moderator created successfully!',
      data: result,
    });
  }
);

const createAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { admin, ...userData } = req.body;
    userData.email=admin?.email
    const result = await UserService.createAdmin(admin, userData);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin created successfully!',
      data: result,
    });
  }
);

export const UserController = {
  createStudent,
  createModerator,
  createAdmin,
};
