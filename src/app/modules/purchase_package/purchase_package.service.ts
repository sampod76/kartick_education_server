import mongoose, { Types } from 'mongoose';

import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { ENUM_STATUS, ENUM_YN } from '../../../enums/globalEnums';
import ApiError from '../../errors/ApiError';
import { PURCHASE_PACKAGE_SEARCHABLE_FIELDS } from './purchase_package.constant';
import {
  IPurchasePackage,
  IPurchasePackageFilters,
} from './purchase_package.interface';
import {
  PendingPurchasePackage,
  PurchasePackage,
} from './purchase_package.model';

const { ObjectId } = mongoose.Types;
const createPurchasePackageByDb = async (
  payload: IPurchasePackage,
): Promise<IPurchasePackage | null> => {
  // const findPackage = await PurchasePackage.findOne({
  //   title: payload.title,
  //   isDelete: false,
  // });

  // let result;
  // if (findPackage) {
  //   throw new ApiError(400, 'This package is already have');
  // } else {
  //   result = await PurchasePackage.create({ ...payload });
  // }

  const result = await PurchasePackage.create({ ...payload });
  return result;
};
const createPendingPurchasePackageByDb = async (
  payload: IPurchasePackage,
): Promise<IPurchasePackage | null> => {

  //all balance cournt in
  const result = await PendingPurchasePackage.create({ ...payload });
  return result;
};

//getAllQuizFromDb
const getAllPurchasePackageFromDb = async (
  filters: IPurchasePackageFilters,
  paginationOptions: IPaginationOption,
): Promise<IGenericResponse<IPurchasePackage[]>> => {
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
      $or: PURCHASE_PACKAGE_SEARCHABLE_FIELDS.map(field =>
        //search array value
        field === 'tags'
          ? { [field]: { $in: [new RegExp(searchTerm, 'i')] } }
          : {
              [field]: new RegExp(searchTerm, 'i'),
            },
      ),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) =>
        field === 'membershipUid'
          ? { ['membership.uid']: value }
          : field === 'package'
            ? { [field]: new Types.ObjectId(value) }
            : { [field]: value },
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

  const result = await PurchasePackage.find(whereConditions)
    .sort(sortConditions)
    .skip(Number(skip))
    .limit(Number(limit))
    .populate('categories.category')
    .populate({
      path: 'user',
      select: { password: 0 },
      //   populate: {
      //     path: 'teacher',
      //     model: 'teachers',
      //     populate: {
      //         path: 'user',
      //         model: 'User'
      //     }
      // }
    });

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
  //   result = await PurchasePackage.find({})
  //     .sort({ title: 1 })
  //     .select({ ...projection });
  // } else {
  //   result = await PurchasePackage.aggregate(pipeline);
  // }

  const total = await PurchasePackage.countDocuments(whereConditions);
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
const getPurchasePackageVerifyFromDb = async (
  id: string,
  user: any,
): Promise<IPurchasePackage[] | null> => {
  const findSubmitQuiz = await PurchasePackage.find({
    quiz: new Types.ObjectId(id as string),
    user: new Types.ObjectId(user.id as string),
  });

  return findSubmitQuiz;
};
const getPurchasePackageSingelFromDb = async (
  id: string,
): Promise<IPurchasePackage | null> => {
  const result = await PurchasePackage.aggregate([
    { $match: { _id: new ObjectId(id) } },
  ]);

  return result[0];
};
const updatePurchasePackageFromDb = async (
  id: string,
  payload: Partial<IPurchasePackage>,
): Promise<IPurchasePackage | null> => {
  const result = await PurchasePackage.findOneAndUpdate({ _id: id }, payload, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new ApiError(500, 'Module update fail!!😪😭😰');
  }
  return result;
};
// delete e form db
const deletePurchasePackageByIdFromDb = async (
  id: string,
  query: IPurchasePackageFilters,
): Promise<IPurchasePackage | null> => {
  let result;
  if (query.delete === ENUM_YN.YES) {
    result = await PurchasePackage.findByIdAndDelete(id);
  } else {
    result = await PurchasePackage.findOneAndUpdate(
      { _id: id },
      { status: ENUM_STATUS.DEACTIVATE, isDelete: ENUM_YN.YES },
    );
  }
  return result;
};

export const PurchasePackageService = {
  createPurchasePackageByDb,
  getAllPurchasePackageFromDb,
  getPurchasePackageSingelFromDb,
  deletePurchasePackageByIdFromDb,
  getPurchasePackageVerifyFromDb,
  updatePurchasePackageFromDb,
  createPendingPurchasePackageByDb,
};
