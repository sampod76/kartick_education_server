import httpStatus from 'http-status';
import mongoose, { PipelineStage } from 'mongoose';
import config from '../../../config/index';
import { paginationHelper } from '../../../helper/paginationHelper';
import ApiError from '../../errors/ApiError';
import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';
import { IAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';

import { ENUM_STATUS } from '../../../enums/globalEnums';
import { ENUM_USER_ROLE } from '../../../enums/users';
import { ISeller } from '../seller/seller.interface';
import { Seller } from '../seller/seller.model';
import { IStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { ITrainer } from '../trainer/trainer.interface';
import { Trainer } from '../trainer/trainer.model';
import { userSearchableFields } from './user.constant';
import { IUser, IUserFilters } from './user.interface';
import { User } from './user.model';

const getAllUsers = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOption
): Promise<IGenericResponse<IUser[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: userSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: 1 | -1 } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder === 'asc' ? 1 : -1;
  }

  //****************pagination end ***************/

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  /* 
  const result = await Milestone.find(whereConditions)
    .sort(sortConditions)
    .skip(Number(skip))
    .limit(Number(limit)); 
  */
  const pipeline: PipelineStage[] = [
    { $match: whereConditions },
    { $sort: sortConditions },
    { $skip: Number(skip) || 0 },
    { $limit: Number(limit) || 15 },
    //admin
    {
      $lookup: {
        from: 'admins',
        let: { id: '$admin' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', '$$id'] },
              // Additional filter conditions for collection2
            },
          },
          // Additional stages for collection2
          // প্রথম লুকাপ চালানোর পরে যে ডাটা আসছে তার উপরে যদি আমি যেই কোন কিছু করতে চাই তাহলে এখানে করতে হবে |যেমন আমি এখানে project করেছি

          {
            $project: {
              password: 0,
              __v: 0,
            },
          },
        ],
        as: 'adminDetails',
      },
    },
    {
      $project: { admin: 0 },
    },
    //মনে রাখতে হবে যদি এটি দেওয়া না হয় তাহলে সে যখন কোন একটি ক্যাটাগরির থাম্বেল না পাবে সে তাকে দেবে না
    {
      $addFields: {
        admin: {
          $cond: {
            if: { $eq: [{ $size: '$adminDetails' }, 0] },
            then: [{}],
            else: '$adminDetails',
          },
        },
      },
    },
    {
      $project: { adminDetails: 0 },
    },
    {
      $unwind: '$admin',
    },

    // student
    {
      $lookup: {
        from: 'students',
        let: { id: '$student' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', '$$id'] },
              // Additional filter conditions for collection2
            },
          },
          // Additional stages for collection2
          // প্রথম লুকাপ চালানোর পরে যে ডাটা আসছে তার উপরে যদি আমি যেই কোন কিছু করতে চাই তাহলে এখানে করতে হবে |যেমন আমি এখানে project করেছি

          {
            $project: {
              password: 0,
              __v: 0,
            },
          },
        ],
        as: 'studentDetails',
      },
    },

    {
      $project: { student: 0 },
    },
    {
      $addFields: {
        student: {
          $cond: {
            if: { $eq: [{ $size: '$studentDetails' }, 0] },
            then: [{}],
            else: '$studentDetails',
          },
        },
      },
    },
    {
      $project: { studentDetails: 0 },
    },
    {
      $unwind: '$student',
    },
    // trainer
    {
      $lookup: {
        from: 'trainers',
        let: { id: '$trainer' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', '$$id'] },
              // Additional filter conditions for collection2
            },
          },
          // Additional stages for collection2
          // প্রথম লুকাপ চালানোর পরে যে ডাটা আসছে তার উপরে যদি আমি যেই কোন কিছু করতে চাই তাহলে এখানে করতে হবে |যেমন আমি এখানে project করেছি

          {
            $project: {
              password: 0,
              __v: 0,
            },
          },
        ],
        as: 'trainerDetails',
      },
    },
    {
      $project: { trainer: 0 },
    },
    {
      $addFields: {
        trainer: {
          $cond: {
            if: { $eq: [{ $size: '$trainerDetails' }, 0] },
            then: [{}],
            else: '$trainerDetails',
          },
        },
      },
    },
    {
      $project: { trainerDetails: 0 },
    },
    {
      $unwind: '$trainer',
    },

    // seller
    {
      $lookup: {
        from: 'sellers',
        let: { id: '$seller' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', '$$id'] },
              // Additional filter conditions for collection2
            },
          },
          // Additional stages for collection2
          // প্রথম লুকাপ চালানোর পরে যে ডাটা আসছে তার উপরে যদি আমি যেই কোন কিছু করতে চাই তাহলে এখানে করতে হবে |যেমন আমি এখানে project করেছি

          {
            $project: {
              password: 0,
              __v: 0,
            },
          },
        ],
        as: 'sellerDetails',
      },
    },
    {
      $project: { seller: 0 },
    },
    {
      $addFields: {
        seller: {
          $cond: {
            if: { $eq: [{ $size: '$sellerDetails' }, 0] },
            then: [{}],
            else: '$sellerDetails',
          },
        },
      },
    },
    {
      $project: { sellerDetails: 0 },
    },
    {
      $unwind: '$seller',
    },
  ];

  const result = await User.aggregate(pipeline);

  const total = await User.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getSingleUsers = async (id: string): Promise<IUser | null> => {
  const data = await User.findById(id).populate(
    'student admin seller trainer superAdmin'
  );
  return data;
};
const deleteSingleUsersFormDb = async (
  id: string,
  query: IUserFilters
): Promise<IUser | null> => {
  const isExist = await User.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  let data;
  if (query.delete == 'yes') {
    data = await User.findOneAndDelete({ _id: id });
    if (isExist.role === ENUM_USER_ROLE.ADMIN) {
      await Admin.findOneAndDelete({ _id: id });
    } else if (isExist.role === ENUM_USER_ROLE.SELLER) {
      await Seller.findOneAndDelete({ _id: id });
    } else if (isExist.role === ENUM_USER_ROLE.TRAINER) {
      await Trainer.findOneAndDelete({ _id: id });
    } else if (isExist.role === ENUM_USER_ROLE.STUDENT) {
      await Student.findOneAndDelete({ _id: id });
    }
  } else {
    data = await User.findByIdAndUpdate(id, { status: ENUM_STATUS.DEACTIVATE });
    if (isExist.role === ENUM_USER_ROLE.ADMIN) {
      await Admin.findByIdAndUpdate(id, { status: ENUM_STATUS.DEACTIVATE });
    } else if (isExist.role === ENUM_USER_ROLE.SELLER) {
      await Seller.findByIdAndUpdate(id, { status: ENUM_STATUS.DEACTIVATE });
    } else if (isExist.role === ENUM_USER_ROLE.TRAINER) {
      await Trainer.findByIdAndUpdate(id, { status: ENUM_STATUS.DEACTIVATE });
    } else if (isExist.role === ENUM_USER_ROLE.STUDENT) {
      await Student.findByIdAndUpdate(id, { status: ENUM_STATUS.DEACTIVATE });
    }
  }
  return data;
};

