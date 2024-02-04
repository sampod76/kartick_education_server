/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { SortOrder, Types } from 'mongoose';

import httpStatus from 'http-status';

import { ENUM_STATUS } from '../../../enums/globalEnums';
import { paginationHelper } from '../../../helper/paginationHelper';
import ApiError from '../../errors/ApiError';
import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';
import { User } from '../user/user.model';
import { studentSearchableFields } from './student.constant';
import { IStudent, IStudentFilters } from './student.interface';
import { Student } from './student.model';

const getAllStudents = async (
  filters: IStudentFilters,
  paginationOptions: IPaginationOption,
): Promise<IGenericResponse<IStudent[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: studentSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => 
        field === 'author'
          ? { [field]: new Types.ObjectId(value) }
          : { [field]: value }
    ),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Student.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Student.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleStudent = async (id: string): Promise<IStudent | null> => {
  const result = await Student.findById({ _id: id });
  return result;
};

const updateStudent = async (
  id: string,
  payload: Partial<IStudent>,
): Promise<IStudent | null> => {
  const isExist = await Student.findById({ _id: id });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found !');
  }

  const { name, ...studentData } = payload;

  const updatedStudentData: Partial<IStudent> = { ...studentData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IStudent>; // `name.fisrtName`
      (updatedStudentData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await Student.findOneAndUpdate(
    { _id: id },
    updatedStudentData,
    {
      new: true,
    },
  );
  return result;
};

const deleteStudent = async (
  id: string,
  filter: IStudentFilters,
): Promise<IStudent | null> => {
  // check if the faculty is exist

  const isExist = await Student.findById({ _id: id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found !');
  }

  const session = await mongoose.startSession();
  try {
    if (filter.delete == 'yes') {
      session.startTransaction();
      //delete student first
      const student = await Student.findOneAndDelete({ _id: id }, { session });
      if (!student) {
        throw new ApiError(404, 'Failed to delete student');
      }
      //delete user
      await User.findOneAndDelete({ _id: id }, { session });
      session.commitTransaction();
      session.endSession();

      return student;
    } else {
      session.startTransaction();
      //delete student first
      const student = await Student.findOneAndUpdate(
        { _id: id },
        { status: ENUM_STATUS.DEACTIVATE },
        { session },
      );

      if (student) {
        throw new ApiError(404, 'Failed to delete student');
      }
      //delete user
      await User.findOneAndUpdate(
        { email: isExist.email },
        { status: ENUM_STATUS.DEACTIVATE },
        { session },
      );
      session.commitTransaction();
      session.endSession();
      return student;
    }
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const StudentService = {
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
};
