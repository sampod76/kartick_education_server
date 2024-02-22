import { PipelineStage, Types } from 'mongoose';

import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { ENUM_STATUS, ENUM_YN } from '../../../enums/globalEnums';
import ApiError from '../../errors/ApiError';
import { purchase_category_SEARCHABLE_FIELDS } from './purchase_category.constant';
import {
  IPurchase_category,
  IPurchase_categoryFilters,
} from './purchase_category.interface';
import {
  PendingPurchase_category,
  // PendingPurchase_category,
  Purchase_category,
} from './purchase_category.model';

const createPurchase_categoryByDb = async (
  payload: IPurchase_category,
): Promise<IPurchase_category | null> => {
  // const findcategory = await Purchase_category.findOne({
  //   title: payload.title,
  //   isDelete: false,
  // });

  // let result;
  // if (findcategory) {
  //   throw new ApiError(400, 'This category is already have');
  // } else {
  //   result = await Purchase_category.create({ ...payload });
  // }

  const result = await Purchase_category.create({ ...payload });
  return result;
};
const createPendingPurchase_categoryByDb = async (
  payload: IPurchase_category,
): Promise<IPurchase_category | null> => {
  //all balance cournt in

  const result = await PendingPurchase_category.create({ ...payload });
  // const result =null
  return result;
};

//getAllQuizFromDb
const getAllPurchase_categoryFromDb = async (
  filters: IPurchase_categoryFilters,
  paginationOptions: IPaginationOption,
): Promise<IGenericResponse<IPurchase_category[]>> => {
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
      $or: purchase_category_SEARCHABLE_FIELDS.map(field =>
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
        field === 'category'
          ? { [field]: new Types.ObjectId(value) }
          : field === 'user'
            ? { [field]: new Types.ObjectId(value) }
            : { [field]: value },
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

  const result = await Purchase_category.find(whereConditions)
    .sort(sortConditions)
    .skip(Number(skip))
    .limit(Number(limit))
    .populate('category')
    .populate('user');

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
  //         // label: '$categories.label',
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
  //             // label: '$$label',
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
  //           // label: '$categoriesDetails.label',
  //         },
  //       },
  //       date_range: { $first: '$date_range' },
  //       type: { $first: '$type' },
  //       status: { $first: '$status' },
  //       createdAt: { $first: '$createdAt' },
  //       updatedAt: { $first: '$updatedAt' },

  //     },
  //   },
  // ];

  // let result = null;
  // if (select) {
  //   result = await Purchase_category.find({})
  //     .sort({ title: 1 })
  //     .select({ ...projection });
  // } else {
  //   result = await Purchase_category.aggregate(pipeline);
  // }

  const total = await Purchase_category.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getAllPurchaseAndPendingcategorysFromDb = async (
  filters: IPurchase_categoryFilters,
  paginationOptions: IPaginationOption,
): Promise<IGenericResponse<IPurchase_category[]>> => {
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
      $or: purchase_category_SEARCHABLE_FIELDS.map(field =>
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
        field === 'category'
          ? { [field]: new Types.ObjectId(value) }
          : field === 'user'
            ? { [field]: new Types.ObjectId(value) }
            : { [field]: value },
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

  const result = await PendingPurchase_category.find(whereConditions)
    .sort(sortConditions)
    .skip(Number(skip))
    .limit(Number(limit))
    .populate('category')
    .populate('user');
  //   // .populate({
  //   //   path: 'user',
  //   //   select: { password: 0 },
  //   //   //   populate: {
  //   //   //     path: 'teacher',
  //   //   //     model: 'teachers',
  //   //   //     populate: {
  //   //   //         path: 'user',
  //   //   //         model: 'User'
  //   //   //     }
  //   //   // }
  //   // });

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
  //         // label: '$categories.label',
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
  //             // label: '$$label',
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
  //           // label: '$categoriesDetails.label',
  //         },
  //       },
  //       date_range: { $first: '$date_range' },
  //       type: { $first: '$type' },
  //       status: { $first: '$status' },
  //       createdAt: { $first: '$createdAt' },
  //       updatedAt: { $first: '$updatedAt' },

  //     },
  //   },
  // ];

  // let result = null;
  // if (select) {
  //   result = await Purchase_category.find({})
  //     .sort({ title: 1 })
  //     .select({ ...projection });
  // } else {
  //   result = await Purchase_category.aggregate(pipeline);
  // }

  const total = await PendingPurchase_category.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAllPurchase_categorysTotalAmountFromDb = async (
  filters: IPurchase_categoryFilters,
  paginationOptions: IPaginationOption,
): Promise<IGenericResponse<IPurchase_category[]>> => {
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
      $or: purchase_category_SEARCHABLE_FIELDS.map(field =>
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
        field === 'category'
          ? { [field]: new Types.ObjectId(value) }
          : field === 'user'
            ? { [field]: new Types.ObjectId(value) }
            : { [field]: value },
      ),
    });
  }

  //****************search and filters end**********/

  //****************pagination start **************/

  const { page, limit, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: 1 | -1 } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder === 'asc' ? 1 : -1;
  }

  //****************pagination end ***************/

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};
  const pipeline: PipelineStage[] = [
    { $match: whereConditions },
    {
      $group: {
        _id: { paymentStatus: 'approved' },
        totalAmount: { $sum: '$total_price' },
        count: { $sum: 1 },
      },
    },
  ];
  const result = await Purchase_category.aggregate(pipeline);

  return {
    meta: {
      page,
      limit,
      total: 1,
    },
    data: result,
  };
};

