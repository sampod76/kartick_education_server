/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-dgetAllModeratorisable @typescript-eslint/no-explicit-any */
import { SortOrder } from 'mongoose';

import httpStatus from 'http-status';

import { paginationHelper } from '../../../helper/paginationHelper';
import ApiError from '../../errors/ApiError';
import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { moderatorSearchableFields } from './moderator.constant';
import { IModerator, IModeratorFilters } from './moderator.interface';
import { Moderator } from './moderator.model';
import { Request } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';

const getAllModeratorsFromDb = async (
  filters: IModeratorFilters,
  paginationOptions: IPaginationOption
): Promise<IGenericResponse<IModerator[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: moderatorSearchableFields.map(field => ({
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

  const result = await Moderator.find(whereConditions)
    .populate('profileImage')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Moderator.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleModeratorFromDb = async (
  id: string,
  req: Request
): Promise<IModerator | null> => {
  if (req.user?.role !== ENUM_USER_ROLE.ADMIN && req.user?._id !== id) {
    throw new ApiError(500, 'unauthorise access!!');
  }
  const result = await Moderator.findOne({ _id: id });
  return result;
};

const updateModeratorFromDb = async (
  id: string,
  payload: Partial<IModerator>,
  req: Request
): Promise<IModerator | null> => {
  if (req.user?.role !== ENUM_USER_ROLE.ADMIN && req.user?._id !== id) {
    throw new ApiError(500, 'unauthorise access!!');
  }
  const isExist = await Moderator.findOne({ _id: id });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Moderator not found !');
  }

  const { name, ...ModeratorData } = payload;
  const updatedModeratorData: Partial<IModerator> = { ...ModeratorData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IModerator>;
      (updatedModeratorData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await Moderator.findOneAndUpdate(
    { _id: id },
    updatedModeratorData,
    {
      new: true,
    }
  );
  return result;
};
const createModeratorFromDb = async (
  payload: Partial<IModerator>
): Promise<IModerator | null> => {
  const removeFalseValue = (obj: any) => {
    const falseValues = [undefined, '', 'undefined', null, 'null'];
    for (const key in obj) {
      if (falseValues.includes(obj[key])) {
        delete obj[key];
      }
    }
  };

  removeFalseValue(payload);
  const result = await Moderator.create(payload);
  return result;
};

const deleteModeratorFromDb = async (
  id: string
): Promise<IModerator | null> => {
  const result = await Moderator.findOneAndDelete({ _id: id });
  return result;
};

export const ModeratorService = {
  createModeratorFromDb,
  getAllModeratorsFromDb,
  getSingleModeratorFromDb,
  updateModeratorFromDb,
  deleteModeratorFromDb,
};
