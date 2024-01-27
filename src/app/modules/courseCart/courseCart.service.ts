import mongoose, { PipelineStage, Types } from 'mongoose';

import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { ENUM_STATUS, ENUM_YN } from '../../../enums/globalEnums';
import ApiError from '../../errors/ApiError';
import { CourseCart_SEARCHABLE_FIELDS } from './courseCart.constant';
import { ICourseCart, ICourseCartFilters } from './courseCart.interface';
import { CourseCart } from './courseCart.model';

const { ObjectId } = mongoose.Types;
const createCourseCartByDb = async (
  payload: ICourseCart,
): Promise<ICourseCart> => {
  const result = await CourseCart.create(payload);
  return result;
};

//getAllCourseCartFromDb
const getAllCourseCartFromDb = async (
  filters: ICourseCartFilters,
  paginationOptions: IPaginationOption,
): Promise<IGenericResponse<ICourseCart[]>> => {
  //****************search and filters start************/
  const { searchTerm, ...filtersData } = filters;
  filtersData.status = filtersData.status
    ? filtersData.status
    : ENUM_STATUS.ACTIVE;
  filtersData.isDelete = filtersData.status ? filtersData.isDelete : ENUM_YN.NO;

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: CourseCart_SEARCHABLE_FIELDS.map(field =>
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
        field === 'user'
          ? { [field]: new Types.ObjectId(value) }
          : field === 'course'
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

  // const result = await CourseCart.find(whereConditions)
  //   .sort(sortConditions)
  //   .skip(Number(skip))
  //   .limit(Number(limit))
  //   .populate('course user');

  const pipeline: PipelineStage[] = [
    { $match: whereConditions },
    { $sort: sortConditions },
    { $skip: Number(skip) || 0 },
    { $limit: Number(limit) || 15 },
    {
      $lookup: {
        from: 'users',
        let: { id: '$user' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', '$$id'] },
              // Additional filter conditions for collection2
            },
          },
          {
            $project: {
              title: 1,
            },
          },
        ],
        as: 'userDetails',
      },
    },
    {
      $lookup: {
        from: 'courses',
        let: { id: '$course' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', '$$id'] },
              // Additional filter conditions for collection2
            },
          },
          {
            $project: {
              title: 1,
            },
          },
        ],
        as: 'courseDetails',
      },
    },
  ];

  const result = await CourseCart.aggregate(pipeline);
  const total = await CourseCart.countDocuments(whereConditions);
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
const getSingleCourseCartFromDb = async (
  id: string,
): Promise<ICourseCart | null> => {
  const result = await CourseCart.aggregate([
    { $match: { _id: new ObjectId(id) } },
    {
      $lookup: {
        from: 'users',
        let: { id: '$user' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', '$$id'] },
              // Additional filter conditions for collection2
            },
          },
          {
            $project: {
              title: 1,
            },
          },
        ],
        as: 'userDetails',
      },
    },
    {
      $lookup: {
        from: 'courses',
        let: { id: '$course' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', '$$id'] },
              // Additional filter conditions for collection2
            },
          },
          {
            $project: {
              title: 1,
            },
          },
        ],
        as: 'courseDetails',
      },
    },
  ]);

  return result[0];
};

// update e form db
const updateCourseCartFromDb = async (
  id: string,
  payload: Partial<ICourseCart>,
): Promise<ICourseCart | null> => {
  const result = await CourseCart.findOneAndUpdate({ _id: id }, payload, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new ApiError(500, 'CourseCart update fail!!😪😭😰');
  }
  return result;
};

// delete e form db
const deleteCourseCartByIdFromDb = async (
  id: string,
  query: ICourseCartFilters,
): Promise<ICourseCart | null> => {
  let result;
  if (query.delete === ENUM_YN.YES) {
    result = await CourseCart.findByIdAndDelete(id);
  } else {
    result = await CourseCart.findOneAndUpdate(
      { _id: id },
      { status: ENUM_STATUS.DEACTIVATE, isDelete: ENUM_YN.YES },
    );
  }
  return result;
};

// set user reviews e form db
const CourseCartReviewsByUserFromDb = async (): Promise<ICourseCart | null> => {
  return null;
};

export const CourseCartService = {
  createCourseCartByDb,
  getAllCourseCartFromDb,
  getSingleCourseCartFromDb,
  updateCourseCartFromDb,
  deleteCourseCartByIdFromDb,
  CourseCartReviewsByUserFromDb,
};