// get single e form db
const getPurchase_categoryVerifyFromDb = async (
  id: string,
  user: any,
): Promise<IPurchase_category[] | null> => {
  const findSubmitQuiz = await Purchase_category.find({
    quiz: new Types.ObjectId(id as string),
    user: new Types.ObjectId(user.id as string),
  });

  return findSubmitQuiz;
};
const getPurchase_categorySingelFromDb = async (
  id: string,
): Promise<IPurchase_category | null> => {
  const result = await Purchase_category.findOne({
    _id: id,
    isDelete: ENUM_YN.NO,
  })
    .populate('category')
    .populate('user');

  return result;
};
const getSinglePurchaseAndPendingcategorysFromDb = async (
  id: string,
): Promise<IPurchase_category | null> => {
  const result = await PendingPurchase_category.findOne({
    _id: id,
    isDelete: ENUM_YN.NO,
  })
    .populate('category')
    .populate('user');

  return result;
};
const updatePurchase_categoryFromDb = async (
  id: string,
  payload: Partial<IPurchase_category>,
): Promise<IPurchase_category | null> => {
  const result = await Purchase_category.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
      runValidators: true,
    },
  );
  if (!result) {
    throw new ApiError(500, 'Module update fail!!😪😭😰');
  }
  return result;
};
// delete e form db
const deletePurchase_categoryByIdFromDb = async (
  id: string,
  query: IPurchase_categoryFilters,
): Promise<IPurchase_category | null> => {
  let result;
  if (query.delete === ENUM_YN.YES) {
    result = await Purchase_category.findByIdAndDelete(id);
  } else {
    result = await Purchase_category.findOneAndUpdate(
      { _id: id },
      { status: ENUM_STATUS.DEACTIVATE, isDelete: ENUM_YN.YES },
    );
  }
  return result;
};

export const Purchase_categoryService = {
  createPurchase_categoryByDb,
  getAllPurchase_categoryFromDb,
  getPurchase_categorySingelFromDb,
  deletePurchase_categoryByIdFromDb,
  getPurchase_categoryVerifyFromDb,
  updatePurchase_categoryFromDb,
  createPendingPurchase_categoryByDb,
  getAllPurchaseAndPendingcategorysFromDb,
  getSinglePurchaseAndPendingcategorysFromDb,
  getAllPurchase_categorysTotalAmountFromDb,
};
