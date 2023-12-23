/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose, { SortOrder } from 'mongoose';

import { ENUM_STATUS, ENUM_YN } from '../../../enums/globalEnums';
import { paginationHelper } from '../../../helper/paginationHelper';
import ApiError from '../../errors/ApiError';
import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';
import { User } from '../user/user.model';
import { trainerSearchableFields } from './trainer.constant';
import { ITrainer, ITrainerFilters } from './trainer.interface';
import { Trainer } from './trainer.model';

const getAllTrainersDB = async (
  filters: ITrainerFilters,
  paginationOptions: IPaginationOption
): Promise<IGenericResponse<ITrainer[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: trainerSearchableFields.map(field => ({
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

  const result = await Trainer.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Trainer.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleTrainerDB = async (id: string): Promise<ITrainer | null> => {
  const result = await Trainer.findById(id);
  return result;
};

const updateTrainerDB = async (
  id: string,
  payload: Partial<ITrainer>
): Promise<ITrainer | null> => {
  const isExist = await Trainer.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trainer not found !');
  }

  const { name, ...TrainerData } = payload;

  const updatedStudentData: Partial<ITrainer> = { ...TrainerData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<ITrainer>;
      (updatedStudentData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await Trainer.findOneAndUpdate({ _id: id }, updatedStudentData, {
    new: true,
  });
  return result;
};

const deleteTrainerDB = async (
  id: string,
  query: ITrainerFilters
): Promise<ITrainer | null> => {
  // check if the faculty is exist
  const isExist = await Trainer.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trainer not found !');
  }

  const session = await mongoose.startSession();
  try {
    if (query.delete == ENUM_YN.YES) {
      session.startTransaction();
      //delete student first
      const TrainerResult = await Trainer.findOneAndDelete(
        { _id: id },
        { session }
      );
      if (!TrainerResult) {
        throw new ApiError(404, 'Failed to delete Trainer');
      }
      //delete user
      await User.findOneAndDelete({ _id: id }, { session });
      session.commitTransaction();
      session.endSession();

      return TrainerResult;
    } else {
      session.startTransaction();
      //delete student first
      const TrainerResult = await Trainer.findOneAndUpdate(
        { _id: id },
        { status: ENUM_STATUS.DEACTIVATE },
        { session }
      );

      if (TrainerResult) {
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
      return TrainerResult;
    }
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const TrainerService = {
  getAllTrainersDB,
  getSingleTrainerDB,
  updateTrainerDB,
  deleteTrainerDB,
};
