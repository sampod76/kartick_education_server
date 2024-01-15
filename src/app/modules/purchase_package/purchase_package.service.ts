import mongoose, { Types } from 'mongoose';

import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { ENUM_STATUS, ENUM_YN } from '../../../enums/globalEnums';
import { PACKAGE_SEARCHABLE_FIELDS } from './purchase_package.constant';
import { IPackage, IPackageFilters } from './purchase_package.interface';
import { Package } from './purchase_package.model';

const { ObjectId } = mongoose.Types;
const createPackageByDb = async (
  payload: IPackage
): Promise<IPackage | null> => {
  // const findPackage = await Package.findOne({
  //   title: payload.title,
  //   isDelete: false,
  // });

  // let result;
  // if (findPackage) {
  //   throw new ApiError(400, 'This package is already have');
  // } else {
  //   result = await Package.create({ ...payload });
  // }

  const result = await Package.create({ ...payload });
  return result;
};

//getAllQuizFromDb
const getAllPackageFromDb = async (
  filters: IPackageFilters,
  paginationOptions: IPaginationOption
): Promise<IGenericResponse<IPackage[]>> => {
  //****************search and filters start************/
  const { searchTerm, select, ...filtersData } = filters;
  console.log('🚀 ~ filtersData:', filtersData);

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
      $or: PACKAGE_SEARCHABLE_FIELDS.map(field =>
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
        field === 'membershipUid'
          ? { ['membership.uid']: value }
          : { [field]: value }
      ),
    });
  }
  console.log('🚀 ~ andConditions:', andConditions);

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

  const result = await Package.find(whereConditions)
    .sort(sortConditions)
    .skip(Number(skip))
    .limit(Number(limit))
    .populate('categories.category');

  // const pipeline: PipelineStage[] = [
  //   { $match: whereConditions },
  //   { $sort: sortConditions },
  //   { $skip: Number(skip) || 0 },
  //   { $limit: Number(limit) || 15 },
  //   {
  //     $unwind: '$categories',
  //   },
  //   {
  //     $lookup: {
  //       from: 'categories',
  //       let: {
  //         id: '$categories.category',
  //         label: '$categories.label',
  //         biannual: '$categories.biannual',
  //         yearly: '$categories.yearly',
  //         monthly: '$categories.monthly',
  //       },
  //       pipeline: [
  //         {
  //           $match: {
  //             $expr: {
  //               $and: [
  //                 { $eq: ['$_id', '$$id'] },
  //                 { $eq: ['$isDelete', ENUM_YN.NO] },
  //                 // { $eq: ['$status', ENUM_STATUS.ACTIVE] },
  //               ],
  //             },
  //             // Additional filter conditions for collection2
  //           },
  //         },
  //         // Additional stages for collection2
  //         {
  //           $project: {
  //             title: 1,
  //             img: 1,
  //             label: '$$label',
  //             biannual: '$$categories.biannual',
  //             yearly: '$$categories.yearly',
  //             monthly: '$$categories.monthly',
  //           },
  //         },
  //       ],
  //       as: 'categoriesDetails',
  //     },
  //   },
  //   {
  //     $unwind: '$categoriesDetails',
  //   },
  //   {
  //     $group: {
  //       _id: '$_id',
  //       membership: { $first: '$membership' },
  //       title: { $first: '$title' },
  //       categories: {
  //         $push: {
  //           category: '$categoriesDetails',
  //           label: '$categoriesDetails.label',
  //           biannual: '$$categoriesDetails.biannual',
  //           yearly: '$$categoriesDetails.yearly',
  //           monthly: '$$categoriesDetails.monthly',
  //         },
  //       },
  //       date_range: { $first: '$date_range' },
  //       type: { $first: '$type' },
  //       status: { $first: '$status' },
  //       biannual: { $first: '$biannual' },
  //       monthly: { $first: '$monthly' },
  //       yearly: { $first: '$yearly' },

  //       createdAt: { $first: '$createdAt' },
  //       updatedAt: { $first: '$updatedAt' },
  //       __v: { $first: '$__v' },
  //     },
  //   },
  // ];

  // let result = null;
  // if (select) {
  //   result = await Package.find({})
  //     .sort({ title: 1 })
  //     .select({ ...projection });
  // } else {
  //   result = await Package.aggregate(pipeline);
  // }

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
