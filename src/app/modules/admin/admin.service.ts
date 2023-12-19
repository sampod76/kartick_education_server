/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose, { SortOrder } from 'mongoose';

import { ENUM_STATUS } from '../../../enums/globalEnums';
import { paginationHelper } from '../../../helper/paginationHelper';
import ApiError from '../../errors/ApiError';
import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';
import { User } from '../user/user.model';
import { adminSearchableFields } from './admin.constant';
import { IAdmin, IAdminFilters } from './admin.interface';
import { Admin } from './admin.model';

const getAllAdminsDB = async (
  filters: IAdminFilters,
  paginationOptions: IPaginationOption
): Promise<IGenericResponse<IAdmin[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: adminSearchableFields.map(field => ({
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

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Admin.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Admin.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleAdminDB = async (id: string): Promise<IAdmin | null> => {
  const result = await Admin.findById(id);
  return result;
};

const updateAdminDB = async (
  id: string,
  payload: Partial<IAdmin>
): Promise<IAdmin | null> => {
  const isExist = await Admin.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found !');
  }

  const { name, ...adminData } = payload;

  const updatedStudentData: Partial<IAdmin> = { ...adminData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IAdmin>;
      (updatedStudentData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await Admin.findOneAndUpdate({ _id: id }, updatedStudentData, {
    new: true,
  });
  return result;
};

const deleteAdminDB = async (
  id: string,
  query: IAdminFilters
): Promise<IAdmin | null> => {
  // check if the faculty is exist
  const isExist = await Admin.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Faculty not found !');
  }

  const session = await mongoose.startSession();
  try {
    if (query.delete == 'true') {
      session.startTransaction();
      //delete student first
      const adminResult = await Admin.findOneAndDelete(
        { _id: id },
        { session }
      );
      if (!adminResult) {
        throw new ApiError(404, 'Failed to delete student');
      }
      //delete user
      await User.findOneAndDelete({ _id: id }, { session });
      session.commitTransaction();
      session.endSession();

      return adminResult;
    } else {
      session.startTransaction();
      //delete student first
      const adminResult = await Admin.findOneAndUpdate(
        { _id: id },
        { status: ENUM_STATUS.DEACTIVATE },
        { session }
      );

      if (adminResult) {
        throw new ApiError(404, 'Failed to delete student');
      }
      //delete user
      await User.findOneAndUpdate(
        { email: isExist.email },
        { status: ENUM_STATUS.DEACTIVATE },
        { session }
      );
      session.commitTransaction();
      session.endSession();
      return adminResult;
    }
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const AdminService = {
  getAllAdminsDB,
  getSingleAdminDB,
  updateAdminDB,
  deleteAdminDB,
};