const createAdminService = async (
  admin: IAdmin,
  user: IUser
): Promise<IUser | null> => {
  // default password
  if (!user.password) {
    user.password = config.default_admin_pass as string;
  }
  const exist = await User.isUserExistMethod(user.email);
  if (exist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exist');
  }
  // set role
  user.role = ENUM_USER_ROLE.ADMIN;

  let newUserAllData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // const id = await generateAdminId();
    // user.id = id;
    // admin.id = id;

    const newAdmin = await Admin.create([admin], { session });

    if (!newAdmin.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create admin ');
    }

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
    newUserAllData = await User.findOne({ id: newUserAllData.id });
  }

  return newUserAllData;
};
const createStudentService = async (
  student: IStudent,
  user: IUser
): Promise<IUser | null> => {
  // default password
  if (!user.password) {
    user.password = config.default_student_pass as string;
  }
  const exist = await User.isUserExistMethod(user.email);
  if (exist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exist');
  }
  // set role
  user.role = ENUM_USER_ROLE.STUDENT;

  let newUserAllData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //array
    const newStudent = await Student.create([student], { session });

    if (!newStudent.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }
    //set student -->  _id into user.student
    user.student = newStudent[0]._id;

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
    newUserAllData = await User.findOne({ id: newUserAllData.id });
  }

  return newUserAllData;
};
const createTrainerService = async (
  trainer: ITrainer,
  user: IUser
): Promise<IUser | null> => {
  // default password
  if (!user.password) {
    user.password = config.default_student_pass as string;
  }
  const exist = await User.isUserExistMethod(user.email);
  if (exist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exist');
  }
  // set role
  user.role = ENUM_USER_ROLE.TRAINER;
  let newUserAllData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    //array
    const newTrainer = await Trainer.create([trainer], { session });
    if (!newTrainer.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create Trainer');
    }
    //set Trainer -->  _id into user.student
    user.trainer = newTrainer[0]._id;
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
    newUserAllData = await User.findOne({ id: newUserAllData.id });
  }

  return newUserAllData;
};
const createSellerService = async (
  seller: ISeller,
  user: IUser
): Promise<IUser | null> => {
  // default password
  if (!user.password) {
    user.password = config.default_student_pass as string;
  }
  const exist = await User.isUserExistMethod(user.email);
  if (exist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exist');
  }
  // set role
  user.role = ENUM_USER_ROLE.SELLER;

  let newUserAllData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //array
    const newSeller = await Seller.create([seller], { session });

    if (!newSeller.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create Seller');
    }
    //set Seller -->  _id into user.Seller
    user.seller = newSeller[0]._id;

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
    newUserAllData = await User.findOne({ id: newUserAllData.id });
  }

  return newUserAllData;
};

export const UserService = {
  createStudentService,
  createAdminService,
  createTrainerService,
  createSellerService,
  getAllUsers,
  getSingleUsers,
  deleteSingleUsersFormDb,
};
