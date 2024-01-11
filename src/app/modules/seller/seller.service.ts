/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose, { SortOrder } from 'mongoose';

import { ENUM_STATUS, ENUM_YN } from '../../../enums/globalEnums';
import { paginationHelper } from '../../../helper/paginationHelper';
import ApiError from '../../errors/ApiError';
import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';
import { User } from '../user/user.model';
import { sellerSearchableFields } from './seller.constant';
import { ISeller, ISellerFilters } from './seller.interface';
import { Seller } from './seller.model';

const getAllSellersDB = async (
  filters: ISellerFilters,
  paginationOptions: IPaginationOption
): Promise<IGenericResponse<ISeller[]>> => {
  const { searchTerm, ...filtersData } = filters;
  filtersData.status= filtersData.status ? filtersData.status : ENUM_STATUS.ACTIVE
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: sellerSearchableFields.map(field => ({
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

  const result = await Seller.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Seller.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleSellerDB = async (id: string): Promise<ISeller | null> => {
  const result = await Seller.findById(id);
  return result;
};

const updateSellerDB = async (
  id: string,
  payload: Partial<ISeller>
): Promise<ISeller | null> => {
  const isExist = await Seller.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found !');
  }

  const { name, ...SellerData } = payload;

  const updatedStudentData: Partial<ISeller> = { ...SellerData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<ISeller>;
      (updatedStudentData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await Seller.findOneAndUpdate({ _id: id }, updatedStudentData, {
    new: true,
  });
  return result;
};

const deleteSellerDB = async (
  id: string,
  query: ISellerFilters
): Promise<ISeller | null> => {
  // check if the faculty is exist
  const isExist = await Seller.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found !');
  }

  const session = await mongoose.startSession();
  try {
    if (query.delete == ENUM_YN.YES) {
      session.startTransaction();
      //delete student first
      const SellerResult = await Seller.findOneAndDelete(
        { _id: id },
        { session }
      );
      if (!SellerResult) {
        throw new ApiError(404, 'Failed to delete Seller');
      }
      //delete user
      await User.findOneAndDelete({ _id: id }, { session });
      session.commitTransaction();
      session.endSession();

      return SellerResult;
    } else {
      session.startTransaction();
      //delete student first
      const SellerResult = await Seller.findOneAndUpdate(
        { _id: id },
        { status: ENUM_STATUS.DEACTIVATE },
        { session }
      );

      if (SellerResult) {
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
      return SellerResult;
    }
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const SellerService = {
  getAllSellersDB,
  getSingleSellerDB,
  updateSellerDB,
  deleteSellerDB,
};
