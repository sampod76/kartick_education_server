/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-dgetAllAdminisable @typescript-eslint/no-explicit-any */
import { SortOrder } from 'mongoose';

import httpStatus from 'http-status';

import { paginationHelper } from '../../../helper/paginationHelper';
import ApiError from '../../errors/ApiError';
import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { adminSearchableFields } from './admin.constant';
import { IAdmin, IAdminFilters } from './admin.interface';
import { Admin } from './admin.model';
const crateAdminFromDb = async (payload: IAdmin): Promise<IAdmin | null> => {
  // check if the Admin is exist
  const removeFalseValue = (obj: any) => {
    const falseValues = [undefined, '', 'undefined', null, 'null'];
    for (const key in obj) {
      if (falseValues.includes(obj[key])) {
        delete obj[key];
      }
    }
  };

  removeFalseValue(payload);
  const result = await Admin.create(payload);
  return result;
};

const getAllAdminsFromDb = async (
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
    .populate('profileImage')
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

const getSingleAdminFromDb = async (id: string): Promise<IAdmin | null> => {
  const result = await Admin.findById(id).populate('profileImage');
  return result;
};

const updateAdminFromDb = async (
  id: string,
  payload: Partial<IAdmin>
): Promise<IAdmin | null> => {
  const isExist = await Admin.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found !');
  }

  const { name, ...AdminData } = payload;
  const updatedAdminData: Partial<IAdmin> = { ...AdminData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IAdmin>;
      (updatedAdminData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await Admin.findOneAndUpdate({ id }, updatedAdminData, {
    new: true,
  });
  return result;
};

const deleteAdminFromDb = async (id: string): Promise<IAdmin | null> => {
  const result = await Admin.findOneAndDelete(
    { _id: id },
    { runValidators: true, new: true }
  );
  return result;
};

export const AdminService = {
  getAllAdminsFromDb,
  crateAdminFromDb,
  getSingleAdminFromDb,
  updateAdminFromDb,
  deleteAdminFromDb,
};
