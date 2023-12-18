import httpStatus from 'http-status';
import mongoose, { PipelineStage } from 'mongoose';
import config from '../../../config/index';
import { ENUM_USER_ROLE } from '../../../enums/users';
import { paginationHelper } from '../../../helper/paginationHelper';
import ApiError from '../../errors/ApiError';
import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';
import { IAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import { IModerator } from '../moderator/moderator.interface';
import { Moderator } from '../moderator/moderator.model';
import { IStudent, IStudentFilters } from '../student/student.interface';
import { Student } from '../student/student.model';
import { userSearchableFields } from './user.constant';
import { IUser } from './user.interface';
import { User } from './user.model';

const getAllUsers = async (
  filters: IStudentFilters,
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
    
   
   
  ];

  const result = await User.aggregate(pipeline)

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

const createStudent = async (
  student: IStudent,
  user: IUser
): Promise<IUser | null> => {
  // default password
  if (!user.password) {
    user.password = config.default_student_pass as string;
  }
  const exist = await User.isUserExistMethod(user.email)
  if(exist){
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exist');
  }
  // set role
  user.role = 'student';

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
    newUserAllData = await User.findOne({ id: newUserAllData.id }).populate({
      path: 'student',
      // populate: [
      //   {
      //     path: 'academicSemester',
      //   },
      //   {
      //     path: 'academicDepartment',
      //   },
      //   {
      //     path: 'academicFaculty',
      //   },
      // ],
    });
  }

  return newUserAllData;
};

const createModerator = async (
  moderator: IModerator,
  user: IUser
): Promise<IUser | null> => {
  // default password
  if (!user.password) {
    user.password = config.default_moderator_pass as string;
  }
  const exist = await User.isUserExistMethod(user.email)
  if(exist){
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exist');
  }
  // set role
  user.role = ENUM_USER_ROLE.MODERATOR;

  
  let newUserAllData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const newModerator = await Moderator.create([moderator], { session });

    if (!newModerator.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create moderator ');
    }

    user.moderator = newModerator[0]._id;

    const newUser = await User.create([user], { session });

    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create moderator');
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
    newUserAllData = await User.findOne({ id: newUserAllData.id }).populate({
      path: 'moderator',
      // populate: [
      //   {
      //     path: 'academicDepartment',
      //   },
      //   {
      //     path: 'academicFaculty',
      //   },
      // ],
    });
  }

  return newUserAllData;
};
const createAdmin = async (
  admin: IAdmin,
  user: IUser
): Promise<IUser | null> => {
  // default password
  if (!user.password) {
    user.password = config.default_admin_pass as string;
  }
  const exist = await User.isUserExistMethod(user.email)
  if(exist){
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exist');
  }
  // set role
  user.role = 'admin';


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
    newUserAllData = await User.findOne({ id: newUserAllData.id }).populate({
      path: 'admin',
      
    });
  }

  return newUserAllData;
};

export const UserService = {
  createStudent,
  createModerator,
  createAdmin,
  getAllUsers,
};
