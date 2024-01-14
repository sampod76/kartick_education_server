import mongoose, { PipelineStage, Types } from 'mongoose';

import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { ENUM_STATUS, ENUM_YN } from '../../../enums/globalEnums';
import ApiError from '../../errors/ApiError';
import { QUIZ_SUBMIT_SEARCHABLE_FIELDS } from './package.constant';
import { IPackage, IPackageFilters } from './package.interface';
import { Package } from './package.model';

const { ObjectId } = mongoose.Types;
const createPackageByDb = async (
  payload: IPackage
): Promise<IPackage | null> => {
  const findPackage = await Package.findOne({
    title: payload.title,
    isDelete: false,
  });

  let result;
  if (findPackage) {
    throw new ApiError(400, 'This package is already have');
  } else {
    result = await Package.create({ ...payload });
  }

  return result;
};

//getAllQuizFromDb
const getAllPackageFromDb = async (
  filters: IPackageFilters,
  paginationOptions: IPaginationOption
): Promise<IGenericResponse<IPackage[]>> => {
  //****************search and filters start************/
  const { searchTerm, select, ...filtersData } = filters;
  filtersData.isDelete = filtersData.isDelete
    ? filtersData.isDelete
    : ENUM_YN.NO;

  // Split the string and extract field names
  const projection: { [key: string]: number } = {};
  if (select) {
    const fieldNames = select?.split(',').map(field => field.trim());
    // Create the projection object
    fieldNames.forEach(field => {
      projection[field] = 1;
    });
  }

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: QUIZ_SUBMIT_SEARCHABLE_FIELDS.map(field =>
        //search array value
        field === 'tags'
          ? { [field]: { $in: [new RegExp(searchTerm, 'i')] } }
          : {
              [field]: new RegExp(searchTerm, 'i'),
            }
      ),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) =>
        field === 'category'
          ? { [field]: new Types.ObjectId(value) }
          : field === 'course'
          ? { [field]: new Types.ObjectId(value) }
          : field === 'milestone'
          ? { [field]: new Types.ObjectId(value) }
          : field === 'module'
          ? { [field]: new Types.ObjectId(value) }
          : field === 'lesson'
          ? { [field]: new Types.ObjectId(value) }
          : field === 'quiz'
          ? { [field]: new Types.ObjectId(value) }
          : { [field]: value }
      ),
    });
  }

  //****************search and filters end**********/

  //****************pagination start **************/

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

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
  ];

  let result = null;
  if (select) {
    result = await Package.find({})
      .sort({ title: 1 })
      .select({ ...projection });
  } else {
    result = await Package.aggregate(pipeline);
  }

  const total = await Package.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// get single e form db
const getPackageVerifyFromDb = async (
  id: string,
  user: any
): Promise<IPackage[] | null> => {
  const findSubmitQuiz = await Package.find({
    quiz: new Types.ObjectId(id as string),
    user: new Types.ObjectId(user.id as string),
  }).populate('singleQuiz');

  return findSubmitQuiz;
};
const getPackageSingelFromDb = async (id: string): Promise<IPackage | null> => {
  const result = await Package.aggregate([
    { $match: { _id: new ObjectId(id) } },
  ]);

  return result[0];
};

// delete e form db
const deletePackageByIdFromDb = async (
  id: string,
  query: IPackageFilters
): Promise<IPackage | null> => {
  let result;
  if (query.delete === ENUM_YN.YES) {
    result = await Package.findByIdAndDelete(id);
  } else {
    result = await Package.findOneAndUpdate(
      { _id: id },
      { status: ENUM_STATUS.DEACTIVATE, isDelete: ENUM_YN.YES }
    );
  }
  return result;
};

export const PackageService = {
  createPackageByDb,
  getAllPackageFromDb,
  getPackageSingelFromDb,
  deletePackageByIdFromDb,
  getPackageVerifyFromDb,
};
