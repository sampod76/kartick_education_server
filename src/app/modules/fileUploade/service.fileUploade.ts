import { SortOrder } from 'mongoose';
import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { FILEUPLOADE_SEARCHABLE_FIELDS } from './consent.fileUploade';
import { IFileUploade, IFileUploadeFilters } from './interface.fileUploade';
import { FileUploade } from './model.fileUploade';

const createFileUploadeByDb = async (
  payload: IFileUploade
): Promise<IFileUploade> => {
  payload.url =
    payload.path === 'uploadFile/images'
      ? `${process.env.REAL_HOST_SERVER_SIDE}/images/${payload.filename}`
      : `${process.env.REAL_HOST_SERVER_SIDE}/vedios/${payload.filename}`;

  const result = await FileUploade.create(payload);

  return result;
};

//getAllFileUploadeFromDb
const getAllFileUploadeFromDb = async (
  filters: IFileUploadeFilters,
  paginationOptions: IPaginationOption
): Promise<IGenericResponse<IFileUploade[]>> => {
  //****************search and filters start************/
  const { searchTerm, ...filtersData } = filters;
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: FILEUPLOADE_SEARCHABLE_FIELDS.map(field => ({
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

  //****************search and filters end**********/

  //****************pagination start **************/
  const {
    page,
    limit = 30,
    skip,
    sortBy,
    sortOrder,
  } = paginationHelper.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  //****************pagination end ***************/

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await FileUploade.find(whereConditions)
    .sort(sortConditions)
    .skip(Number(skip))
    .limit(Number(limit));

  const total = await FileUploade.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// get single FileUploadee form db
const getSingleFileUploadeFromDb = async (
  id: string
): Promise<IFileUploade | null> => {
  const result = await FileUploade.findById(id);

  return result;
};

// update FileUploadee form db
const updateFileUploadeFromDb = async (
  id: string,
  payload: Partial<IFileUploade>
): Promise<IFileUploade | null> => {
  const result = await FileUploade.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

// delete FileUploadee form db
const deleteFileUploadeByIdFromDb = async (
  id: string
): Promise<IFileUploade | null> => {
  const result = await FileUploade.findByIdAndDelete(id);
  return result;
};

export const FileUploadeService = {
  createFileUploadeByDb,
  getAllFileUploadeFromDb,
  getSingleFileUploadeFromDb,
  updateFileUploadeFromDb,
  deleteFileUploadeByIdFromDb,
};
