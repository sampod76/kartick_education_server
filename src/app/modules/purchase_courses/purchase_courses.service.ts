import mongoose, { Types } from 'mongoose';

import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { ENUM_STATUS, ENUM_YN } from '../../../enums/globalEnums';
import ApiError from '../../errors/ApiError';
import { PURCHASE_COURSE_SEARCHABLE_FIELDS } from './purchase_courses.constant';
import {
  IPurchaseCourse,
  IPurchaseCourseFilters,
} from './purchase_courses.interface';
import {
  PendingPurchaseCourse,
  // PendingPurchaseCourse,
  PurchaseCourse,
} from './purchase_courses.model';

const { ObjectId } = mongoose.Types;
const createPurchaseCourseByDb = async (
  payload: IPurchaseCourse,
): Promise<IPurchaseCourse | null> => {
  // const findCourse = await PurchaseCourse.findOne({
  //   title: payload.title,
  //   isDelete: false,
  // });

  // let result;
  // if (findCourse) {
  //   throw new ApiError(400, 'This Course is already have');
  // } else {
  //   result = await PurchaseCourse.create({ ...payload });
  // }

  const result = await PurchaseCourse.create({ ...payload });
  return result;
};
const createPendingPurchaseCourseByDb = async (
  payload: IPurchaseCourse,
): Promise<IPurchaseCourse | null> => {
  //all balance cournt in

  const result = await PendingPurchaseCourse.create({ ...payload });
  // const result =null
  return result;
};

//getAllQuizFromDb
const getAllPurchaseCourseFromDb = async (
  filters: IPurchaseCourseFilters,
  paginationOptions: IPaginationOption,
): Promise<IGenericResponse<IPurchaseCourse[]>> => {
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
      $or: PURCHASE_COURSE_SEARCHABLE_FIELDS.map(field =>
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
        field === 'course'
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

  const result = await PurchaseCourse.find(whereConditions)
    .sort(sortConditions)
    .skip(Number(skip))
    .limit(Number(limit))
    .populate('course')
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
  //   result = await PurchaseCourse.find({})
  //     .sort({ title: 1 })
  //     .select({ ...projection });
  // } else {
  //   result = await PurchaseCourse.aggregate(pipeline);
  // }

  const total = await PurchaseCourse.countDocuments(whereConditions);
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
const getPurchaseCourseVerifyFromDb = async (
  id: string,
  user: any,
): Promise<IPurchaseCourse[] | null> => {
  const findSubmitQuiz = await PurchaseCourse.find({
    quiz: new Types.ObjectId(id as string),
    user: new Types.ObjectId(user.id as string),
  });

  return findSubmitQuiz;
};
const getPurchaseCourseSingelFromDb = async (
  id: string,
): Promise<IPurchaseCourse | null> => {
  const result = await PurchaseCourse.aggregate([
    { $match: { _id: new ObjectId(id) } },
  ]);

  return result[0];
};
const updatePurchaseCourseFromDb = async (
  id: string,
  payload: Partial<IPurchaseCourse>,
): Promise<IPurchaseCourse | null> => {
  const result = await PurchaseCourse.findOneAndUpdate({ _id: id }, payload, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new ApiError(500, 'Module update fail!!😪😭😰');
  }
  return result;
};
// delete e form db
const deletePurchaseCourseByIdFromDb = async (
  id: string,
  query: IPurchaseCourseFilters,
): Promise<IPurchaseCourse | null> => {
  let result;
  if (query.delete === ENUM_YN.YES) {
    result = await PurchaseCourse.findByIdAndDelete(id);
  } else {
    result = await PurchaseCourse.findOneAndUpdate(
      { _id: id },
      { status: ENUM_STATUS.DEACTIVATE, isDelete: ENUM_YN.YES },
    );
  }
  return result;
};

export const PurchaseCourseService = {
  createPurchaseCourseByDb,
  getAllPurchaseCourseFromDb,
  getPurchaseCourseSingelFromDb,
  deletePurchaseCourseByIdFromDb,
  getPurchaseCourseVerifyFromDb,
  updatePurchaseCourseFromDb,
  createPendingPurchaseCourseByDb,
};
