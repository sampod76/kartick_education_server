import httpStatus from 'http-status';
import mongoose from 'mongoose';
import config from '../../../config/index';
import { IAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import { IStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { IUser } from './user.interface';
import { User } from './user.model';
import ApiError from '../../errors/ApiError';
import { IModerator } from '../Moderator/moderator.interface';
import { Moderator } from '../Moderator/moderator.model';

const createStudent = async (
  student: IStudent,
  user: IUser
): Promise<IUser | null> => {
  // default password
  if (!user.password) {
    user.password = config.default_student_pass as string;
  }
  // set role
  user.role = 'student';

  // const academicsemester = await AcademicSemester.findById(
  //   student.academicSemester
  // ).lean();

  // generate student id
  let newUserAllData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // const id = await generateStudentId(academicsemester as IAcademicSemester);

    // user.id = id;
    // student.id = id;

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
  // set role
  user.role = 'faculty';

  
  let newUserAllData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // const id = await generateFacultyId();
    // user.id = id;
    // faculty.id = id;

    const newModerator = await Moderator.create([moderator], { session });

    if (!newModerator.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create moderator ');
    }

    user.moderator = newModerator[0]._id;

    const newUser = await User.create([user], { session });

    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
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
      path: 'faculty',
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
      populate: [
        {
          path: 'managementDepartment',
        },
      ],
    });
  }

  return newUserAllData;
};

export const UserService = {
  createStudent,
  createModerator,
  createAdmin,
};
