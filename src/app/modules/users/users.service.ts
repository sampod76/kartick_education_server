import httpStatus from 'http-status';
import mongoose, { Types } from 'mongoose';

import { ENUM_USER_ROLE } from '../../../enums/users';
import ApiError from '../../errors/ApiError';
import { IAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';

import { IGeneralUser } from '../generalUser/interface.GeneralUser';
import { GeneralUser } from '../generalUser/model.GeneralUser';
import { IModerator } from '../moderator/moderator.interface';
import { Moderator } from '../moderator/moderator.model';
import { IUser } from './users.interface';
import { User } from './users.model';

const createGeneralUserFromdb = async (
  generalUser: IGeneralUser,
  user: IUser
): Promise<IUser | null> => {
  //auto generate user id

  user.role = ENUM_USER_ROLE.GENERAL_USER;

  let newUserAllData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //array
    const newGeneralUser = await GeneralUser.create([generalUser], {
      session,
    });
    if (!newGeneralUser.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create GeneralUser'
      );
    }
    //set GeneralUser -->  _id into user.GeneralUser
    user.generalUser =new Types.ObjectId(newGeneralUser[0]._id);

    const newUser = await User.create([user], { session });

    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    newUserAllData = newUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (newUserAllData) {
    newUserAllData = await User.findOne({ _id: newUserAllData._id }).populate({
      path: 'generalUser',
      populate: [],
    });
  }

  return newUserAllData;
};

const createAdminFromDb = async (
  admin: IAdmin,
  user: IUser
): Promise<IUser | null> => {
  user.role = ENUM_USER_ROLE.ADMIN;

  //Generater admin id
  let newUserAllData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const newAdmin = await Admin.create([admin], { session });
    if (!newAdmin.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }
    //user to ref admin id
    user.admin = newAdmin[0]._id;

    const newUser = await User.create([user], { session });
    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    newUserAllData = newUser[0];
    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
  if (newUserAllData) {
    newUserAllData = await User.findOne({ _id: newUserAllData._id }).populate({
      path: 'admin',
      populate: [],
    });
  }

  return newUserAllData;
};

const createModeratorFromDb = async (
  moderator: IModerator,
  user: IUser
): Promise<IUser | null> => {
  // set role
  user.role = ENUM_USER_ROLE.MODERATOR;

  // generate Moderator id
  let newUserAllData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const newModerator = await Moderator.create([moderator], { session });

    if (!newModerator.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create Moderator ');
    }

    user.moderator = newModerator[0]._id;

    const newUser = await User.create([user], { session });

    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create Moderator');
    }
    newUserAllData = newUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (newUserAllData) {
    newUserAllData = await User.findOne({ _id: newUserAllData._id }).populate(
      'moderator'
    );
  }
  // console.log(newUserAllData);
  return newUserAllData;
};

export const UserServices = {
  createGeneralUserFromdb,
  createAdminFromDb,
  createModeratorFromDb,
};

/* if (newUserAllData) {
  newUserAllData = await User.findOne({ id: newUserAllData.id }).populate({
    path: 'GeneralUser',
    populate: [
      {
        path: 'academicSemester',
        model: 'academic_semester',
      },
      {
        path: 'academicDepartment',
        model: 'academic_Department',
      },
      {
        path: 'academicModerator',
        model: 'academic_Moderator',
      },
    ],
  });
} */
