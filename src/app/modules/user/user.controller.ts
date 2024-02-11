/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { PAGINATION_FIELDS } from '../../../constant/pagination';
import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { userFilterableFields } from './user.constant';
import { IUser } from './user.interface';
import { UserService } from './user.service';

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const paginationOptions = pick(req.query, PAGINATION_FIELDS);
  const result = await UserService.getAllUsers(filters, paginationOptions);

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get all users!',
    data: result,
  });
});
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getSingleUsers(req.params.id);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get all users!',
    data: result,
  });
});
const deleteSingleUser = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const result = await UserService.deleteSingleUsersFormDb(
    req.params.id,
    filters,
  );

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Delete successfully!',
    data: result,
  });
});
const createStudent = catchAsync(async (req: Request, res: Response) => {
  const { student, ...userData } = req.body;
  userData.email = student?.email;
  userData.author = req?.user?.id;
  student.author = req?.user?.id;
  const result = await UserService.createStudentService(student, userData);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user created successfully!',
    data: result,
  });
});

const createStudentByAuthor = catchAsync(
  async (req: Request, res: Response) => {
    const { student, ...userData } = req.body;
    userData.email = student?.email;
    userData.author = req?.user?.id;
    student.author = req?.user?.id;
    const result = await UserService.createStudentByOtherMemberService(
      student,
      userData,
    );

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user created successfully!',
      data: result,
    });
  },
);

const createModerator = catchAsync(async (req: Request, res: Response) => {
  const { moderator, ...userData } = req.body;
  userData.email = moderator?.email;
  const result = null;

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Moderator created successfully!',
    data: result,
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const { admin, ...userData } = req.body;
  userData.email = admin?.email;
  userData.author = req?.user?.id;
  admin.author = req?.user?.id;
  const result = await UserService.createAdminService(admin, userData);
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin created successfully!',
    data: result,
  });
});
const createSeller = catchAsync(async (req: Request, res: Response) => {
  const { seller, ...userData } = req.body;
  userData.email = seller?.email;
  // userData.author = req?.user?.id;
  // seller.author = req?.user?.id;
  const result = await UserService.createSellerService(seller, userData);
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'seller created successfully!',
    data: result,
  });
});

const createTrainer = catchAsync(async (req: Request, res: Response) => {
  const { trainer, ...userData } = req.body;
  userData.email = trainer?.email;
  const result = await UserService.createTrainerService(trainer, userData);
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'seller created successfully!',
    data: result,
  });
});
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;

  const result = await UserService.updateUserSingleUsersFormDb(id, updatedData,req);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student updated successfully !',
    data: result,
  });
});

export const UserController = {
  createStudent,
  createModerator,
  createAdmin,
  createSeller,
  createTrainer,
  getUsers,
  getSingleUser,
  deleteSingleUser,
  createStudentByAuthor,
  updateUser
};
